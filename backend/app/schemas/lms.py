from datetime import datetime
from pydantic import BaseModel, Field


class TenantIn(BaseModel):
    name: str
    admin_email: str
    subscription_plan: str = "starter"


class TenantUpdateIn(BaseModel):
    name: str | None = None
    admin_email: str | None = None
    subscription_plan: str | None = None
    active: bool | None = None


class UserIn(BaseModel):
    full_name: str
    email: str
    role: str
    password: str = Field(default="ChangeMe@123", min_length=8, max_length=72)


class UserUpdateIn(BaseModel):
    full_name: str | None = None
    email: str | None = None
    role: str | None = None
    is_active: bool | None = None


class ResetPasswordIn(BaseModel):
    new_password: str = Field(min_length=8, max_length=72)


class CourseIn(BaseModel):
    title: str
    description: str = ""
    price: float = 0
    course_type: str = Field(default="free", pattern="^(free|paid|demo)$")
    youtube_url: str = ""


class CourseUpdateIn(BaseModel):
    title: str | None = None
    description: str | None = None
    price: float | None = None
    course_type: str | None = Field(default=None, pattern="^(free|paid|demo)$")
    youtube_url: str | None = None


class LiveClassIn(BaseModel):
    title: str
    course_id: str
    instructor_id: str
    attendee_ids: list[str] = Field(default_factory=list)
    start_at: datetime
    duration_minutes: int = 60
    amount: float = 0
    image_url: str = ""
    repeat_daily: bool = False
    class_name: str = ""
    subject: str = ""


class LiveClassUpdateIn(BaseModel):
    title: str | None = None
    instructor_id: str | None = None
    start_at: datetime | None = None
    duration_minutes: int | None = None
    amount: float | None = None
    image_url: str | None = None
    status: str | None = None
    class_name: str | None = None
    subject: str | None = None


class EnrollmentIn(BaseModel):
    course_id: str
    student_id: str


class RatingIn(BaseModel):
    target_type: str = Field(pattern="^(course|live_class)$")
    target_id: str
    rating: int = Field(ge=1, le=5)
    comment: str = ""


class CouponIn(BaseModel):
    code: str
    discount_type: str = Field(pattern="^(percent|flat)$")
    value: float
    max_uses: int = 100


class PlatformSettingsIn(BaseModel):
    commission_percent: float = 20.0


class PlanIn(BaseModel):
    name: str
    price: float
    billing_period: str = "monthly"
    active: bool = True


class PlanUpdateIn(BaseModel):
    name: str | None = None
    price: float | None = None
    billing_period: str | None = None
    active: bool | None = None


class LibraryResourceIn(BaseModel):
    title: str
    grade: str
    format: str
    file_url: str = ""
    image_url: str = ""


class LibraryResourceUpdateIn(BaseModel):
    title: str | None = None
    grade: str | None = None
    format: str | None = None
    file_url: str | None = None
    image_url: str | None = None


class ReportGenerateIn(BaseModel):
    report_type: str


class EventIn(BaseModel):
    title: str
    description: str = ""
    starts_at: datetime


class NotificationIn(BaseModel):
    user_id: str
    title: str
    message: str


class RazorpayOrderIn(BaseModel):
    amount: float
    enrollment_type: str = "course"
    target_id: str


class RazorpayVerifyIn(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
