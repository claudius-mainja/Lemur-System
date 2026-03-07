'use client';

import { useState, useRef } from 'react';
import { useDataStore, Employee, LeaveRequest, Department } from '@/stores/data.store';
import { useAuthStore } from '@/stores/auth.store';
import { 
  Users, UserPlus, Calendar, Building2, Plus, Search, MoreHorizontal,
  Download, Upload, Edit, Trash2, CheckCircle, XCircle, Clock,
  Filter, Mail, Phone, MapPin, FileText, Upload as UploadIcon, Eye,
  Printer, X, FileSpreadsheet
} from 'lucide-react';
import toast from 'react-hot-toast';

type ViewTab = 'employees' | 'leave' | 'departments';

export default function HRDashboard() {
  const { user } = useAuthStore();
  const { employees, leaveRequests, departments, addEmployee, updateEmployee, deleteEmployee, addLeaveRequest, updateLeaveRequest, addDepartment } = useDataStore();
  
  const [activeView, setActiveView] = useState<ViewTab>('employees');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showAddLeave, setShowAddLeave] = useState(false);
  const [showAddDepartment, setShowAddDepartment] = useState(false);
  const [showViewEmployee, setShowViewEmployee] = useState<Employee | null>(null);
  const [showViewLeave, setShowViewLeave] = useState<LeaveRequest | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');

  const filteredEmployees = employees.filter(e => {
    const matchesSearch = 
      `${e.firstName} ${e.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || e.status === filterStatus;
    const matchesDept = filterDepartment === 'all' || e.department === filterDepartment;
    return matchesSearch && matchesStatus && matchesDept;
  });

  const filteredLeaveRequests = leaveRequests.filter(l =>
    l.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    totalEmployees: employees.length,
    activeEmployees: employees.filter(e => e.status === 'active').length,
    onLeave: employees.filter(e => e.status === 'on_leave').length,
    pendingLeaves: leaveRequests.filter(l => l.status === 'pending').length,
  };

  const exportEmployeesCSV = () => {
    const headers = ['ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Department', 'Position', 'Salary', 'Hire Date', 'Status'];
    const rows = employees.map(e => [
      e.id, e.firstName, e.lastName, e.email, e.phone, e.department, e.position, e.salary, e.hireDate, e.status
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `employees_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Employees exported to CSV!');
  };

  const exportLeaveReport = () => {
    const headers = ['Employee', 'Type', 'Start Date', 'End Date', 'Days', 'Status', 'Approved By'];
    const rows = leaveRequests.map(l => [
      l.employeeName, l.type, l.startDate, l.endDate, l.days, l.status, l.approvedBy || '-'
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leave_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Leave report exported!');
  };

  const handleAddEmployee = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newEmployee = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      department: formData.get('department') as string,
      position: formData.get('position') as string,
      salary: parseFloat(formData.get('salary') as string),
      hireDate: formData.get('hireDate') as string,
      status: 'active' as const,
      address: formData.get('address') as string,
      emergencyContact: formData.get('emergencyContact') as string,
      emergencyPhone: formData.get('emergencyPhone') as string,
      resumeUrl: resumeFile ? URL.createObjectURL(resumeFile) : undefined,
    };
    addEmployee(newEmployee);
    setShowAddEmployee(false);
    setResumeFile(null);
    toast.success('Employee added successfully!');
  };

  const handleAddLeave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const employee = employees.find(e => e.id === formData.get('employeeId'));
    addLeaveRequest({
      employeeId: formData.get('employeeId') as string,
      employeeName: employee ? `${employee.firstName} ${employee.lastName}` : '',
      type: formData.get('type') as any,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
      days: parseInt(formData.get('days') as string),
      reason: formData.get('reason') as string,
      status: 'pending',
    });
    setShowAddLeave(false);
    toast.success('Leave request submitted!');
  };

  const handleApproveLeave = (id: string) => {
    updateLeaveRequest(id, {
      status: 'approved',
      approvedBy: `${user?.firstName} ${user?.lastName}`,
      approvedDate: new Date().toISOString().split('T')[0],
    });
    toast.success('Leave request approved!');
  };

  const handleRejectLeave = (id: string) => {
    updateLeaveRequest(id, {
      status: 'rejected',
      approvedBy: `${user?.firstName} ${user?.lastName}`,
      approvedDate: new Date().toISOString().split('T')[0],
    });
    toast.success('Leave request rejected');
  };

  const handleAddDepartment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const manager = employees.find(e => e.id === formData.get('managerId'));
    addDepartment({
      name: formData.get('name') as string,
      managerId: formData.get('managerId') as string,
      managerName: manager ? `${manager.firstName} ${manager.lastName}` : '',
      employeeCount: 0,
      budget: parseFloat(formData.get('budget') as string),
    });
    setShowAddDepartment(false);
    toast.success('Department added successfully!');
  };

  const printEmployeeCard = (employee: Employee) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Employee ID Card - ${employee.firstName} ${employee.lastName}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .card { border: 2px solid #333; border-radius: 10px; padding: 20px; max-width: 400px; margin: 0 auto; }
              .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 15px; }
              .photo { width: 100px; height: 100px; background: #4F46E5; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 36px; margin: 0 auto 15px; }
              .name { font-size: 24px; font-weight: bold; text-align: center; }
              .position { font-size: 16px; color: #666; text-align: center; margin-bottom: 15px; }
              .info { margin: 10px 0; }
              .label { font-weight: bold; color: #666; }
              .footer { text-align: center; margin-top: 20px; padding-top: 10px; border-top: 1px solid #ccc; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="card">
              <div class="header">
                <div class="photo">${employee.firstName[0]}${employee.lastName[0]}</div>
                <div class="name">${employee.firstName} ${employee.lastName}</div>
                <div class="position">${employee.position}</div>
              </div>
              <div class="info"><span class="label">Employee ID:</span> ${employee.id}</div>
              <div class="info"><span class="label">Department:</span> ${employee.department}</div>
              <div class="info"><span class="label">Email:</span> ${employee.email}</div>
              <div class="info"><span class="label">Phone:</span> ${employee.phone}</div>
              <div class="info"><span class="label">Hire Date:</span> ${employee.hireDate}</div>
              <div class="info"><span class="label">Status:</span> ${employee.status}</div>
              <div class="footer">
                LemurSystem ERP | Generated on ${new Date().toLocaleDateString()}
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Human Resources</h1>
          <p className="text-slate-500">Manage employees, leave requests, and departments</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setActiveView('employees')} className={`px-4 py-2 rounded-lg font-medium ${activeView === 'employees' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>
            Employees
          </button>
          <button onClick={() => setActiveView('leave')} className={`px-4 py-2 rounded-lg font-medium ${activeView === 'leave' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>
            Leave Requests
          </button>
          <button onClick={() => setActiveView('departments')} className={`px-4 py-2 rounded-lg font-medium ${activeView === 'departments' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>
            Departments
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.totalEmployees}</p>
              <p className="text-sm text-slate-500">Total Employees</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.activeEmployees}</p>
              <p className="text-sm text-slate-500">Active</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.onLeave}</p>
              <p className="text-sm text-slate-500">On Leave</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.pendingLeaves}</p>
              <p className="text-sm text-slate-500">Pending Requests</p>
            </div>
          </div>
        </div>
      </div>

      {activeView === 'employees' && (
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex gap-2 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="on_leave">On Leave</option>
                <option value="inactive">Inactive</option>
              </select>
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Departments</option>
                {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
              </select>
            </div>
            <div className="flex gap-2">
              <button onClick={exportEmployeesCSV} className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4" /> Export CSV
              </button>
              <button onClick={() => setShowAddEmployee(true)} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Employee
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Employee</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Department</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Position</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Hire Date</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                          {employee.firstName[0]}{employee.lastName[0]}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{employee.firstName} {employee.lastName}</p>
                          <p className="text-sm text-slate-500">{employee.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{employee.department}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{employee.position}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        employee.status === 'active' ? 'bg-green-100 text-green-700' :
                        employee.status === 'on_leave' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {employee.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{employee.hireDate}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => setShowViewEmployee(employee)} className="p-1 hover:bg-slate-100 rounded" title="View Details">
                          <Eye className="w-4 h-4 text-slate-400" />
                        </button>
                        <button onClick={() => printEmployeeCard(employee)} className="p-1 hover:bg-slate-100 rounded" title="Print ID Card">
                          <Printer className="w-4 h-4 text-slate-400" />
                        </button>
                        <button className="p-1 hover:bg-slate-100 rounded" title="More Actions">
                          <MoreHorizontal className="w-4 h-4 text-slate-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeView === 'leave' && (
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search leave requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={exportLeaveReport} className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4" /> Export Report
              </button>
              <button onClick={() => setShowAddLeave(true)} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
                <Plus className="w-4 h-4" /> Request Leave
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Employee</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Dates</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Days</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredLeaveRequests.map((leave) => (
                  <tr key={leave.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{leave.employeeName}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 capitalize">{leave.type}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {leave.startDate} - {leave.endDate}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{leave.days}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        leave.status === 'approved' ? 'bg-green-100 text-green-700' :
                        leave.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {leave.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => setShowViewLeave(leave)} className="p-1 hover:bg-slate-100 rounded" title="View Details">
                          <Eye className="w-4 h-4 text-slate-400" />
                        </button>
                        {leave.status === 'pending' && (
                          <div className="flex gap-1">
                            <button onClick={() => handleApproveLeave(leave.id)} className="p-1 text-green-600 hover:bg-green-50 rounded" title="Approve">
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleRejectLeave(leave.id)} className="p-1 text-red-600 hover:bg-red-50 rounded" title="Reject">
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeView === 'departments' && (
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-4 border-b border-slate-200 flex justify-end">
            <button onClick={() => setShowAddDepartment(true)} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Department
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {departments.map((dept) => (
              <div key={dept.id} className="border border-slate-200 rounded-xl p-4 hover:shadow-lg transition">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-slate-900">{dept.employeeCount}</span>
                </div>
                <h3 className="font-semibold text-slate-900">{dept.name}</h3>
                <p className="text-sm text-slate-500">Manager: {dept.managerName}</p>
                <p className="text-sm text-slate-500">Budget: ${dept.budget.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {showViewEmployee && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-xl font-bold">Employee Details</h2>
              <button onClick={() => setShowViewEmployee(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {showViewEmployee.firstName[0]}{showViewEmployee.lastName[0]}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{showViewEmployee.firstName} {showViewEmployee.lastName}</h3>
                  <p className="text-slate-500">{showViewEmployee.position}</p>
                  <span className={`px-2 py-1 text-xs rounded-full mt-1 inline-block ${
                    showViewEmployee.status === 'active' ? 'bg-green-100 text-green-700' :
                    showViewEmployee.status === 'on_leave' ? 'bg-amber-100 text-amber-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {showViewEmployee.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-500 mb-1">Employee ID</p>
                  <p className="font-medium">{showViewEmployee.id}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-500 mb-1">Department</p>
                  <p className="font-medium">{showViewEmployee.department}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-500 mb-1">Email</p>
                  <p className="font-medium">{showViewEmployee.email}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-500 mb-1">Phone</p>
                  <p className="font-medium">{showViewEmployee.phone}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-500 mb-1">Annual Salary</p>
                  <p className="font-medium">${showViewEmployee.salary.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-500 mb-1">Hire Date</p>
                  <p className="font-medium">{showViewEmployee.hireDate}</p>
                </div>
                <div className="col-span-2 p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-500 mb-1">Address</p>
                  <p className="font-medium">{showViewEmployee.address}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-500 mb-1">Emergency Contact</p>
                  <p className="font-medium">{showViewEmployee.emergencyContact}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-500 mb-1">Emergency Phone</p>
                  <p className="font-medium">{showViewEmployee.emergencyPhone}</p>
                </div>
              </div>

              {showViewEmployee.resumeUrl && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">Resume Attached</p>
                  <a href={showViewEmployee.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline text-sm">
                    View Resume
                  </a>
                </div>
              )}

              <div className="flex gap-2 mt-6">
                <button onClick={() => printEmployeeCard(showViewEmployee)} className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-2">
                  <Printer className="w-4 h-4" /> Print ID Card
                </button>
                <button onClick={() => setShowViewEmployee(null)} className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showViewLeave && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-xl font-bold">Leave Request Details</h2>
              <button onClick={() => setShowViewLeave(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-500 mb-1">Employee</p>
                <p className="font-medium">{showViewLeave.employeeName}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-500 mb-1">Leave Type</p>
                  <p className="font-medium capitalize">{showViewLeave.type}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-500 mb-1">Status</p>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    showViewLeave.status === 'approved' ? 'bg-green-100 text-green-700' :
                    showViewLeave.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {showViewLeave.status}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-500 mb-1">Start Date</p>
                  <p className="font-medium">{showViewLeave.startDate}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-500 mb-1">End Date</p>
                  <p className="font-medium">{showViewLeave.endDate}</p>
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-500 mb-1">Number of Days</p>
                <p className="font-medium">{showViewLeave.days} days</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-500 mb-1">Reason</p>
                <p className="font-medium">{showViewLeave.reason}</p>
              </div>
              {showViewLeave.approvedBy && (
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-500 mb-1">Processed By</p>
                  <p className="font-medium">{showViewLeave.approvedBy} on {showViewLeave.approvedDate}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showAddEmployee && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold">Add New Employee</h2>
            </div>
            <form onSubmit={handleAddEmployee} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                  <input name="firstName" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                  <input name="lastName" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input name="email" type="email" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <input name="phone" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                  <select name="department" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none">
                    {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Position</label>
                  <input name="position" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Salary</label>
                  <input name="salary" type="number" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Hire Date</label>
                  <input name="hireDate" type="date" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                <input name="address" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Emergency Contact</label>
                  <input name="emergencyContact" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Emergency Phone</label>
                  <input name="emergencyPhone" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Upload Resume</label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center">
                  <input 
                    type="file" 
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                    className="hidden" 
                    id="resume-upload"
                  />
                  <label htmlFor="resume-upload" className="cursor-pointer">
                    <UploadIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">{resumeFile ? resumeFile.name : 'Click to upload resume (PDF, DOC)'}</p>
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowAddEmployee(false)} className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700">Add Employee</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddLeave && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold">Request Leave</h2>
            </div>
            <form onSubmit={handleAddLeave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Employee</label>
                <select name="employeeId" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none">
                  {employees.map(e => <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Leave Type</label>
                <select name="type" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none">
                  <option value="annual">Annual Leave</option>
                  <option value="sick">Sick Leave</option>
                  <option value="personal">Personal Leave</option>
                  <option value="maternity">Maternity Leave</option>
                  <option value="paternity">Paternity Leave</option>
                  <option value="unpaid">Unpaid Leave</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                  <input name="startDate" type="date" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                  <input name="endDate" type="date" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Number of Days</label>
                <input name="days" type="number" required min="1" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Reason</label>
                <textarea name="reason" required rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowAddLeave(false)} className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddDepartment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold">Add Department</h2>
            </div>
            <form onSubmit={handleAddDepartment} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Department Name</label>
                <input name="name" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Department Manager</label>
                <select name="managerId" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none">
                  {employees.map(e => <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Budget</label>
                <input name="budget" type="number" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowAddDepartment(false)} className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700">Add Department</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
