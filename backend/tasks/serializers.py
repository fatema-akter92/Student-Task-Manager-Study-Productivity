from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    is_overdue = serializers.ReadOnlyField()

    class Meta:
        model = Task
        fields = [
            'id',
            'title',
            'description',
            'completed',
            'subject',
            'priority',
            'due_date',
            'estimated_minutes',
            'created_at',
            'updated_at',
            'is_overdue',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'is_overdue']

    def validate_title(self, value):
        trimmed = value.strip()
        if not trimmed:
            raise serializers.ValidationError("Task title cannot be empty.")
        if len(trimmed) < 2:
            raise serializers.ValidationError("Task title must be at least 2 characters long.")
        return trimmed
