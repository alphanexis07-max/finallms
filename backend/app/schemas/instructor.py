from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CourseCreate(BaseModel):
    title: str
    description: str
    price: str  # "free" or "paid"


class CourseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[str] = None


class CourseOut(BaseModel):
    id: str
    title: str
    description: str
    price: str
    instructor_id: str
    created_at: datetime

class ClassOut(BaseModel):
    id: str
    title: str
    course_id: str
    start_time: datetime
    end_time: datetime
    status: str
    meeting_link: str

class TestCreate(BaseModel):
    title: str
    course_id: str
    duration: int  # in minutes
    total_questions: int
    scheduled_at: datetime


class TestUpdate(BaseModel):
    title: Optional[str] = None
    duration: Optional[int] = None
    scheduled_at: Optional[datetime] = None
    is_published: Optional[bool] = None

class QuestionCreate(BaseModel):
    test_id: str
    question: str
    options: list[str]
    correct_answer: str

class SubmitTest(BaseModel):
    test_id: str
    answers: dict  # {question_id: selected_option}

