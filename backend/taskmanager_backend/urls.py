"""
URL configuration for taskmanager_backend project.
Serves both the REST API and the production-built React frontend.
"""
from pathlib import Path
from django.contrib import admin
from django.urls import path, include, re_path
from django.http import JsonResponse, FileResponse
from django.views.static import serve
from django.conf import settings

BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIST = BASE_DIR.parent / 'frontend' / 'dist'

def api_root_view(request):
    return JsonResponse({
        "project": "Student Task Manager API",
        "version": "1.0.0",
        "endpoints": {
            "tasks": "/api/tasks/",
            "stats": "/api/tasks/stats/",
            "seed": "/api/tasks/seed/ (POST)",
            "clear_completed": "/api/tasks/clear_completed/ (DELETE)",
            "admin": "/admin/",
        },
        "status": "online"
    })

def serve_react_app(request):
    index_file = FRONTEND_DIST / 'index.html'
    if index_file.exists():
        return FileResponse(open(index_file, 'rb'), content_type='text/html')
    return api_root_view(request)

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),

    # Django REST Framework API Endpoints
    path('api/', include('tasks.urls')),
    path('api/status/', api_root_view, name='api-root'),

    # Serve Vite compiled assets directly if present
    re_path(r'^assets/(?P<path>.*)$', serve, {
        'document_root': FRONTEND_DIST / 'assets'
    }),

    # Single Page App fallback to index.html
    path('', serve_react_app, name='react-app-root'),
]
