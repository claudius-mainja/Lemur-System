'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDataStore, PayrollRecord, Employee } from '@/stores/data.store';
import { useAuthStore } from '@/stores/auth.store';
import { hrApi, payrollApi } from '@/services/api';
import { 
  PiggyBank, Plus, Search, MoreHorizontal, Download, Banknote, DollarSign,
  Calendar, CheckCircle, Clock, Users, TrendingUp, CreditCard, Building2, RefreshCw,
  Settings, FileText, X, Edit, Trash2, Send, Loader2, Zap
} from 'lucide-react';
import toast from 'react-hot-toast';

type ViewTab = 'employees' | 'payments' | 'reports' | 'bank-config' | 'payslips';

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
  const { payroll, addPayrollRecord, updatePayrollRecord, bankConfigs, salaryConfigs, payslipConfigs, addBankConfig, deleteBankConfig, addSalaryConfig, addPayslipConfig, deletePayslipConfig } = useDataStore();
  const [activeView, setActiveView] = useState<ViewTab>('employees');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [employees, setEmployees] = useState<PayrollEmployee[]>([]);
  const [showProcessPayroll, setShowProcessPayroll] = useState(false);
  const [showBankConfig, setShowBankConfig] = useState(false);
  const [showPayslipModal, setShowPayslipModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [payrollData, setPayrollData] = useState({
    bonuses: 0,
    deductions: 0,
    tax: 0,
    benefits: 0,
  });
  const [newBankConfig, setNewBankConfig] = useState({
    bankName: '',
    bankCode: '',
    accountNumber: '',
    accountType: 'checking' as 'checking' | 'savings',
    branchCode: '',
    isActive: true,
  });
  const [payslipEmployee, setPayslipEmployee] = useState('');
  const [payslipMonth, setPayslipMonth] = useState('');
  const [isSendingPayslip, setIsSendingPayslip] = useState(false);

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

  const handleAddBankConfig = () => {
    if (!newBankConfig.bankName || !newBankConfig.accountNumber) {
      toast.error('Please fill in required fields');
      return;
    }
    addBankConfig(newBankConfig);
    toast.success('Bank configuration added successfully!');
    setShowBankConfig(false);
    setNewBankConfig({
      bankName: '',
      bankCode: '',
      accountNumber: '',
      accountType: 'checking',
      branchCode: '',
      isActive: true,
    });
  };

  const handleRequestPayslip = async () => {
    if (!payslipEmployee || !payslipMonth) {
      toast.error('Please select employee and month');
      return;
    }
    setIsSendingPayslip(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      addPayslipConfig({
        employeeId: payslipEmployee,
        sendAutomatically: true,
        emailTemplate: 'monthly_payslip',
      });
      toast.success('Payslip sent successfully!');
      setShowPayslipModal(false);
      setPayslipEmployee('');
      setPayslipMonth('');
    } catch (error) {
      toast.error('Failed to send payslip');
    } finally {
      setIsSendingPayslip(false);
    }
  };

  const handleEnableAutomation = (employeeId: string) => {
    const activeBank = bankConfigs.find(b => b.isActive);
    if (!activeBank) {
      toast.error('Please add and activate a bank configuration first');
      return;
    }
    addSalaryConfig({
      employeeId,
      bankConfigId: activeBank.id,
      salaryAmount: employees.find(e => e.id === employeeId)?.salary || 0,
      paymentFrequency: 'monthly',
      isAutomated: true,
      nextPaymentDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
    });
    toast.success('Salary automation enabled!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1520] via-[#0b2535] to-[#061520]" suppressHydrationWarning>
      {/* Header */}
      <header className="bg-[#0b2535]/50 backdrop-blur-xl border-b border-white/10 sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-secondary to-primary rounded-xl flex items-center justify-center shadow-lg shadow-secondary/25">
              <PiggyBank className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white uppercase tracking-wider">Payroll</h1>
              <p className="text-sm text-white/50">Manage employee salaries & payments</p>
            </div>
          </div>
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
                  ? 'bg-gradient-to-r from-secondary to-primary text-white shadow-lg shadow-secondary/25'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <Users className="w-5 h-5" />
              Salaries
            </button>
            <button
              onClick={() => setActiveView('payments')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition ${
                activeView === 'payments'
                  ? 'bg-gradient-to-r from-secondary to-primary text-white shadow-lg shadow-secondary/25'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <Banknote className="w-5 h-5" />
              Payments
            </button>
            <button
              onClick={() => setActiveView('reports')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition ${
                activeView === 'reports'
                  ? 'bg-gradient-to-r from-secondary to-primary text-white shadow-lg shadow-secondary/25'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              Reports
            </button>
            <button
              onClick={() => setActiveView('bank-config')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition ${
                activeView === 'bank-config'
                  ? 'bg-gradient-to-r from-secondary to-primary text-white shadow-lg shadow-secondary/25'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <Building2 className="w-5 h-5" />
              Bank Config
            </button>
            <button
              onClick={() => setActiveView('payslips')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition ${
                activeView === 'payslips'
                  ? 'bg-gradient-to-r from-secondary to-primary text-white shadow-lg shadow-secondary/25'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <FileText className="w-5 h-5" />
              Payslips
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">${stats.totalPayroll.toLocaleString()}</p>
                  <p className="text-sm text-white/50">Total Payroll</p>
                </div>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.totalEmployees}</p>
                  <p className="text-sm text-white/50">Employees</p>
                </div>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.pendingPayments}</p>
                  <p className="text-sm text-white/50">Pending</p>
                </div>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.processedPayments}</p>
                  <p className="text-sm text-white/50">Processed</p>
                </div>
              </div>
            </div>
          </div>

          {activeView === 'employees' && (
            <div className="bg-white/5 border border-white/10 rounded-xl">
              <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    placeholder="Search employees..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-white/10 rounded-lg text-sm bg-white/5 text-white"
                  />
                </div>
                <button onClick={() => setShowProcessPayroll(true)} className="px-4 py-2 bg-secondary text-white rounded-lg text-sm font-medium hover:bg-secondary/90 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Process Payroll
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-white/50 uppercase">Employee</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-white/50 uppercase">Department</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-white/50 uppercase">Position</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-white/50 uppercase">Annual Salary</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-white/50 uppercase">Monthly</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-white/50 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {employees.length === 0 ? (
                      <tr>
                        <td colSpan={6}>
                          <div className="text-center py-12">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Users className="w-8 h-8 text-white/30" />
                            </div>
                            <h3 className="text-lg font-medium text-white mb-2">No Employees Yet</h3>
                            <p className="text-white/50 mb-6 max-w-md mx-auto">Add employees in the HR module first.</p>
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
                        <td colSpan={6} className="p-8 text-center text-white/50">No employees found</td>
                      </tr>
                    ) : (
                      filteredEmployees.map((employee) => (
                        <tr key={employee.id} className="hover:bg-white/5">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center text-white font-medium">
                                {employee.firstName?.[0]}{employee.lastName?.[0]}
                              </div>
                              <div>
                                <p className="font-medium text-white">{employee.firstName} {employee.lastName}</p>
                                <p className="text-xs text-white/50">{employee.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-white/70">{employee.departmentName || '-'}</td>
                          <td className="px-4 py-3 text-sm text-white/70">{employee.jobTitle || '-'}</td>
                          <td className="px-4 py-3 font-medium text-white">${(employee.salary || 0).toLocaleString()}</td>
                          <td className="px-4 py-3 text-white/70">${((employee.salary || 0) / 12).toLocaleString()}</td>
                          <td className="px-4 py-3 text-right">
                            <button className="p-1 hover:bg-white/10 rounded">
                              <MoreHorizontal className="w-4 h-4 text-white/50" />
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
            <div className="bg-white/5 border border-white/10 rounded-xl">
              <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    placeholder="Search payments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-white/10 rounded-lg text-sm bg-white/5 text-white"
                  />
                </div>
                <button className="px-4 py-2 border border-white/10 rounded-lg text-sm font-medium text-white/70 hover:bg-white/5 flex items-center gap-2">
                  <Download className="w-4 h-4" /> Export
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-white/50 uppercase">Employee</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-white/50 uppercase">Department</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-white/50 uppercase">Base Salary</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-white/50 uppercase">Bonuses</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-white/50 uppercase">Deductions</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-white/50 uppercase">Net Salary</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-white/50 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-white/50 uppercase">Status</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-white/50 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredPayroll.map((record) => (
                      <tr key={record.id} className="hover:bg-white/5">
                        <td className="px-4 py-3">
                          <p className="font-medium text-white">{record.employeeName}</p>
                        </td>
                        <td className="px-4 py-3 text-sm text-white/70">{record.department}</td>
                        <td className="px-4 py-3 text-sm text-white">${record.baseSalary.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-green-500">+${record.bonuses.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-red-500">-${record.deductions.toLocaleString()}</td>
                        <td className="px-4 py-3 font-medium text-white">${record.netSalary.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-white/70">{record.paymentDate}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            record.status === 'processed' ? 'bg-green-500/20 text-green-400' :
                            record.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {record.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          {record.status === 'pending' && (
                            <button onClick={() => handleMarkPaid(record.id)} className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded hover:bg-green-500/30">
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
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 uppercase tracking-wider">Payroll Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-white/70">Total Base Salary</span>
                    <span className="font-medium text-white">${payroll.reduce((sum, p) => sum + p.baseSalary, 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-white/70">Total Bonuses</span>
                    <span className="font-medium text-green-500">+${payroll.reduce((sum, p) => sum + p.bonuses, 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-white/70">Total Deductions</span>
                    <span className="font-medium text-red-500">-${payroll.reduce((sum, p) => sum + p.deductions, 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-white/70">Total Tax</span>
                    <span className="font-medium text-white">-${payroll.reduce((sum, p) => sum + p.tax, 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                    <span className="font-semibold text-white">Net Payroll</span>
                    <span className="font-bold text-green-500">${payroll.reduce((sum, p) => sum + p.netSalary, 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 uppercase tracking-wider">Department Breakdown</h3>
                <div className="space-y-3">
                  {Array.from(new Set(employees.map(e => e.departmentName || 'Unassigned'))).map(dept => {
                    const deptEmployees = employees.filter(e => (e.departmentName || 'Unassigned') === dept);
                    const totalSalary = deptEmployees.reduce((sum, e) => sum + (e.salary || 0), 0);
                    return (
                      <div key={dept} className="p-3 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex justify-between mb-2">
                          <span className="font-medium text-white">{dept}</span>
                          <span className="text-sm text-white/50">{deptEmployees.length} employees</span>
                        </div>
                        <p className="text-lg font-bold text-secondary">${totalSalary.toLocaleString()}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeView === 'bank-config' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white uppercase tracking-wider">Bank Configuration</h2>
                <button
                  onClick={() => setShowBankConfig(true)}
                  className="bg-secondary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-secondary/90"
                >
                  <Plus className="w-4 h-4" /> Add Bank Config
                </button>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl">
                <div className="p-4 border-b border-white/10">
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Active Bank Accounts</h3>
                </div>
                <div className="p-6">
                  {bankConfigs.length === 0 ? (
                    <div className="text-center py-8">
                      <Building2 className="w-12 h-12 mx-auto text-white/20 mb-3" />
                      <p className="text-white/50">No bank configurations</p>
                      <p className="text-xs text-white/30 mt-1">Add a bank account to enable salary automation</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {bankConfigs.map((config) => (
                        <div key={config.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-blue-400" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-white">{config.bankName}</h4>
                                <p className="text-sm text-white/50">
                                  {config.bankCode} - Account: ****{config.accountNumber.slice(-4)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {config.isActive ? (
                                <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded">Active</span>
                              ) : (
                                <span className="px-2 py-1 text-xs bg-white/10 text-white/50 rounded">Inactive</span>
                              )}
                              <button
                                onClick={() => deleteBankConfig(config.id)}
                                className="p-1 hover:bg-white/10 rounded text-red-400"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <div className="mt-3 pt-3 border-t border-white/10 flex justify-between text-xs text-white/50">
                            <span>Account Type: {config.accountType}</span>
                            <span>Branch: {config.branchCode}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" /> Salary Automation
                </h3>
                <p className="text-sm text-white/60 mb-4">Enable automated salary payments for employees</p>
                <div className="space-y-2">
                  {employees.map((emp) => {
                    const hasAutomation = salaryConfigs.some(s => s.employeeId === emp.id);
                    return (
                      <div key={emp.id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center text-white text-xs font-medium">
                            {emp.firstName?.[0]}{emp.lastName?.[0]}
                          </div>
                          <span className="text-white">{emp.firstName} {emp.lastName}</span>
                        </div>
                        {hasAutomation ? (
                          <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Automated
                          </span>
                        ) : (
                          <button
                            onClick={() => handleEnableAutomation(emp.id)}
                            className="px-3 py-1 text-xs bg-secondary/20 text-secondary rounded hover:bg-secondary/30"
                          >
                            Enable
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeView === 'payslips' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white uppercase tracking-wider">Payslip Management</h2>
                <button
                  onClick={() => setShowPayslipModal(true)}
                  className="bg-secondary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-secondary/90"
                >
                  <Send className="w-4 h-4" /> Request Payslip
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 uppercase tracking-wider">Recent Payslips</h3>
                  {payslipConfigs.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 mx-auto text-white/20 mb-3" />
                      <p className="text-white/50">No payslips sent</p>
                      <p className="text-xs text-white/30 mt-1">Send payslips to employees</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {payslipConfigs.slice(0, 10).map((config) => {
                        const emp = employees.find(e => e.id === config.employeeId);
                        return (
                          <div key={config.id} className="p-3 bg-white/5 rounded-lg border border-white/10">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium text-white">{emp ? `${emp.firstName} ${emp.lastName}` : 'Unknown Employee'}</p>
                                <p className="text-xs text-white/50">{config.emailTemplate}</p>
                              </div>
                              <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded">Sent</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 uppercase tracking-wider">Payslip Templates</h3>
                  <div className="space-y-3">
                    {[
                      { id: 'monthly_payslip', name: 'Monthly Payslip', desc: 'Standard monthly salary slip' },
                      { id: 'bonus_slip', name: 'Bonus Slip', desc: 'Bonus payment confirmation' },
                      { id: 'deduction_notice', name: 'Deduction Notice', desc: 'Salary deduction notification' },
                    ].map((template) => (
                      <div key={template.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-secondary" />
                          <div>
                            <h4 className="font-medium text-white">{template.name}</h4>
                            <p className="text-xs text-white/50">{template.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {showProcessPayroll && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0b2535] rounded-xl w-full max-w-lg border border-white/10">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">Process Payroll</h2>
            </div>
            <form onSubmit={handleProcessPayroll} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1 uppercase tracking-wider">Select Employee</label>
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
                  className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white"
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
                  <div className="p-3 bg-white/5 rounded-lg">
                    <p className="text-sm text-white/60">Base Monthly Salary</p>
                    <p className="text-lg font-bold text-white">${((employees.find(e => e.id === selectedEmployee)?.salary || 0) / 12).toLocaleString()}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/60 mb-1 uppercase tracking-wider">Bonuses</label>
                      <input 
                        type="number" 
                        value={payrollData.bonuses}
                        onChange={(e) => setPayrollData(prev => ({ ...prev, bonuses: parseFloat(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/60 mb-1 uppercase tracking-wider">Benefits</label>
                      <input 
                        type="number" 
                        value={payrollData.benefits}
                        onChange={(e) => setPayrollData(prev => ({ ...prev, benefits: parseFloat(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/60 mb-1 uppercase tracking-wider">Deductions</label>
                      <input 
                        type="number" 
                        value={payrollData.deductions}
                        onChange={(e) => setPayrollData(prev => ({ ...prev, deductions: parseFloat(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/60 mb-1 uppercase tracking-wider">Tax (20%)</label>
                      <input 
                        type="number" 
                        value={payrollData.tax}
                        onChange={(e) => setPayrollData(prev => ({ ...prev, tax: parseFloat(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white" 
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                    <div className="flex justify-between">
                      <span className="font-semibold text-white">Net Salary</span>
                      <span className="font-bold text-green-500">
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
                <button type="button" onClick={() => setShowProcessPayroll(false)} className="px-4 py-2 border border-white/10 rounded-lg text-white/70 hover:bg-white/5">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90">Process Payment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bank Config Modal */}
      {showBankConfig && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0b2535] rounded-xl w-full max-w-lg border border-white/10">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">Add Bank Configuration</h2>
              <button onClick={() => setShowBankConfig(false)} className="text-white/50 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-1 uppercase tracking-wider">Bank Name</label>
                <input
                  type="text"
                  value={newBankConfig.bankName}
                  onChange={(e) => setNewBankConfig({ ...newBankConfig, bankName: e.target.value })}
                  placeholder="First National Bank"
                  className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/60 mb-1 uppercase tracking-wider">Bank Code</label>
                  <input
                    type="text"
                    value={newBankConfig.bankCode}
                    onChange={(e) => setNewBankConfig({ ...newBankConfig, bankCode: e.target.value })}
                    placeholder="FNB"
                    className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1 uppercase tracking-wider">Branch Code</label>
                  <input
                    type="text"
                    value={newBankConfig.branchCode}
                    onChange={(e) => setNewBankConfig({ ...newBankConfig, branchCode: e.target.value })}
                    placeholder="250005"
                    className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1 uppercase tracking-wider">Account Number</label>
                <input
                  type="text"
                  value={newBankConfig.accountNumber}
                  onChange={(e) => setNewBankConfig({ ...newBankConfig, accountNumber: e.target.value })}
                  placeholder="1234567890"
                  className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1 uppercase tracking-wider">Account Type</label>
                <select
                  value={newBankConfig.accountType}
                  onChange={(e) => setNewBankConfig({ ...newBankConfig, accountType: e.target.value as any })}
                  className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white"
                >
                  <option value="checking">Checking</option>
                  <option value="savings">Savings</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={newBankConfig.isActive}
                  onChange={(e) => setNewBankConfig({ ...newBankConfig, isActive: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                <label htmlFor="isActive" className="text-sm text-white/60">Set as active bank account</label>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button onClick={() => setShowBankConfig(false)} className="px-4 py-2 border border-white/10 rounded-lg text-white/70 hover:bg-white/5">Cancel</button>
                <button onClick={handleAddBankConfig} className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90">Save Configuration</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payslip Modal */}
      {showPayslipModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0b2535] rounded-xl w-full max-w-md border border-white/10">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">Send Payslip</h2>
              <button onClick={() => setShowPayslipModal(false)} className="text-white/50 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-1 uppercase tracking-wider">Select Employee</label>
                <select
                  value={payslipEmployee}
                  onChange={(e) => setPayslipEmployee(e.target.value)}
                  className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white"
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1 uppercase tracking-wider">Month</label>
                <input
                  type="month"
                  value={payslipMonth}
                  onChange={(e) => setPayslipMonth(e.target.value)}
                  className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white"
                />
              </div>
              <div className="p-4 bg-white/5 rounded-lg">
                <h4 className="text-sm text-white/60 mb-2">Email Template</h4>
                <p className="text-white text-sm">Monthly Payslip</p>
                <p className="text-xs text-white/50 mt-1">Includes salary breakdown, deductions, and net pay</p>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button onClick={() => setShowPayslipModal(false)} className="px-4 py-2 border border-white/10 rounded-lg text-white/70 hover:bg-white/5">Cancel</button>
                <button
                  onClick={handleRequestPayslip}
                  disabled={isSendingPayslip}
                  className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 flex items-center gap-2 disabled:opacity-50"
                >
                  {isSendingPayslip ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Send Payslip
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
