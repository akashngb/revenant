"""
Access control: resolve user identity into a storage-level AccessFilter.

This is the single point where we translate "who is this user" into
"what data can they see". The filter is then passed to MemoryStore,
which enforces it via RLS + query predicates.
"""
from app.models.base import Namespace, UserRole
from app.models.user import User
from app.storage.interface import AccessFilter


def resolve_access(user: User) -> AccessFilter:
    if user.role == UserRole.ADMIN:
        allowed_ns = [Namespace.INDIVIDUAL, Namespace.TEAM, Namespace.COMPANY]
        tags = ["admin", "internal", "sensitive", "public"]
    elif user.role == UserRole.MANAGER:
        allowed_ns = [Namespace.INDIVIDUAL, Namespace.TEAM, Namespace.COMPANY]
        tags = ["internal", "public"]
    else:
        allowed_ns = [Namespace.INDIVIDUAL, Namespace.TEAM, Namespace.COMPANY]
        tags = ["public"]

    return AccessFilter(
        org_id=user.org_id,
        user_id=user.user_id,
        team_id=user.team_id,
        allowed_namespaces=allowed_ns,
        access_tags=tags,
    )
