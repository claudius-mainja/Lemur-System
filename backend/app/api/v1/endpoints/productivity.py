from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timezone
import uuid

from app.db.database import get_db
from app.models.models import User, Meeting, CalendarEvent, Task, Project, Activity
from app.schemas.schemas import (
    MeetingCreate, MeetingResponse, CalendarEventCreate, CalendarEventResponse,
    TaskCreate, TaskResponse, ProjectCreate, ProjectResponse, MessageResponse
)
from app.api.v1.endpoints.auth import get_current_user

router = APIRouter()

def get_current_user_id(current_user: User = Depends(get_current_user)) -> str:
    return current_user.id

# Meetings
@router.get("/meetings", response_model=List[MeetingResponse])
def get_meetings(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Meeting).filter(Meeting.organization_id == current_user.organization_id)
    
    if start_date:
        query = query.filter(Meeting.start_time >= start_date)
    if end_date:
        query = query.filter(Meeting.end_time <= end_date)
    
    meetings = query.order_by(Meeting.start_time.asc()).all()
    return meetings

@router.post("/meetings", response_model=MeetingResponse)
def create_meeting(
    meeting_data: MeetingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    meeting = Meeting(
        id=str(uuid.uuid4()),
        organization_id=current_user.organization_id,
        title=meeting_data.title,
        description=meeting_data.description,
        meeting_type=meeting_data.meeting_type,
        location=meeting_data.location,
        meeting_link=meeting_data.meeting_link,
        start_time=meeting_data.start_time,
        end_time=meeting_data.end_time,
        organizer_id=current_user.id,
        attendee_ids=meeting_data.attendee_ids,
        attendee_emails=meeting_data.attendee_emails,
        reminder=meeting_data.reminder,
        status="scheduled"
    )
    
    db.add(meeting)
    db.commit()
    db.refresh(meeting)
    return meeting

@router.get("/meetings/{meeting_id}", response_model=MeetingResponse)
def get_meeting(
    meeting_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    meeting = db.query(Meeting).filter(
        Meeting.id == meeting_id,
        Meeting.organization_id == current_user.organization_id
    ).first()
    
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    
    return meeting

@router.put("/meetings/{meeting_id}", response_model=MeetingResponse)
def update_meeting(
    meeting_id: str,
    meeting_data: MeetingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    meeting = db.query(Meeting).filter(
        Meeting.id == meeting_id,
        Meeting.organization_id == current_user.organization_id
    ).first()
    
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    
    meeting.title = meeting_data.title
    meeting.description = meeting_data.description
    meeting.meeting_type = meeting_data.meeting_type
    meeting.location = meeting_data.location
    meeting.meeting_link = meeting_data.meeting_link
    meeting.start_time = meeting_data.start_time
    meeting.end_time = meeting_data.end_time
    meeting.attendee_ids = meeting_data.attendee_ids
    meeting.attendee_emails = meeting_data.attendee_emails
    meeting.reminder = meeting_data.reminder
    
    db.commit()
    db.refresh(meeting)
    return meeting

@router.delete("/meetings/{meeting_id}", response_model=MessageResponse)
def delete_meeting(
    meeting_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    meeting = db.query(Meeting).filter(
        Meeting.id == meeting_id,
        Meeting.organization_id == current_user.organization_id
    ).first()
    
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    
    db.delete(meeting)
    db.commit()
    return MessageResponse(message="Meeting deleted successfully")

# Calendar Events
@router.get("/calendar", response_model=List[CalendarEventResponse])
def get_calendar_events(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(CalendarEvent).filter(CalendarEvent.organization_id == current_user.organization_id)
    
    if start_date:
        query = query.filter(CalendarEvent.start_date >= start_date)
    if end_date:
        query = query.filter(CalendarEvent.end_date <= end_date)
    
    events = query.order_by(CalendarEvent.start_date.asc()).all()
    return events

@router.post("/calendar", response_model=CalendarEventResponse)
def create_calendar_event(
    event_data: CalendarEventCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    event = CalendarEvent(
        id=str(uuid.uuid4()),
        organization_id=current_user.organization_id,
        title=event_data.title,
        description=event_data.description,
        event_type=event_data.event_type,
        start_date=event_data.start_date,
        end_date=event_data.end_date,
        all_day=event_data.all_day,
        location=event_data.location,
        reminder=event_data.reminder,
        color=event_data.color,
        created_by=current_user.id,
        attendees=event_data.attendees
    )
    
    db.add(event)
    db.commit()
    db.refresh(event)
    return event

@router.get("/calendar/{event_id}", response_model=CalendarEventResponse)
def get_calendar_event(
    event_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    event = db.query(CalendarEvent).filter(
        CalendarEvent.id == event_id,
        CalendarEvent.organization_id == current_user.organization_id
    ).first()
    
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    return event

@router.put("/calendar/{event_id}", response_model=CalendarEventResponse)
def update_calendar_event(
    event_id: str,
    event_data: CalendarEventCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    event = db.query(CalendarEvent).filter(
        CalendarEvent.id == event_id,
        CalendarEvent.organization_id == current_user.organization_id
    ).first()
    
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    event.title = event_data.title
    event.description = event_data.description
    event.event_type = event_data.event_type
    event.start_date = event_data.start_date
    event.end_date = event_data.end_date
    event.all_day = event_data.all_day
    event.location = event_data.location
    event.reminder = event_data.reminder
    event.color = event_data.color
    event.attendees = event_data.attendees
    
    db.commit()
    db.refresh(event)
    return event

@router.delete("/calendar/{event_id}", response_model=MessageResponse)
def delete_calendar_event(
    event_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    event = db.query(CalendarEvent).filter(
        CalendarEvent.id == event_id,
        CalendarEvent.organization_id == current_user.organization_id
    ).first()
    
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    db.delete(event)
    db.commit()
    return MessageResponse(message="Event deleted successfully")

# Tasks
@router.get("/tasks", response_model=List[TaskResponse])
def get_tasks(
    status: Optional[str] = None,
    assigned_to: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Task).filter(Task.organization_id == current_user.organization_id)
    
    if status:
        query = query.filter(Task.status == status)
    if assigned_to:
        query = query.filter(Task.assigned_to == assigned_to)
    
    tasks = query.order_by(Task.created_at.desc()).all()
    return tasks

@router.post("/tasks", response_model=TaskResponse)
def create_task(
    task_data: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    task = Task(
        id=str(uuid.uuid4()),
        organization_id=current_user.organization_id,
        title=task_data.title,
        description=task_data.description,
        project_id=task_data.project_id,
        priority=task_data.priority,
        due_date=task_data.due_date,
        created_by=current_user.id,
        assigned_to=current_user.id,
        status="todo"
    )
    
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

@router.put("/tasks/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: str,
    task_data: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    task = db.query(Task).filter(
        Task.id == task_id,
        Task.organization_id == current_user.organization_id
    ).first()
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task.title = task_data.title
    task.description = task_data.description
    task.project_id = task_data.project_id
    task.priority = task_data.priority
    task.due_date = task_data.due_date
    
    db.commit()
    db.refresh(task)
    return task

@router.put("/tasks/{task_id}/complete", response_model=TaskResponse)
def complete_task(
    task_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    task = db.query(Task).filter(
        Task.id == task_id,
        Task.organization_id == current_user.organization_id
    ).first()
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task.status = "completed"
    task.completed_at = datetime.now(timezone.utc)
    
    db.commit()
    db.refresh(task)
    return task

@router.delete("/tasks/{task_id}", response_model=MessageResponse)
def delete_task(
    task_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    task = db.query(Task).filter(
        Task.id == task_id,
        Task.organization_id == current_user.organization_id
    ).first()
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db.delete(task)
    db.commit()
    return MessageResponse(message="Task deleted successfully")

# Projects
@router.get("/projects", response_model=List[ProjectResponse])
def get_projects(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    projects = db.query(Project).filter(
        Project.organization_id == current_user.organization_id
    ).order_by(Project.created_at.desc()).all()
    return projects

@router.post("/projects", response_model=ProjectResponse)
def create_project(
    project_data: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = Project(
        id=str(uuid.uuid4()),
        organization_id=current_user.organization_id,
        name=project_data.name,
        description=project_data.description,
        start_date=project_data.start_date,
        end_date=project_data.end_date,
        budget=project_data.budget,
        currency=current_user.currency,
        owner_id=current_user.id,
        status="planning"
    )
    
    db.add(project)
    db.commit()
    db.refresh(project)
    return project

@router.get("/projects/{project_id}", response_model=ProjectResponse)
def get_project(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.organization_id == current_user.organization_id
    ).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return project

@router.put("/projects/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: str,
    project_data: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.organization_id == current_user.organization_id
    ).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    project.name = project_data.name
    project.description = project_data.description
    project.start_date = project_data.start_date
    project.end_date = project_data.end_date
    project.budget = project_data.budget
    
    db.commit()
    db.refresh(project)
    return project

@router.delete("/projects/{project_id}", response_model=MessageResponse)
def delete_project(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.organization_id == current_user.organization_id
    ).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    db.delete(project)
    db.commit()
    return MessageResponse(message="Project deleted successfully")

# Dashboard Stats
@router.get("/dashboard/stats")
def get_productivity_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    today = datetime.now(timezone.utc).date()
    
    upcoming_meetings = db.query(Meeting).filter(
        Meeting.organization_id == current_user.organization_id,
        Meeting.start_time >= datetime.now(timezone.utc)
    ).count()
    
    pending_tasks = db.query(Task).filter(
        Task.organization_id == current_user.organization_id,
        Task.status == "todo"
    ).count()
    
    completed_tasks = db.query(Task).filter(
        Task.organization_id == current_user.organization_id,
        Task.status == "completed"
    ).count()
    
    active_projects = db.query(Project).filter(
        Project.organization_id == current_user.organization_id,
        Project.status.in_(["planning", "in_progress"])
    ).count()
    
    return {
        "upcoming_meetings": upcoming_meetings,
        "pending_tasks": pending_tasks,
        "completed_tasks": completed_tasks,
        "active_projects": active_projects
    }
