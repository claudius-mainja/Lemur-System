'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDataStore, PayrollRecord, Employee } from '@/stores/data.store';
import { useAuthStore } from '@/stores/auth.store';
import { hrApi, payrollApi } from '@/services/api';
import { 
  PiggyBank, Plus, Search, MoreHorizontal, Download, Banknote, DollarSign,
  Calendar, CheckCircle, Clock, Users, TrendingUp, CreditCard, Building2, RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

type ViewTab = 'employees' | 'payments' | 'reports';

interface HREmployee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department?: { name: string };
  jobTitle?: string;
  salary?: number;
  status: string;
  hireDate: string;
}

interface PayrollEmployee extends HREmployee {
  departmentName?: string;
  positionName?: string;
}

export default function PayrollDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { payroll, addPayrollRecord, updatePayrollRecord } = useDataStore();
  const [activeView, setActiveView] = useState<ViewTab>('employees');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [employees, setEmployees] = useState<PayrollEmployee[]>([]);
  const [showProcessPayroll, setShowProcessPayroll] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [payrollData, setPayrollData] = useState({
    bonuses: 0,
    deductions: 0,
    tax: 0,
    benefits: 0,
  });

  const loadEmployees = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await hrApi.getEmployees(1, 100);
      const empData = response.data.data || response.data || [];
      setEmployees(empData.map((e: any) => ({
        id: e.id,
        firstName: e.firstName,
        lastName: e.lastName,
        email: e.email,
        phone: e.phone,
        department: e.department,
        departmentName: e.department?.name || e.jobTitle || 'Unassigned',
        jobTitle: e.jobTitle,
        salary: e.salary || 0,
        status: e.status,
        hireDate: e.hireDate,
      })));
    } catch (error) {
      console.error('Failed to load employees:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const filteredEmployees = employees.filter(e => 
    `${e.firstName} ${e.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (e.departmentName?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
    (e.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase()) || false)
  );

  const filteredPayroll = payroll.filter(p => 
    p.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.department?.toLowerCase().includes(searchQuery.toLowerCase()) || false)
  );

  const stats = {
    totalPayroll: payroll.reduce((sum, p) => sum + p.netSalary, 0),
    pendingPayments: payroll.filter(p => p.status === 'pending').length,
    processedPayments: payroll.filter(p => p.status === 'processed').length,
    totalEmployees: employees.length,
  };

  const handleProcessPayroll = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const employee = employees.find(e => e.id === selectedEmployee);
    if (!employee) return;

    const baseSalary = (employee.salary || 0) / 12;
    const netSalary = baseSalary + payrollData.bonuses - payrollData.deductions - payrollData.tax + payrollData.benefits;

    addPayrollRecord({
      employeeId: employee.id,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      department: employee.departmentName || 'Unassigned',
      baseSalary,
      bonuses: payrollData.bonuses,
      deductions: payrollData.deductions,
      netSalary,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'bank_transfer',
      status: 'processed',
      tax: payrollData.tax,
      benefits: payrollData.benefits,
    });

    setShowProcessPayroll(false);
    setSelectedEmployee('');
    setPayrollData({ bonuses: 0, deductions: 0, tax: 0, benefits: 0 });
    toast.success('Payroll processed successfully!');
  };

  const handleMarkPaid = (id: string) => {
    updatePayrollRecord(id, { status: 'processed' });
    toast.success('Payment marked as processed!');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Payroll</h1>
          <p className="text-slate-500">Manage employee salaries, bonuses, and payments</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setActiveView('employees')} className={`px-4 py-2 rounded-lg font-medium ${activeView === 'employees' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>
            Salaries
          </button>
          <button onClick={() => setActiveView('payments')} className={`px-4 py-2 rounded-lg font-medium ${activeView === 'payments' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>
            Payments
          </button>
          <button onClick={() => setActiveView('reports')} className={`px-4 py-2 rounded-lg font-medium ${activeView === 'reports' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>
            Reports
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">${stats.totalPayroll.toLocaleString()}</p>
              <p className="text-sm text-slate-500">Total Payroll</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.totalEmployees}</p>
              <p className="text-sm text-slate-500">Employees</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.pendingPayments}</p>
              <p className="text-sm text-slate-500">Pending</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.processedPayments}</p>
              <p className="text-sm text-slate-500">Processed</p>
            </div>
          </div>
        </div>
      </div>

      {activeView === 'employees' && (
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
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
            <button onClick={() => setShowProcessPayroll(true)} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
              <Plus className="w-4 h-4" /> Process Payroll
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Employee</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Department</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Position</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Annual Salary</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Monthly</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {employees.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Users className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Employees Yet</h3>
                        <p className="text-gray-500 mb-6 max-w-md mx-auto">Add employees in the HR module first, then you can process their payroll here.</p>
                        <button
                          onClick={() => router.push('/dashboard/hr')}
                          className="bg-primary text-white px-6 py-3 rounded-lg inline-flex items-center gap-2 hover:bg-primary/90"
                        >
                          Go to HR Module
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">No employees found matching your search</td>
                  </tr>
                ) : (
                  filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-medium">
                          {employee.firstName?.[0]}{employee.lastName?.[0]}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{employee.firstName} {employee.lastName}</p>
                          <p className="text-xs text-slate-500">{employee.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{employee.departmentName || '-'}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{employee.jobTitle || '-'}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">${(employee.salary || 0).toLocaleString()}</td>
                    <td className="px-4 py-3 text-slate-600">${((employee.salary || 0) / 12).toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">
                      <button className="p-1 hover:bg-slate-100 rounded">
                        <MoreHorizontal className="w-4 h-4 text-slate-400" />
                      </button>
                    </td>
                  </tr>
                ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeView === 'payments' && (
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search payments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-2">
              <Download className="w-4 h-4" /> Export
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Employee</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Department</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Base Salary</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Bonuses</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Deductions</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Net Salary</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredPayroll.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{record.employeeName}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{record.department}</td>
                    <td className="px-4 py-3 text-sm">${record.baseSalary.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-green-600">+${record.bonuses.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-red-600">-${record.deductions.toLocaleString()}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">${record.netSalary.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{record.paymentDate}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        record.status === 'processed' ? 'bg-green-100 text-green-700' :
                        record.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {record.status === 'pending' && (
                        <button onClick={() => handleMarkPaid(record.id)} className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200">
                          Mark Paid
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeView === 'reports' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Payroll Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-600">Total Base Salary</span>
                <span className="font-medium">${payroll.reduce((sum, p) => sum + p.baseSalary, 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-600">Total Bonuses</span>
                <span className="font-medium text-green-600">+${payroll.reduce((sum, p) => sum + p.bonuses, 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-600">Total Deductions</span>
                <span className="font-medium text-red-600">-${payroll.reduce((sum, p) => sum + p.deductions, 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-600">Total Tax</span>
                <span className="font-medium">-${payroll.reduce((sum, p) => sum + p.tax, 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200">
                <span className="font-semibold">Net Payroll</span>
                <span className="font-bold text-green-600">${payroll.reduce((sum, p) => sum + p.netSalary, 0).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Department Breakdown</h3>
            <div className="space-y-3">
              {Array.from(new Set(employees.map(e => e.departmentName || 'Unassigned'))).map(dept => {
                const deptEmployees = employees.filter(e => (e.departmentName || 'Unassigned') === dept);
                const totalSalary = deptEmployees.reduce((sum, e) => sum + (e.salary || 0), 0);
                return (
                  <div key={dept} className="p-3 border border-slate-200 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">{dept}</span>
                      <span className="text-sm text-slate-500">{deptEmployees.length} employees</span>
                    </div>
                    <p className="text-lg font-bold">${totalSalary.toLocaleString()}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {showProcessPayroll && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold">Process Payroll</h2>
            </div>
            <form onSubmit={handleProcessPayroll} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Select Employee</label>
                <select 
                  value={selectedEmployee}
                  onChange={(e) => {
                    setSelectedEmployee(e.target.value);
                    const emp = employees.find(em => em.id === e.target.value);
                    if (emp) {
                      const monthlySalary = (emp.salary || 0) / 12;
                      setPayrollData(prev => ({ ...prev, tax: monthlySalary * 0.2 }));
                    }
                  }}
                  required 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="">Select Employee</option>
                  {employees.map(e => (
                    <option key={e.id} value={e.id}>
                      {e.firstName} {e.lastName} - ${(((e.salary || 0) / 12)).toLocaleString()}/month
                    </option>
                  ))}
                </select>
              </div>
              
              {selectedEmployee && (
                <>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-600">Base Monthly Salary</p>
                    <p className="text-lg font-bold">${((employees.find(e => e.id === selectedEmployee)?.salary || 0) / 12).toLocaleString()}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Bonuses</label>
                      <input 
                        type="number" 
                        value={payrollData.bonuses}
                        onChange={(e) => setPayrollData(prev => ({ ...prev, bonuses: parseFloat(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Benefits</label>
                      <input 
                        type="number" 
                        value={payrollData.benefits}
                        onChange={(e) => setPayrollData(prev => ({ ...prev, benefits: parseFloat(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Deductions</label>
                      <input 
                        type="number" 
                        value={payrollData.deductions}
                        onChange={(e) => setPayrollData(prev => ({ ...prev, deductions: parseFloat(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Tax (20%)</label>
                      <input 
                        type="number" 
                        value={payrollData.tax}
                        onChange={(e) => setPayrollData(prev => ({ ...prev, tax: parseFloat(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" 
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex justify-between">
                      <span className="font-semibold">Net Salary</span>
                      <span className="font-bold text-green-600">
                        ${(
                          (employees.find(e => e.id === selectedEmployee)?.salary || 0) / 12 +
                          payrollData.bonuses -
                          payrollData.deductions -
                          payrollData.tax +
                          payrollData.benefits
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowProcessPayroll(false)} className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700">Process Payment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
