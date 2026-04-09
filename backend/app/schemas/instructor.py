from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


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
    duration: int = 45
    total_questions: int = 0
    scheduled_at: Optional[datetime] = None
    description: Optional[str] = None
    class_name: Optional[str] = None
    subject: Optional[str] = None
    deadline_at: Optional[datetime] = None
    attempts_allowed: int = 1
    shuffle_questions: bool = False
    show_results_instantly: bool = True
    is_published: bool = False


class TestUpdate(BaseModel):
    title: Optional[str] = None
    course_id: Optional[str] = None
    duration: Optional[int] = None
    total_questions: Optional[int] = None
    scheduled_at: Optional[datetime] = None
    description: Optional[str] = None
    class_name: Optional[str] = None
    subject: Optional[str] = None
    deadline_at: Optional[datetime] = None
    attempts_allowed: Optional[int] = None
    shuffle_questions: Optional[bool] = None
    show_results_instantly: Optional[bool] = None
    is_published: Optional[bool] = None


class QuestionCreate(BaseModel):
    test_id: str
    question: str
    options: list[str] = Field(default_factory=list)
    correct_answer: str = ""
    points: int = 1
    question_type: str = "multiple-choice"
    order: int = 0


class QuestionUpdate(BaseModel):
    question: Optional[str] = None
    options: Optional[list[str]] = None
    correct_answer: Optional[str] = None
    points: Optional[int] = None
    question_type: Optional[str] = None
    order: Optional[int] = None


class SubmitTest(BaseModel):
    test_id: str
    answers: dict


from pydantic import BaseModel, Field
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
    duration: int = 45  # in minutes
    total_questions: int = 0
    scheduled_at: Optional[datetime] = None
    description: Optional[str] = None
    class_name: Optional[str] = None
    subject: Optional[str] = None
    deadline_at: Optional[datetime] = None
    attempts_allowed: int = 1
    shuffle_questions: bool = False
    show_results_instantly: bool = True
    is_published: bool = False


class TestUpdate(BaseModel):
    title: Optional[str] = None
    course_id: Optional[str] = None
    duration: Optional[int] = None
    scheduled_at: Optional[datetime] = None
    description: Optional[str] = None
    class_name: Optional[str] = None
    subject: Optional[str] = None
    deadline_at: Optional[datetime] = None
    attempts_allowed: Optional[int] = None
    shuffle_questions: Optional[bool] = None
    show_results_instantly: Optional[bool] = None
    total_questions: Optional[int] = None
    is_published: Optional[bool] = None

class QuestionCreate(BaseModel):
    test_id: str
    question: str
    options: list[str] = Field(default_factory=list)
    correct_answer: str = ""
    points: int = 1
    question_type: str = "multiple-choice"
    order: int = 0


class QuestionUpdate(BaseModel):
    question: Optional[str] = None
    options: Optional[list[str]] = None
    correct_answer: Optional[str] = None
    points: Optional[int] = None
    question_type: Optional[str] = None
    order: Optional[int] = None

class SubmitTest(BaseModel):
    test_id: str
    answers: dict  # {question_id: selected_option}

