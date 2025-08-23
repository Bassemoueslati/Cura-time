from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.user_role == 'admin'


class IsClient(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.user_role == 'client'

class IsDoctor(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.user_role == 'doctor'