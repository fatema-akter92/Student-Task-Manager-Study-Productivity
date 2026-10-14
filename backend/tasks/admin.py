from django.contrib import admin
from .models import Task

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'subject', 'priority', 'due_date', 'completed', 'created_at')
    list_filter = ('completed', 'priority', 'subject', 'due_date')
    search_fields = ('title', 'description')
    ordering = ('completed', '-created_at')
