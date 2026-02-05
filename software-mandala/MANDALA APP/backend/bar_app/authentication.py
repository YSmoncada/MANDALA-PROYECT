from rest_framework import permissions
from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication

class IsSuperUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and (request.user.is_superuser or request.user.is_staff))

class GlobalAuthentication(TokenAuthentication, SessionAuthentication, BasicAuthentication):
    """
    Combina Token, Session y Basic Auth con bypass de CSRF.
    """
    def enforce_csrf(self, request):
        return
