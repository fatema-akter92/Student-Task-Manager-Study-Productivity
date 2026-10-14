from datetime import date, timedelta
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q, Count
from django.utils import timezone

from .models import Task
from .serializers import TaskSerializer

class TaskViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows student tasks to be viewed, created, edited, filtered, and deleted.
    """
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    def get_queryset(self):
        queryset = Task.objects.all()
        status_param = self.request.query_params.get('status')
        subject_param = self.request.query_params.get('subject')
        priority_param = self.request.query_params.get('priority')
        search_query = self.request.query_params.get('q')
        sort_by = self.request.query_params.get('sort', 'default')

        # Filter by status: 'completed' or 'pending'
        if status_param == 'completed':
            queryset = queryset.filter(completed=True)
        elif status_param == 'pending':
            queryset = queryset.filter(completed=False)

        # Filter by subject
        if subject_param and subject_param != 'All':
            queryset = queryset.filter(subject=subject_param)

        # Filter by priority
        if priority_param and priority_param != 'All':
            queryset = queryset.filter(priority=priority_param)

        # Search query across title and description
        if search_query:
            queryset = queryset.filter(
                Q(title__icontains=search_query) | Q(description__icontains=search_query)
            )

        # Sorting
        if sort_by == 'due_date':
            queryset = queryset.order_by('completed', 'due_date', '-created_at')
        elif sort_by == 'priority':
            # Ordering custom priority or alphabetical
            queryset = queryset.order_by('completed', '-priority', '-created_at')
        elif sort_by == 'title':
            queryset = queryset.order_by('completed', 'title')
        else:
            queryset = queryset.order_by('completed', '-created_at')

        return queryset

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """
        Returns rich student productivity statistics.
        """
        all_tasks = Task.objects.all()
        total_tasks = all_tasks.count()
        completed_tasks = all_tasks.filter(completed=True).count()
        pending_tasks = total_tasks - completed_tasks

        completion_rate = (
            round((completed_tasks / total_tasks) * 100, 1) if total_tasks > 0 else 0.0
        )

        today = timezone.localdate()
        overdue_tasks = all_tasks.filter(
            completed=False,
            due_date__lt=today
        ).count()

        high_priority = all_tasks.filter(
            completed=False,
            priority='high'
        ).count()

        subject_distribution = dict(
            all_tasks.values_list('subject').annotate(total=Count('id'))
        )

        return Response({
            'total_tasks': total_tasks,
            'completed_tasks': completed_tasks,
            'pending_tasks': pending_tasks,
            'completion_rate': completion_rate,
            'overdue_tasks': overdue_tasks,
            'high_priority_tasks': high_priority,
            'subject_distribution': subject_distribution,
        })

    @action(detail=True, methods=['patch'])
    def toggle(self, request, pk=None):
        """
        Toggle completed status of a specific task.
        """
        task = self.get_object()
        task.completed = not task.completed
        task.save()
        serializer = self.get_serializer(task)
        return Response(serializer.data)

    @action(detail=False, methods=['delete'])
    def clear_completed(self, request):
        """
        Delete all completed tasks.
        """
        deleted_count, _ = Task.objects.filter(completed=True).delete()
        return Response({'deleted': deleted_count}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])
    def seed(self, request):
        """
        Seed sample high-quality student tasks for demonstration and grading.
        """
        today = date.today()
        sample_tasks = [
            {
                "title": "Complete CS301 Binary Trees & Graph Algorithms Lab",
                "description": "Implement BFS, DFS traversal and submit GitHub repository link with unit tests.",
                "completed": False,
                "subject": "Computer Science",
                "priority": "high",
                "due_date": today + timedelta(days=1),
                "estimated_minutes": 60,
            },
            {
                "title": "Calculus III Problem Set: Stokes' Theorem & Green's Theorem",
                "description": "Exercises 4.1 to 4.15 from Chapter 8. Check answers against online study portal.",
                "completed": True,
                "subject": "Mathematics",
                "priority": "medium",
                "due_date": today - timedelta(days=1),
                "estimated_minutes": 45,
            },
            {
                "title": "Draft Literature Research Essay: Postmodern Symbolism",
                "description": "Write a 1,500-word comparative draft examining motifs and historical context.",
                "completed": False,
                "subject": "Literature",
                "priority": "medium",
                "due_date": today + timedelta(days=4),
                "estimated_minutes": 90,
            },
            {
                "title": "Physics Quiz Prep: Electromagnetic Induction Formulas",
                "description": "Review Faraday's Law, Lenz's Law, and solve 5 sample past paper problems.",
                "completed": False,
                "subject": "Physics",
                "priority": "high",
                "due_date": today + timedelta(days=2),
                "estimated_minutes": 40,
            },
            {
                "title": "Biology Lab Report: Cellular Respiration in Yeast",
                "description": "Record gas fermentation rates, plot graph curves, and format reference citations.",
                "completed": True,
                "subject": "Biology",
                "priority": "low",
                "due_date": today - timedelta(days=2),
                "estimated_minutes": 35,
            },
            {
                "title": "Organize Midterm Exam Revision Schedule & Flashcards",
                "description": "Review semester syllabus milestones and set active recall study deck.",
                "completed": False,
                "subject": "Exam Prep",
                "priority": "low",
                "due_date": today + timedelta(days=7),
                "estimated_minutes": 25,
            },
        ]

        # Reset sample tasks or add them
        created_count = 0
        for data in sample_tasks:
            Task.objects.create(**data)
            created_count += 1

        return Response({
            'message': f'Successfully seeded {created_count} sample student tasks.',
            'count': created_count
        }, status=status.HTTP_201_CREATED)
