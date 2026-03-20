'use client';

import { useState, useEffect, useCallback } from 'react';
import { hrApi } from '@/services/api';
import { useDataStore } from '@/stores/data.store';
import { useAuthStore } from '@/stores/auth.store';
import { 
  Users, UserPlus, Calendar, Building2, Plus, Search, MoreHorizontal,
  Download, Upload, Edit, Trash2, CheckCircle, XCircle, Clock,
  Filter, Mail, Phone, MapPin, FileText, Eye, Printer, X,
  Briefcase, UserCheck, UserX, RefreshCw, TrendingUp, FileSignature,
  File, FileUp, MessageSquare
} from 'lucide-react';
import toast from 'react-hot-toast';

type ViewTab = 'employees' | 'leave' | 'departments' | 'contracts' | 'attendance' | 'reports' | 'timeTracking';

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department?: string;
  departmentId?: string;
  position?: string;
  positionId?: string;
  salary?: number;
  hireDate: string;
  status: string;
  avatar?: string;
  address?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  contractType?: string;
}

interface Department {
  id: string;
  name: string;
  description?: string;
  managerId?: string;
  managerName?: string;
  employeeCount: number;
  createdAt: string;
}

interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: string;
  approvedBy?: string;
  approvedDate?: string;
  createdAt: string;
}

interface Contract {
  id: string;
  title: string;
  description?: string;
  contractType: string;
  status: string;
  startDate: string;
  endDate?: string;
  salary?: number;
  currency?: string;
  employeeId: string;
  employeeName: string;
  employeeEmail?: string;
  signatories?: Array<{
    name: string;
    role: string;
    email: string;
    signedDate?: string;
  }>;
  witnesses?: Array<{
    name: string;
    role: string;
    email: string;
    signedDate?: string;
  }>;
  terms?: string;
  createdAt: string;
  documentUrl?: string;
  documentName?: string;
  documentType?: string;
}

interface ReportDocument {
  id: string;
  reportId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  uploadedBy: string;
  uploadedAt: string;
}

interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  onLeave: number;
  newHires: number;
}

interface EmployeeReport {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  hoursWorked: number;
  overtimeHours: number;
  tasksCompleted: number;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedDate?: string;
  comments?: string;
  documentUrl?: string;
  documentName?: string;
  documentType?: string;
  supervisorComments?: Array<{
    id: string;
    author: string;
    text: string;
    timestamp: string;
  }>;
}

interface TimeEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  clockIn: string;
  clockOut?: string;
  breakDuration: number;
  totalHours: number;
  location?: string;
  status: 'active' | 'completed';
}

interface SignatureData {
  contractId: string;
  signature: string;
  signedBy: string;
  signedAt: string;
}

