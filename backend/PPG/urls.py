from django.contrib import admin
from django.urls import path, include
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.shortcuts import redirect

schema_view = get_schema_view(
    openapi.Info(
        title="Appointment Booking API",
        default_version='v1',
        description="API documentation for the Appointment Booking System",
        contact=openapi.Contact(email="you@example.com"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
    authentication_classes=[],
)

def api_redirect(request):
    return redirect('/swagger/')

urlpatterns = [
    path('api/', api_redirect),  # 👈 add this line first!
    path('api/', include('reservations.urls')),

    path('admin/', admin.site.urls),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
