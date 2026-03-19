from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date, datetime
import uuid

from app.db.database import get_db
from app.models.models import Employee, User, LeaveRequest
from app.schemas.schemas import EmployeeCreate, EmployeeResponse, MessageResponse
from app.api.v1.endpoints.auth import get_current_user

router = APIRouter()

# Dashboard Stats
@router.get("/dashboard/stats")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    employees = db.query(Employee).filter(
        Employee.organization_id == current_user.organization_id
    ).all()
    
    total = len(employees)
    active = len([e for e in employees if e.status == "active"])
    on_leave = len([e for e in employees if e.status == "on_leave"])
    
    # Count new hires in last 30 days
    thirty_days_ago = datetime.now().replace(day=1)
    if datetime.now().month == 1:
        thirty_days_ago = thirty_days_ago.replace(year=datetime.now().year - 1, month=12)
    else:
        thirty_days_ago = thirty_days_ago.replace(month=datetime.now().month - 1)
    
    new_hires = len([e for e in employees if e.created_at and e.created_at >= thirty_days_ago])
    
    return {
        "totalEmployees": total,
        "activeEmployees": active,
        "onLeave": on_leave,
        "newHires": new_hires
    }

# Employees
@router.get("/employees", response_model=List[EmployeeResponse])
def get_employees(
    page: int = 1,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    employees = db.query(Employee).filter(
        Employee.organization_id == current_user.organization_id
    ).offset((page - 1) * limit).limit(limit).all()
    return employees

@router.get("/employees/{employee_id}", response_model=EmployeeResponse)
def get_employee(
    employee_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    employee = db.query(Employee).filter(
        Employee.id == employee_id,
        Employee.organization_id == current_user.organization_id
    ).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee

@router.post("/employees", response_model=EmployeeResponse)
def create_employee(
    employee_data: EmployeeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing = db.query(Employee).filter(
        Employee.email == employee_data.email,
        Employee.organization_id == current_user.organization_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Employee with this email already exists")
    
    employee = Employee(
        id=str(uuid.uuid4()),
        organization_id=current_user.organization_id,
        user_id=current_user.id,
        first_name=employee_data.first_name,
        last_name=employee_data.last_name,
        email=employee_data.email,
        phone=employee_data.phone,
        department=employee_data.department,
        position=employee_data.position,
        start_date=employee_data.start_date,
        salary=employee_data.salary
    )
    db.add(employee)
    db.commit()
    db.refresh(employee)
    return employee

@router.put("/employees/{employee_id}", response_model=EmployeeResponse)
def update_employee(
    employee_id: str,
    employee_data: EmployeeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    employee = db.query(Employee).filter(
        Employee.id == employee_id,
        Employee.organization_id == current_user.organization_id
    ).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    for key, value in employee_data.model_dump().items():
        if value is not None:
            setattr(employee, key, value)
    
    db.commit()
    db.refresh(employee)
    return employee

@router.delete("/employees/{employee_id}", response_model=MessageResponse)
def delete_employee(
    employee_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    employee = db.query(Employee).filter(
        Employee.id == employee_id,
        Employee.organization_id == current_user.organization_id
    ).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    db.delete(employee)
    db.commit()
    return MessageResponse(message="Employee deleted successfully")

@router.post("/employees/{employee_id}/terminate")
def terminate_employee(
    employee_id: str,
    termination_data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    employee = db.query(Employee).filter(
        Employee.id == employee_id,
        Employee.organization_id == current_user.organization_id
    ).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    employee.status = "terminated"
    employee.termination_date = datetime.now()
    db.commit()
    return MessageResponse(message="Employee terminated successfully")

# Departments
@router.get("/departments")
def get_departments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    employees = db.query(Employee).filter(
        Employee.organization_id == current_user.organization_id
    ).all()
    
    departments = {}
    for emp in employees:
        dept = emp.department or "Unassigned"
        if dept not in departments:
            departments[dept] = {
                "id": str(uuid.uuid4()),
                "name": dept,
                "description": f"{dept} department",
                "employeeCount": 0,
                "createdAt": datetime.now().isoformat()
            }
        departments[dept]["employeeCount"] += 1
    
    return list(departments.values())

@router.post("/departments")
def create_department(
    department_data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return {
        "id": str(uuid.uuid4()),
        "name": department_data.get("name"),
        "description": department_data.get("description", ""),
        "employeeCount": 0,
        "createdAt": datetime.now().isoformat()
    }

# Leave Requests
@router.get("/leave-requests")
def get_leave_requests(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    leave_requests = db.query(LeaveRequest).filter(
        LeaveRequest.organization_id == current_user.organization_id
    ).all()
    return leave_requests

@router.post("/leave-requests")
def create_leave_request(
    leave_data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    leave_request = LeaveRequest(
        id=str(uuid.uuid4()),
        organization_id=current_user.organization_id,
        employee_id=leave_data.get("employee_id", str(current_user.id)),
        employee_name=leave_data.get("employee_name", current_user.first_name),
        leave_type=leave_data.get("leave_type", "annual"),
        start_date=datetime.strptime(leave_data["start_date"], "%Y-%m-%d").date() if isinstance(leave_data.get("start_date"), str) else leave_data.get("start_date"),
        end_date=datetime.strptime(leave_data["end_date"], "%Y-%m-%d").date() if isinstance(leave_data.get("end_date"), str) else leave_data.get("end_date"),
        days=leave_data.get("days", 1),
        reason=leave_data.get("reason", ""),
        status="pending"
    )
    db.add(leave_request)
    db.commit()
    db.refresh(leave_request)
    return leave_request

@router.put("/leave-requests/{request_id}/approve")
def approve_leave_request(
    request_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    leave_request = db.query(LeaveRequest).filter(
        LeaveRequest.id == request_id,
        LeaveRequest.organization_id == current_user.organization_id
    ).first()
    if not leave_request:
        raise HTTPException(status_code=404, detail="Leave request not found")
    
    leave_request.status = "approved"
    leave_request.approved_by = current_user.first_name
    leave_request.approved_at = datetime.now().date()
    db.commit()
    return leave_request

# Leave Balances
@router.get("/leave-balances")
def get_leave_balances(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return [
        {"type": "annual", "total": 15, "used": 0, "pending": 0},
        {"type": "sick", "total": 10, "used": 0, "pending": 0},
        {"type": "personal", "total": 5, "used": 0, "pending": 0}
    ]

@router.post("/leave-balances")
def create_leave_balance(
    balance_data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return balance_data

# Attendance
@router.get("/attendance")
def get_attendance(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return []

@router.post("/attendance")
def record_attendance(
    attendance_data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return {"status": "recorded", "employee_id": attendance_data.get("employee_id")}

# Stats
@router.get("/stats")
def get_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    employees = db.query(Employee).filter(
        Employee.organization_id == current_user.organization_id
    ).all()
    
    leave_requests = db.query(LeaveRequest).filter(
        LeaveRequest.organization_id == current_user.organization_id
    ).all()
    
    return {
        "totalEmployees": len(employees),
        "activeEmployees": len([e for e in employees if e.status == "active"]),
        "onLeave": len([e for e in employees if e.status == "on_leave"]),
        "pendingLeaveRequests": len([l for l in leave_requests if l.status == "pending"])
    }

# Leave (alternative endpoints)
@router.get("/leave")
def get_leave(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_leave_requests(db, current_user)

@router.post("/leave")
def create_leave(
    leave_data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return create_leave_request(leave_data, db, current_user)

@router.put("/leave/{leave_id}")
def update_leave(
    leave_id: str,
    leave_data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    leave_request = db.query(LeaveRequest).filter(
        LeaveRequest.id == leave_id,
        LeaveRequest.organization_id == current_user.organization_id
    ).first()
    if not leave_request:
        raise HTTPException(status_code=404, detail="Leave request not found")
    
    for key, value in leave_data.items():
        if hasattr(leave_request, key):
            setattr(leave_request, key, value)
    
    db.commit()
    db.refresh(leave_request)
    return leave_request

@router.get("/leave/stats")
def get_leave_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    leave_requests = db.query(LeaveRequest).filter(
        LeaveRequest.organization_id == current_user.organization_id
    ).all()
    
    return {
        "total": len(leave_requests),
        "pending": len([l for l in leave_requests if l.status == "pending"]),
        "approved": len([l for l in leave_requests if l.status == "approved"]),
        "rejected": len([l for l in leave_requests if l.status == "rejected"])
    }