export default function HRDashboard() {
  const { employees: storeEmployees, leaveRequests: storeLeaveRequests, departments: storeDepartments, addEmployee, addLeaveRequest, updateLeaveRequest, addDepartment } = useDataStore();
  const [activeView, setActiveView] = useState<ViewTab>('employees');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    activeEmployees: 0,
    onLeave: 0,
    newHires: 0,
  });
  
  // Data states
  const [employees, setEmployees] = useState(storeEmployees as unknown as Employee[]);
  const [departments, setDepartments] = useState(storeDepartments as unknown as Department[]);
  const [leaveRequests, setLeaveRequests] = useState(storeLeaveRequests as unknown as LeaveRequest[]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [contractDocuments, setContractDocuments] = useState<Record<string, { url: string; name: string; type: string }>>({});
  const [reportDocuments, setReportDocuments] = useState<ReportDocument[]>([]);
  const [showContractUpload, setShowContractUpload] = useState<string | null>(null);
  const [showReportComments, setShowReportComments] = useState<string | null>(null);
  const [reportComment, setReportComment] = useState('');

  // Modal states
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showAddLeave, setShowAddLeave] = useState(false);
  const [showAddDepartment, setShowAddDepartment] = useState(false);
  const [showViewEmployee, setShowViewEmployee] = useState<Employee | null>(null);

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  
  const [reports, setReports] = useState<EmployeeReport[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [showContractModal, setShowContractModal] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showTimeEntryModal, setShowTimeEntryModal] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [signatures, setSignatures] = useState<Record<string, SignatureData[]>>({});
  const [currentSignature, setCurrentSignature] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  
  const [newReport, setNewReport] = useState({
    employeeId: '',
    date: new Date().toISOString().split('T')[0],
    hoursWorked: 8,
    overtimeHours: 0,
    tasksCompleted: 0,
    description: '',
  });
  
  const [newTimeEntry, setNewTimeEntry] = useState({
    employeeId: '',
    clockIn: new Date().toTimeString().slice(0, 5),
    breakDuration: 0,
  });

  const loadDashboardStats = useCallback(async () => {
    try {
      const response = await hrApi.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      const { employees, leaveRequests } = useDataStore.getState();
      setStats({
        totalEmployees: employees.length,
        activeEmployees: employees.filter(e => e.status === 'active').length,
        onLeave: employees.filter(e => e.status === 'on_leave').length,
        newHires: employees.filter(e => {
          const hireDate = new Date(e.hireDate);
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          return hireDate >= thirtyDaysAgo;
        }).length,
      });
    }
  }, []);

  const loadEmployees = useCallback(async (page = 1, limit = 50) => {
    setIsLoading(true);
    try {
      const response = await hrApi.getEmployees(page, limit);
      const empData = response.data.data || response.data || [];
      setEmployees(empData);
      useDataStore.getState().setEmployees(empData);
    } catch (error) {
      setEmployees(storeEmployees as unknown as Employee[]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadDepartments = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await hrApi.getDepartments();
      const deptData = response.data.data || response.data || [];
      setDepartments(deptData);
      useDataStore.getState().setDepartments(deptData);
    } catch (error) {
      setDepartments(storeDepartments as unknown as Department[]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadLeaveRequests = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await hrApi.getLeaveRequests();
      const leaveData = response.data.data || response.data || [];
      setLeaveRequests(leaveData);
      useDataStore.getState().setLeaveRequests(leaveData);
    } catch (error) {
      setLeaveRequests(storeLeaveRequests as unknown as LeaveRequest[]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadContracts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await hrApi.getContracts();
      setContracts(response.data.data || response.data || []);
    } catch (error) {
      console.error('Failed to load contracts:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadReports = useCallback(async () => {
    const stored = localStorage.getItem('hr-reports');
    if (stored) setReports(JSON.parse(stored));
  }, []);

  const loadTimeEntries = useCallback(async () => {
    const stored = localStorage.getItem('hr-time-entries');
    if (stored) setTimeEntries(JSON.parse(stored));
  }, []);

  const loadSignatures = useCallback(async () => {
    const stored = localStorage.getItem('contract-signatures');
    if (stored) setSignatures(JSON.parse(stored));
  }, []);

  useEffect(() => {
    loadDashboardStats();
  }, [loadDashboardStats]);

  useEffect(() => {
    if (activeView === 'employees') {
      setEmployees(storeEmployees);
      loadEmployees().catch(() => {});
    }
    if (activeView === 'departments') {
      setDepartments(storeDepartments as unknown as Department[]);
      loadDepartments().catch(() => {});
    }
    if (activeView === 'leave') {
      setLeaveRequests(storeLeaveRequests);
      loadLeaveRequests().catch(() => {});
    }
    if (activeView === 'contracts') loadContracts();
    if (activeView === 'reports') loadReports();
    if (activeView === 'timeTracking') loadTimeEntries();
    if (activeView === 'contracts') loadSignatures();
  }, [activeView, storeEmployees, storeDepartments, storeLeaveRequests, loadReports, loadTimeEntries, loadSignatures]);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      on_leave: 'bg-yellow-100 text-yellow-800',
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
      </span>
    );
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatCurrency = (amount: number) => {
    const userCurrency = useAuthStore.getState().user?.currency || 'USD';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: userCurrency }).format(amount);
  };

  const filteredEmployees = employees.filter(e => {
    const matchesSearch = 
      `${e.firstName} ${e.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.department?.toLowerCase().includes(searchQuery.toLowerCase()) || '');
    const matchesStatus = filterStatus === 'all' || e.status === filterStatus;
    const matchesDept = filterDepartment === 'all' || e.department === filterDepartment;
    return matchesSearch && matchesStatus && matchesDept;
  });

  // Dashboard View
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/40 uppercase tracking-wider">Total Employees</p>
              <p className="text-2xl font-bold text-white mt-1">{stats.totalEmployees}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/40 uppercase tracking-wider">Active Employees</p>
              <p className="text-2xl font-bold text-green-400 mt-1">{stats.activeEmployees}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/40 uppercase tracking-wider">On Leave</p>
              <p className="text-2xl font-bold text-yellow-400 mt-1">{stats.onLeave}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/40 uppercase tracking-wider">New Hires</p>
              <p className="text-2xl font-bold text-purple-400 mt-1">{stats.newHires}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() => { setActiveView('employees'); setShowAddEmployee(true); }}
          className="bg-gradient-to-r from-primary to-secondary text-white p-4 rounded-xl flex items-center gap-3 hover:opacity-90 transition"
        >
          <UserPlus className="w-5 h-5" />
          <span>Add Employee</span>
        </button>
        <button
          onClick={() => { setActiveView('departments'); setShowAddDepartment(true); }}
          className="bg-white/5 border border-white/10 text-white p-4 rounded-xl flex items-center gap-3 hover:bg-white/10 transition"
        >
          <Building2 className="w-5 h-5" />
          <span>Add Department</span>
        </button>
        <button
          onClick={() => { setActiveView('leave'); setShowAddLeave(true); }}
          className="bg-white/5 border border-white/10 text-white p-4 rounded-xl flex items-center gap-3 hover:bg-white/10 transition"
        >
          <Calendar className="w-5 h-5" />
          <span>Request Leave</span>
        </button>
        <button
          onClick={() => setActiveView('employees')}
          className="bg-white/5 border border-white/10 text-white p-4 rounded-xl flex items-center gap-3 hover:bg-white/10 transition"
        >
          <FileText className="w-5 h-5" />
          <span>View Reports</span>
        </button>
      </div>

      {/* Recent Employees */}
      <div className="bg-white/5 border border-white/10 rounded-xl">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white">Recent Employees</h3>
          <button onClick={() => setActiveView('employees')} className="text-accent text-sm hover:underline">
            View All
          </button>
        </div>
        <div className="p-6">
          {employees.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white/30" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No Employees Yet</h3>
              <p className="text-white/50 mb-6 max-w-md mx-auto">Get started by adding your first employee to the system. You can manage their information, track leaves, and more.</p>
              <button
                onClick={() => setShowAddEmployee(true)}
                className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-lg inline-flex items-center gap-2 hover:opacity-90"
              >
                <UserPlus className="w-5 h-5" /> Add Your First Employee
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-white/50 border-b border-white/10">
                    <th className="pb-3 font-medium">Name</th>
                    <th className="pb-3 font-medium">Email</th>
                    <th className="pb-3 font-medium">Department</th>
                    <th className="pb-3 font-medium">Position</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.slice(0, 5).map((employee) => (
                    <tr key={employee.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 text-sm font-medium text-white">{employee.firstName} {employee.lastName}</td>
                      <td className="py-3 text-sm text-white/50">{employee.email}</td>
                      <td className="py-3 text-sm text-white/70">{employee.department || '-'}</td>
                      <td className="py-3 text-sm text-white/70">{employee.position || '-'}</td>
                      <td className="py-3">{getStatusBadge(employee.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Employees View
  const renderEmployees = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Employees</h2>
        <button
          onClick={() => setShowAddEmployee(true)}
          className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90"
        >
          <Plus className="w-4 h-4" /> Add Employee
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl backdrop-blur-xl">
        <div className="p-4 border-b border-white/10 flex gap-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-white/40"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="on_leave">On Leave</option>
          </select>
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white"
          >
            <option value="all">All Departments</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.name}>{dept.name}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-white/50 border-b border-white/10">
                <th className="p-4 font-medium">Employee</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Phone</th>
                <th className="p-4 font-medium">Department</th>
                <th className="p-4 font-medium">Position</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={7} className="p-8 text-center text-white/50">Loading...</td></tr>
              ) : filteredEmployees.length === 0 ? (
                <tr><td colSpan={7} className="p-8 text-center text-white/50">No employees found</td></tr>
              ) : (
                filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4 text-sm font-medium text-white">{employee.firstName} {employee.lastName}</td>
                    <td className="p-4 text-sm text-white/50">{employee.email}</td>
                    <td className="p-4 text-sm text-white/50">{employee.phone}</td>
                    <td className="p-4 text-sm text-white/70">{employee.department || '-'}</td>
                    <td className="p-4 text-sm text-white/70">{employee.position || '-'}</td>
                    <td className="p-4">{getStatusBadge(employee.status)}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button onClick={() => setShowViewEmployee(employee)} className="p-1 hover:bg-white/10 rounded">
                          <Eye className="w-4 h-4 text-white/50" />
                        </button>
                        <button className="p-1 hover:bg-white/10 rounded">
                          <Edit className="w-4 h-4 text-white/50" />
                        </button>
                        <button className="p-1 hover:bg-white/10 rounded">
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Departments View
  const renderDepartments = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Departments</h2>
        <button
          onClick={() => setShowAddDepartment(true)}
          className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90"
        >
          <Plus className="w-4 h-4" /> Add Department
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full text-center py-8 text-white/50">Loading...</div>
        ) : departments.length === 0 ? (
          <div className="col-span-full text-center py-8 text-white/50">No departments found</div>
        ) : (
          departments.map((department) => (
            <div key={department.id} className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-xl">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-white">{department.name}</h3>
                  <p className="text-sm text-white/50 mt-1">{department.description || 'No description'}</p>
                </div>
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-blue-400" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                <span className="text-sm text-white/50">{department.employeeCount} employees</span>
                <div className="flex gap-2">
                  <button className="p-1 hover:bg-white/10 rounded">
                    <Edit className="w-4 h-4 text-white/50" />
                  </button>
                  <button className="p-1 hover:bg-white/10 rounded">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  // Leave View
  const renderLeave = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Leave Requests</h2>
        <button
          onClick={() => setShowAddLeave(true)}
          className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90"
        >
          <Plus className="w-4 h-4" /> Request Leave
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-white/50 border-b border-white/10">
                <th className="p-4 font-medium">Employee</th>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium">Start Date</th>
                <th className="p-4 font-medium">End Date</th>
                <th className="p-4 font-medium">Days</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={7} className="p-8 text-center text-white/50">Loading...</td></tr>
              ) : leaveRequests.length === 0 ? (
                <tr><td colSpan={7} className="p-8 text-center text-white/50">No leave requests found</td></tr>
              ) : (
                leaveRequests.map((request) => (
                  <tr key={request.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4 text-sm font-medium text-white">{request.employeeName}</td>
                    <td className="p-4 text-sm text-white/70">{request.type}</td>
                    <td className="p-4 text-sm text-white/50">{formatDate(request.startDate)}</td>
                    <td className="p-4 text-sm text-white/50">{formatDate(request.endDate)}</td>
                    <td className="p-4 text-sm text-white/70">{request.days}</td>
                    <td className="p-4">{getStatusBadge(request.status)}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {request.status === 'pending' && (
                          <>
                            <button className="p-1 hover:bg-green-500/20 rounded">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            </button>
                            <button className="p-1 hover:bg-red-500/20 rounded">
                              <XCircle className="w-4 h-4 text-red-400" />
                            </button>
                          </>
                        )}
                        <button className="p-1 hover:bg-white/10 rounded">
                          <Eye className="w-4 h-4 text-white/50" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Contracts View
  const renderContracts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Employee Contracts</h2>
        <button
          onClick={() => toast.success('Contract creation coming soon')}
          className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90"
        >
          <Plus className="w-4 h-4" /> New Contract
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-white/50 border-b border-white/10">
                <th className="p-4 font-medium">Contract</th>
                <th className="p-4 font-medium">Employee</th>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium">Start Date</th>
                <th className="p-4 font-medium">End Date</th>
                <th className="p-4 font-medium">Salary</th>
                <th className="p-4 font-medium">Document</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={9} className="p-8 text-center text-white/50">Loading...</td></tr>
              ) : contracts.length === 0 ? (
                <tr><td colSpan={9} className="p-8 text-center text-white/50">No contracts found. Create your first contract!</td></tr>
              ) : (
                contracts.map((contract) => (
                  <tr key={contract.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4 text-sm font-medium text-white">{contract.title}</td>
                    <td className="p-4 text-sm text-white/70">{contract.employeeName}</td>
                    <td className="p-4 text-sm text-white/70 capitalize">{contract.contractType}</td>
                    <td className="p-4 text-sm text-white/50">{formatDate(contract.startDate)}</td>
                    <td className="p-4 text-sm text-white/50">{contract.endDate ? formatDate(contract.endDate) : 'Permanent'}</td>
                    <td className="p-4 text-sm font-medium text-white">{contract.salary ? formatCurrency(contract.salary) : '-'}</td>
                    <td className="p-4">
                      {contract.documentUrl ? (
                        <a href={contract.documentUrl} target="_blank" className="flex items-center gap-2 text-blue-400 hover:text-blue-300">
                          <File className="w-4 h-4" />
                          <span className="text-xs">{contract.documentName || 'View Document'}</span>
                        </a>
                      ) : (
                        <button 
                          onClick={() => setShowContractUpload(contract.id)}
                          className="flex items-center gap-2 text-white/40 hover:text-white"
                        >
                          <Upload className="w-4 h-4" />
                          <span className="text-xs">Upload</span>
                        </button>
                      )}
                    </td>
                    <td className="p-4">{getStatusBadge(contract.status)}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => contract.documentUrl && window.open(contract.documentUrl, '_blank')}
                          disabled={!contract.documentUrl}
                          className={`p-1 hover:bg-white/10 rounded ${!contract.documentUrl ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <Eye className="w-4 h-4 text-white/50" />
                        </button>
                        <button 
                          onClick={() => setShowContractUpload(contract.id)}
                          className="p-1 hover:bg-white/10 rounded"
                        >
                          <Upload className="w-4 h-4 text-white/50" />
                        </button>
                        <button className="p-1 hover:bg-white/10 rounded">
                          <Download className="w-4 h-4 text-white/50" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Employee Work Reports</h2>
        <button
          onClick={() => setShowReportModal(true)}
          className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90"
        >
          <Plus className="w-4 h-4" /> Submit Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/50">Pending Reports</p>
              <p className="text-2xl font-bold text-yellow-400 mt-1">
                {reports.filter(r => r.status === 'pending').length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/50">Approved Reports</p>
              <p className="text-2xl font-bold text-green-400 mt-1">
                {reports.filter(r => r.status === 'approved').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/50">Total Hours</p>
              <p className="text-2xl font-bold text-blue-400 mt-1">
                {reports.reduce((acc, r) => acc + r.hoursWorked + r.overtimeHours, 0)}h
              </p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-white/50 border-b border-white/10">
                <th className="p-4 font-medium">Employee</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Hours</th>
                <th className="p-4 font-medium">Overtime</th>
                <th className="p-4 font-medium">Tasks</th>
                <th className="p-4 font-medium">Document</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.length === 0 ? (
                <tr><td colSpan={8} className="p-8 text-center text-white/50">No reports submitted yet</td></tr>
              ) : (
                reports.map((report) => (
                  <tr key={report.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4 text-sm font-medium text-white">{report.employeeName}</td>
                    <td className="p-4 text-sm text-white/50">{formatDate(report.date)}</td>
                    <td className="p-4 text-sm text-white/70">{report.hoursWorked}h</td>
                    <td className="p-4 text-sm text-white/70">{report.overtimeHours}h</td>
                    <td className="p-4 text-sm text-white/70">{report.tasksCompleted}</td>
                    <td className="p-4">
                      {report.documentUrl ? (
                        <a href={report.documentUrl} target="_blank" className="flex items-center gap-2 text-blue-400 hover:text-blue-300">
                          <File className="w-4 h-4" />
                          <span className="text-xs">{report.documentName || 'View'}</span>
                        </a>
                      ) : (
                        <label className="flex items-center gap-2 text-white/40 hover:text-white cursor-pointer">
                          <Upload className="w-4 h-4" />
                          <span className="text-xs">Upload</span>
                          <input 
                            type="file" 
                            accept=".pdf,.doc,.docx,.ppt,.pptx" 
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const url = URL.createObjectURL(file);
                                const updated = reports.map(r => 
                                  r.id === report.id ? { ...r, documentUrl: url, documentName: file.name, documentType: file.type } : r
                                );
                                setReports(updated);
                                localStorage.setItem('hr-reports', JSON.stringify(updated));
                                toast.success('Document uploaded');
                              }
                            }}
                          />
                        </label>
                      )}
                    </td>
                    <td className="p-4">{getStatusBadge(report.status)}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {report.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => {
                                const updated = reports.map(r => 
                                  r.id === report.id ? { ...r, status: 'approved' as const, approvedBy: 'Admin', approvedDate: new Date().toISOString() } : r
                                );
                                setReports(updated);
                                localStorage.setItem('hr-reports', JSON.stringify(updated));
                                toast.success('Report approved');
                              }}
                              className="p-1 hover:bg-green-500/20 rounded"
                            >
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            </button>
                            <button 
                              onClick={() => {
                                const updated = reports.map(r => 
                                  r.id === report.id ? { ...r, status: 'rejected' as const } : r
                                );
                                setReports(updated);
                                localStorage.setItem('hr-reports', JSON.stringify(updated));
                                toast.success('Report rejected');
                              }}
                              className="p-1 hover:bg-red-500/20 rounded"
                            >
                              <XCircle className="w-4 h-4 text-red-400" />
                            </button>
                          </>
                        )}
                        <button 
                          onClick={() => setShowReportComments(report.id)}
                          className="p-1 hover:bg-white/10 rounded relative"
                        >
                          <MessageSquare className="w-4 h-4 text-white/50" />
                          {(report.supervisorComments?.length || 0) > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full text-white text-xs flex items-center justify-center">
                              {report.supervisorComments?.length}
                            </span>
                          )}
                        </button>
                        <button className="p-1 hover:bg-white/10 rounded">
                          <Eye className="w-4 h-4 text-white/50" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTimeTracking = () => {
    const activeEntries = timeEntries.filter(e => e.status === 'active');
    const completedToday = timeEntries.filter(e => {
      const today = new Date().toISOString().split('T')[0];
      return e.date === today && e.status === 'completed';
    });

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Time Tracking</h2>
          <button
            onClick={() => setShowTimeEntryModal(true)}
            className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90"
          >
            <Clock className="w-4 h-4" /> Clock In
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/50">Currently Working</p>
                <p className="text-2xl font-bold text-green-400 mt-1">{activeEntries.length}</p>
              </div>
              <Clock className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/50">Clocked In Today</p>
                <p className="text-2xl font-bold text-blue-400 mt-1">{completedToday.length + activeEntries.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/50">Total Hours Today</p>
                <p className="text-2xl font-bold text-purple-400 mt-1">
                  {timeEntries.filter(e => {
                    const today = new Date().toISOString().split('T')[0];
                    return e.date === today;
                  }).reduce((acc, e) => acc + e.totalHours, 0)}h
                </p>
              </div>
              <Clock className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-white/50 border-b border-white/10">
                  <th className="p-4 font-medium">Employee</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Clock In</th>
                  <th className="p-4 font-medium">Clock Out</th>
                  <th className="p-4 font-medium">Break</th>
                  <th className="p-4 font-medium">Total Hours</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {timeEntries.length === 0 ? (
                  <tr><td colSpan={8} className="p-8 text-center text-white/50">No time entries recorded</td></tr>
                ) : (
                  timeEntries.slice(0, 20).map((entry) => (
                    <tr key={entry.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="p-4 text-sm font-medium text-white">{entry.employeeName}</td>
                      <td className="p-4 text-sm text-white/50">{formatDate(entry.date)}</td>
                      <td className="p-4 text-sm text-white/70">{entry.clockIn}</td>
                      <td className="p-4 text-sm text-white/70">{entry.clockOut || '-'}</td>
                      <td className="p-4 text-sm text-white/70">{entry.breakDuration}m</td>
                      <td className="p-4 text-sm font-medium text-white">{entry.totalHours}h</td>
                      <td className="p-4">{getStatusBadge(entry.status)}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          {entry.status === 'active' && (
                            <button 
                              onClick={() => {
                                const clockOutTime = new Date().toTimeString().slice(0, 5);
                                const [hours, mins] = entry.clockIn.split(':').map(Number);
                                const [outHours, outMins] = clockOutTime.split(':').map(Number);
                                const workedMins = (outHours * 60 + outMins) - (hours * 60 + mins) - entry.breakDuration;
                                const totalHours = Math.round(workedMins / 60 * 100) / 100;
                                
                                const updated = timeEntries.map(e => 
                                  e.id === entry.id ? { ...e, clockOut: clockOutTime, totalHours, status: 'completed' as const } : e
                                );
                                setTimeEntries(updated);
                                localStorage.setItem('hr-time-entries', JSON.stringify(updated));
                                toast.success('Clocked out successfully');
                              }}
                              className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30"
                            >
                              Clock Out
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const navItems = [
    { id: 'employees', label: 'Employees', icon: Users },
    { id: 'departments', label: 'Departments', icon: Building2 },
    { id: 'contracts', label: 'Contracts', icon: FileSignature },
    { id: 'leave', label: 'Leave', icon: Calendar },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'timeTracking', label: 'Time Tracking', icon: Clock },
  ];

  const [newEmployee, setNewEmployee] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    departmentId: '',
    position: '',
    hireDate: new Date().toISOString().split('T')[0],
    employmentType: 'full-time',
    salary: 0,
  });

  const [newDepartment, setNewDepartment] = useState({
    name: '',
    description: '',
  });

  const [newLeave, setNewLeave] = useState({
    employeeId: '',
    leaveType: 'annual',
    startDate: '',
    endDate: '',
    reason: '',
  });

  const handleCreateEmployee = async () => {
    try {
      await hrApi.createEmployee(newEmployee);
      toast.success('Employee created successfully');
    } catch (error) {
      const { addEmployee } = useDataStore.getState();
      addEmployee({
        firstName: newEmployee.firstName,
        lastName: newEmployee.lastName,
        email: newEmployee.email,
        phone: newEmployee.phone,
        department: newEmployee.departmentId,
        position: newEmployee.position,
        hireDate: newEmployee.hireDate,
        status: 'active',
        salary: newEmployee.salary,
      });
      toast.success('Employee created successfully (saved locally)');
    }
    setShowAddEmployee(false);
    setNewEmployee({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      departmentId: '',
      position: '',
      hireDate: new Date().toISOString().split('T')[0],
      employmentType: 'full-time',
      salary: 0,
    });
    loadEmployees();
  };

  const handleCreateDepartment = async () => {
    try {
      await hrApi.createDepartment(newDepartment);
      toast.success('Department created successfully');
    } catch (error) {
      const { addDepartment } = useDataStore.getState();
      addDepartment({
        name: newDepartment.name,
        managerId: '',
        managerName: '',
        employeeCount: 0,
        budget: 0,
      });
      toast.success('Department created successfully (saved locally)');
    }
    setShowAddDepartment(false);
    setNewDepartment({ name: '', description: '' });
    loadDepartments();
  };

  const handleCreateLeave = async () => {
    try {
      await hrApi.createLeaveRequest(newLeave);
      toast.success('Leave request submitted');
    } catch (error) {
      const { addLeaveRequest } = useDataStore.getState();
      const employee = employees.find(e => e.id === newLeave.employeeId);
      const startDate = new Date(newLeave.startDate);
      const endDate = new Date(newLeave.endDate);
      const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      addLeaveRequest({
        employeeId: newLeave.employeeId,
        employeeName: employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown',
        type: newLeave.leaveType as any,
        startDate: newLeave.startDate,
        endDate: newLeave.endDate,
        days,
        reason: newLeave.reason,
        status: 'pending',
      });
      toast.success('Leave request submitted (saved locally)');
    }
    setShowAddLeave(false);
    setNewLeave({
      employeeId: '',
      leaveType: 'annual',
      startDate: '',
      endDate: '',
      reason: '',
    });
    loadLeaveRequests();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1520] via-[#0b2535] to-[#061520]">
      {/* Header */}
      <header className="bg-[#0b2535]/50 backdrop-blur-xl border-b border-white/10 sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white uppercase tracking-wider">Human Resources</h1>
              <p className="text-sm text-white/50">Manage employees, leave & departments</p>
            </div>
          </div>
          <button onClick={() => loadDashboardStats()} className="p-2 hover:bg-white/10 rounded-lg transition">
            <RefreshCw className="w-5 h-5 text-white/50" />
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-[#0b2535]/80 backdrop-blur-xl border-r border-white/10 min-h-screen">
          <nav className="p-4 space-y-1">
            <button
              onClick={() => setActiveView('employees')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition ${
                activeView === 'employees'
                  ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <Users className="w-5 h-5" />
              Employees
            </button>
            {navItems.filter(n => n.id !== 'employees').map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id as ViewTab)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition ${
                    activeView === item.id
                      ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25'
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeView === 'employees' && renderEmployees()}
          {activeView === 'departments' && renderDepartments()}
          {activeView === 'contracts' && renderContracts()}
          {activeView === 'leave' && renderLeave()}
          {activeView === 'reports' && renderReports()}
          {activeView === 'timeTracking' && renderTimeTracking()}
        </main>
      </div>

      {/* Add Employee Modal */}
      {showAddEmployee && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#0b2535] rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Add New Employee</h3>
              <button onClick={() => setShowAddEmployee(false)} className="text-white/50 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">First Name</label>
                  <input
                    type="text"
                    value={newEmployee.firstName}
                    onChange={(e) => setNewEmployee({ ...newEmployee, firstName: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={newEmployee.lastName}
                    onChange={(e) => setNewEmployee({ ...newEmployee, lastName: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Email</label>
                <input
                  type="email"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Phone</label>
                <input
                  type="tel"
                  value={newEmployee.phone}
                  onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Department</label>
                  <select
                    value={newEmployee.departmentId}
                    onChange={(e) => setNewEmployee({ ...newEmployee, departmentId: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Position</label>
                  <input
                    type="text"
                    value={newEmployee.position}
                    onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Hire Date</label>
                  <input
                    type="date"
                    value={newEmployee.hireDate}
                    onChange={(e) => setNewEmployee({ ...newEmployee, hireDate: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Employment Type</label>
                  <select
                    value={newEmployee.employmentType}
                    onChange={(e) => setNewEmployee({ ...newEmployee, employmentType: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  >
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="intern">Intern</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Salary (USD)</label>
                <input
                  type="number"
                  value={newEmployee.salary}
                  onChange={(e) => setNewEmployee({ ...newEmployee, salary: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowAddEmployee(false)}
                  className="px-4 py-2 text-white/70 hover:bg-white/10 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateEmployee}
                  className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:opacity-90"
                >
                  Create Employee
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Department Modal */}
      {showAddDepartment && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#0b2535] rounded-xl p-6 w-full max-w-md border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Add New Department</h3>
              <button onClick={() => setShowAddDepartment(false)} className="text-white/50 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Department Name</label>
                <input
                  type="text"
                  value={newDepartment.name}
                  onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Description</label>
                <textarea
                  value={newDepartment.description}
                  onChange={(e) => setNewDepartment({ ...newDepartment, description: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowAddDepartment(false)}
                  className="px-4 py-2 text-white/70 hover:bg-white/10 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateDepartment}
                  className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:opacity-90"
                >
                  Create Department
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Leave Request Modal */}
      {showAddLeave && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#0b2535] rounded-xl p-6 w-full max-w-lg border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Request Leave</h3>
              <button onClick={() => setShowAddLeave(false)} className="text-white/50 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Employee</label>
                <select
                  value={newLeave.employeeId}
                  onChange={(e) => setNewLeave({ ...newLeave, employeeId: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  required
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Leave Type</label>
                <select
                  value={newLeave.leaveType}
                  onChange={(e) => setNewLeave({ ...newLeave, leaveType: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                >
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
                  <label className="block text-sm font-medium text-white/70 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newLeave.startDate}
                    onChange={(e) => setNewLeave({ ...newLeave, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">End Date</label>
                  <input
                    type="date"
                    value={newLeave.endDate}
                    onChange={(e) => setNewLeave({ ...newLeave, endDate: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Reason</label>
                <textarea
                  value={newLeave.reason}
                  onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  rows={3}
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowAddLeave(false)}
                  className="px-4 py-2 text-white/70 hover:bg-white/10 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateLeave}
                  className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:opacity-90"
                >
                  Submit Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submit Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#0b2535] rounded-xl p-6 w-full max-w-lg border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Submit Work Report</h3>
              <button onClick={() => setShowReportModal(false)} className="text-white/50 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Employee</label>
                <select
                  value={newReport.employeeId}
                  onChange={(e) => setNewReport({ ...newReport, employeeId: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  required
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Date</label>
                <input
                  type="date"
                  value={newReport.date}
                  onChange={(e) => setNewReport({ ...newReport, date: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Hours Worked</label>
                  <input
                    type="number"
                    value={newReport.hoursWorked}
                    onChange={(e) => setNewReport({ ...newReport, hoursWorked: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    min="0"
                    max="24"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Overtime Hours</label>
                  <input
                    type="number"
                    value={newReport.overtimeHours}
                    onChange={(e) => setNewReport({ ...newReport, overtimeHours: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    min="0"
                    max="24"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Tasks Completed</label>
                <input
                  type="number"
                  value={newReport.tasksCompleted}
                  onChange={(e) => setNewReport({ ...newReport, tasksCompleted: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Description of Work</label>
                <textarea
                  value={newReport.description}
                  onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  rows={3}
                  placeholder="Describe what you worked on today..."
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 text-white/70 hover:bg-white/10 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const employee = employees.find(e => e.id === newReport.employeeId);
                    const report: EmployeeReport = {
                      id: Math.random().toString(36).substring(2, 15),
                      employeeId: newReport.employeeId,
                      employeeName: employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown',
                      date: newReport.date,
                      hoursWorked: newReport.hoursWorked,
                      overtimeHours: newReport.overtimeHours,
                      tasksCompleted: newReport.tasksCompleted,
                      description: newReport.description,
                      status: 'pending',
                    };
                    const updated = [...reports, report];
                    setReports(updated);
                    localStorage.setItem('hr-reports', JSON.stringify(updated));
                    toast.success('Report submitted successfully');
                    setShowReportModal(false);
                    setNewReport({
                      employeeId: '',
                      date: new Date().toISOString().split('T')[0],
                      hoursWorked: 8,
                      overtimeHours: 0,
                      tasksCompleted: 0,
                      description: '',
                    });
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:opacity-90"
                >
                  Submit Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Time Entry Modal */}
      {showTimeEntryModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#0b2535] rounded-xl p-6 w-full max-w-md border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Clock In</h3>
              <button onClick={() => setShowTimeEntryModal(false)} className="text-white/50 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Employee</label>
                <select
                  value={newTimeEntry.employeeId}
                  onChange={(e) => setNewTimeEntry({ ...newTimeEntry, employeeId: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  required
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Clock In Time</label>
                <input
                  type="time"
                  value={newTimeEntry.clockIn}
                  onChange={(e) => setNewTimeEntry({ ...newTimeEntry, clockIn: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Break Duration (minutes)</label>
                <input
                  type="number"
                  value={newTimeEntry.breakDuration}
                  onChange={(e) => setNewTimeEntry({ ...newTimeEntry, breakDuration: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  min="0"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowTimeEntryModal(false)}
                  className="px-4 py-2 text-white/70 hover:bg-white/10 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const employee = employees.find(e => e.id === newTimeEntry.employeeId);
                    const entry: TimeEntry = {
                      id: Math.random().toString(36).substring(2, 15),
                      employeeId: newTimeEntry.employeeId,
                      employeeName: employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown',
                      date: new Date().toISOString().split('T')[0],
                      clockIn: newTimeEntry.clockIn,
                      breakDuration: newTimeEntry.breakDuration,
                      totalHours: 0,
                      status: 'active',
                    };
                    const updated = [...timeEntries, entry];
                    setTimeEntries(updated);
                    localStorage.setItem('hr-time-entries', JSON.stringify(updated));
                    toast.success('Clocked in successfully');
                    setShowTimeEntryModal(false);
                    setNewTimeEntry({
                      employeeId: '',
                      clockIn: new Date().toTimeString().slice(0, 5),
                      breakDuration: 0,
                    });
                  }}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Clock In
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contract Signature Modal */}
      {showSignatureModal && selectedContract && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#0b2535] rounded-xl p-6 w-full max-w-2xl border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Sign Contract: {selectedContract.title}</h3>
              <button onClick={() => { setShowSignatureModal(false); setCurrentSignature(''); }} className="text-white/50 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                <h4 className="font-medium text-white mb-2">Contract Details</h4>
                <p className="text-sm text-white/70">Employee: {selectedContract.employeeName}</p>
                <p className="text-sm text-white/70">Type: {selectedContract.contractType}</p>
                <p className="text-sm text-white/70">Start Date: {formatDate(selectedContract.startDate)}</p>
                {selectedContract.salary && <p className="text-sm text-white/70">Salary: {formatCurrency(selectedContract.salary)}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Draw Your Signature</label>
                <div className="border-2 border-dashed border-white/20 rounded-lg bg-white/5 relative">
                  <canvas
                    id="signature-canvas"
                    width={500}
                    height={150}
                    className="w-full cursor-crosshair"
                    onMouseDown={(e) => {
                      setIsDrawing(true);
                      const canvas = document.getElementById('signature-canvas') as HTMLCanvasElement;
                      const ctx = canvas.getContext('2d');
                      const rect = canvas.getBoundingClientRect();
                      ctx?.beginPath();
                      ctx?.moveTo(e.clientX - rect.left, e.clientY - rect.top);
                    }}
                    onMouseMove={(e) => {
                      if (!isDrawing) return;
                      const canvas = document.getElementById('signature-canvas') as HTMLCanvasElement;
                      const ctx = canvas.getContext('2d');
                      const rect = canvas.getBoundingClientRect();
                      ctx!.strokeStyle = '#ffffff';
                      ctx!.lineWidth = 2;
                      ctx?.lineTo(e.clientX - rect.left, e.clientY - rect.top);
                      ctx?.stroke();
                    }}
                    onMouseUp={() => {
                      setIsDrawing(false);
                      const canvas = document.getElementById('signature-canvas') as HTMLCanvasElement;
                      setCurrentSignature(canvas.toDataURL());
                    }}
                    onMouseLeave={() => setIsDrawing(false)}
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => {
                      const canvas = document.getElementById('signature-canvas') as HTMLCanvasElement;
                      const ctx = canvas.getContext('2d');
                      ctx?.clearRect(0, 0, canvas.width, canvas.height);
                      setCurrentSignature('');
                    }}
                    className="text-sm text-white/50 hover:text-white"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => { setShowSignatureModal(false); setCurrentSignature(''); }}
                  className="px-4 py-2 text-white/70 hover:bg-white/10 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!currentSignature) {
                      toast.error('Please draw your signature');
                      return;
                    }
                    const signatureData: SignatureData = {
                      contractId: selectedContract.id,
                      signature: currentSignature,
                      signedBy: selectedContract.employeeName,
                      signedAt: new Date().toISOString(),
                    };
                    const updated = { ...signatures };
                    if (!updated[selectedContract.id]) {
                      updated[selectedContract.id] = [];
                    }
                    updated[selectedContract.id].push(signatureData);
                    setSignatures(updated);
                    localStorage.setItem('contract-signatures', JSON.stringify(updated));
                    
                    const updatedContracts = contracts.map(c => 
                      c.id === selectedContract.id ? { ...c, status: 'active' } : c
                    );
                    setContracts(updatedContracts);
                    
                    toast.success('Contract signed successfully!');
                    setShowSignatureModal(false);
                    setCurrentSignature('');
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:opacity-90"
                >
                  Sign Contract
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contract Document Upload Modal */}
      {showContractUpload && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#0b2535] rounded-xl p-6 w-full max-w-md border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Upload Contract Document</h3>
              <button onClick={() => setShowContractUpload(null)} className="text-white/50 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-white/40 transition-colors">
                <FileUp className="w-12 h-12 mx-auto mb-4 text-white/30" />
                <p className="text-white/70 mb-2">Drag and drop PDF or Word documents</p>
                <p className="text-white/40 text-sm mb-4">or click to browse</p>
                <label className="px-4 py-2 bg-primary text-white rounded-lg cursor-pointer hover:bg-primary/90 inline-block">
                  Select File
                  <input 
                    type="file" 
                    accept=".pdf,.doc,.docx" 
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = URL.createObjectURL(file);
                        const updatedContracts = contracts.map(c => 
                          c.id === showContractUpload ? { ...c, documentUrl: url, documentName: file.name, documentType: file.name.split('.').pop() || 'pdf' } : c
                        );
                        setContracts(updatedContracts);
                        localStorage.setItem('hr-contracts', JSON.stringify(updatedContracts));
                        toast.success('Document uploaded successfully');
                        setShowContractUpload(null);
                      }
                    }}
                  />
                </label>
              </div>
              <p className="text-xs text-white/40 text-center">Supported formats: PDF, DOC, DOCX</p>
            </div>
          </div>
        </div>
      )}

      {/* Report Comments Modal */}
      {showReportComments && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#0b2535] rounded-xl p-6 w-full max-w-lg border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Report Comments</h3>
              <button onClick={() => { setShowReportComments(null); setReportComment(''); }} className="text-white/50 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              {(() => {
                const report = reports.find(r => r.id === showReportComments);
                if (!report) return null;
                return (
                  <>
                    <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                      <p className="text-sm text-white/70 mb-2">Report by: {report.employeeName}</p>
                      <p className="text-sm text-white/70">Date: {formatDate(report.date)}</p>
                      <p className="text-sm text-white/70">Hours: {report.hoursWorked}h</p>
                      <p className="text-sm text-white/70 mt-2">Description: {report.description}</p>
                    </div>
                    <div className="max-h-48 overflow-y-auto space-y-2">
                      {(report.supervisorComments || []).map((comment) => (
                        <div key={comment.id} className="bg-white/5 p-3 rounded-lg">
                          <p className="text-sm font-medium text-white">{comment.author}</p>
                          <p className="text-sm text-white/70">{comment.text}</p>
                          <p className="text-xs text-white/40 mt-1">{formatDate(comment.timestamp)}</p>
                        </div>
                      ))}
                      {(report.supervisorComments || []).length === 0 && (
                        <p className="text-sm text-white/40 text-center py-4">No comments yet</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        value={reportComment}
                        onChange={(e) => setReportComment(e.target.value)}
                        className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                      />
                      <button
                        onClick={() => {
                          if (!reportComment.trim()) return;
                          const updated = reports.map(r => {
                            if (r.id === showReportComments) {
                              return {
                                ...r,
                                supervisorComments: [
                                  ...(r.supervisorComments || []),
                                  {
                                    id: Math.random().toString(36).substring(2, 15),
                                    author: 'Supervisor',
                                    text: reportComment,
                                    timestamp: new Date().toISOString(),
                                  },
                                ],
                              };
                            }
                            return r;
                          });
                          setReports(updated);
                          localStorage.setItem('hr-reports', JSON.stringify(updated));
                          setReportComment('');
                          toast.success('Comment added');
                        }}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                      >
                        Send
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
