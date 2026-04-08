from enum import Enum


class Role(str, Enum):
    SUPER_ADMIN = "super_admin"
    ADMIN = "admin"
    INSTRUCTOR = "instructor"
    SUB_ADMIN = "sub_admin"
    STUDENT = "student"
