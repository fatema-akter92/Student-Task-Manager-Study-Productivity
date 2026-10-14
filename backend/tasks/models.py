from django.db import models
from django.utils import timezone

class Task(models.Model):
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]

    SUBJECT_CHOICES = [
        ('General', 'General'),
        ('Computer Science', 'Computer Science'),
        ('Mathematics', 'Mathematics'),
        ('Physics', 'Physics'),
        ('Biology', 'Biology'),
        ('Chemistry', 'Chemistry'),
        ('Literature', 'Literature'),
        ('History', 'History'),
        ('Exam Prep', 'Exam Prep'),
    ]

    title = models.CharField(max_length=255, help_text="Title of the student task")
    description = models.TextField(blank=True, default='', help_text="Optional task notes or details")
    completed = models.BooleanField(default=False, help_text="Completion status")
    subject = models.CharField(max_length=100, choices=SUBJECT_CHOICES, default='General')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    due_date = models.DateField(null=True, blank=True, help_text="Deadline for the assignment/task")
    estimated_minutes = models.PositiveIntegerField(default=30, help_text="Estimated study/work time in minutes")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['completed', '-created_at']

    def __str__(self):
        status = "✓" if self.completed else "○"
        return f"[{status}] {self.title} ({self.subject})"

    @property
    def is_overdue(self):
        if self.due_date and not self.completed:
            return self.due_date < timezone.localdate()
        return False
