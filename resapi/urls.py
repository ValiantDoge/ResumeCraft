from django.urls import path
from . import views

urlpatterns = [
    path('create-resume/', views.createResume, name='create-resume'),
]