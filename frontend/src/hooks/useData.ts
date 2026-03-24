'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  hrApi, 
  employeesApi, 
  leaveApi, 
  financeApi, 
  invoicesApi, 
  quotationsApi,
  customersApi, 
  productsApi,
  crmApi,
  leadsApi,
  contactsApi,
  activitiesApi,
  dealsApi,
  inventoryApi,
  supplyChainApi,
  payrollApi,
  productivityApi,
  marketingApi,
  servicesApi,
  organizationApi
} from '@/services/api';

export const useEmployees = () => {
  return useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const response = await hrApi.getEmployees();
      return response.data;
    },
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof hrApi.createEmployee>[0]) => hrApi.createEmployee(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};

export const useLeaveRequests = () => {
  return useQuery({
    queryKey: ['leaveRequests'],
    queryFn: async () => {
      const response = await hrApi.getLeaveRequests();
      return response.data;
    },
  });
};

export const useLeaveBalances = () => {
  return useQuery({
    queryKey: ['leaveBalances'],
    queryFn: async () => {
      const response = await hrApi.getLeaveBalances();
      return response.data;
    },
  });
};

export const useDepartments = () => {
  return useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const response = await hrApi.getDepartments();
      return response.data;
    },
  });
};

export const useInvoices = (params?: { page?: number; limit?: number; status?: string }) => {
  return useQuery({
    queryKey: ['invoices', params],
    queryFn: async () => {
      const response = await financeApi.getInvoices(params?.page, params?.limit, params?.status);
      return response.data;
    },
  });
};

export const useInvoice = (id: string) => {
  return useQuery({
    queryKey: ['invoice', id],
    queryFn: async () => {
      const response = await financeApi.getInvoice(id);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof financeApi.createInvoice>[0]) => financeApi.createInvoice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
};

export const useQuotations = () => {
  return useQuery({
    queryKey: ['quotations'],
    queryFn: async () => {
      const response = await financeApi.getQuotations();
      return response.data;
    },
  });
};

export const useCreateQuotation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof financeApi.createQuotation>[0]) => financeApi.createQuotation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
    },
  });
};

export const useExpenses = () => {
  return useQuery({
    queryKey: ['expenses'],
    queryFn: async () => {
      const response = await financeApi.getExpenses();
      return response.data;
    },
  });
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof financeApi.createExpense>[0]) => financeApi.createExpense(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });
};

export const useCustomers = () => {
  return useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const response = await crmApi.getCompanies();
      return response.data;
    },
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof crmApi.createCompany>[0]) => crmApi.createCompany(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
};

export const useLeads = () => {
  return useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      const response = await crmApi.getLeads();
      return response.data;
    },
  });
};

export const useCreateLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof crmApi.createLead>[0]) => crmApi.createLead(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
};

export const useDeals = () => {
  return useQuery({
    queryKey: ['deals'],
    queryFn: async () => {
      const response = await crmApi.getDeals();
      return response.data;
    },
  });
};

export const useContacts = () => {
  return useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      const response = await crmApi.getContacts();
      return response.data;
    },
  });
};

export const useActivities = () => {
  return useQuery({
    queryKey: ['activities'],
    queryFn: async () => {
      const response = await crmApi.getActivities();
      return response.data;
    },
  });
};

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await inventoryApi.getAll();
      return response.data;
    },
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof inventoryApi.create>[0]) => inventoryApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const usePayroll = () => {
  return useQuery({
    queryKey: ['payroll'],
    queryFn: async () => {
      const response = await payrollApi.getPayroll();
      return response.data;
    },
  });
};

export const usePayrollSalaries = () => {
  return useQuery({
    queryKey: ['salaries'],
    queryFn: async () => {
      const response = await payrollApi.getSalaries();
      return response.data;
    },
  });
};

export const usePayrollRuns = () => {
  return useQuery({
    queryKey: ['payrollRuns'],
    queryFn: async () => {
      const response = await payrollApi.getRuns();
      return response.data;
    },
  });
};

export const useMeetings = () => {
  return useQuery({
    queryKey: ['meetings'],
    queryFn: async () => {
      const response = await productivityApi.getMeetings();
      return response.data;
    },
  });
};

export const useTasks = () => {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const response = await productivityApi.getTasks();
      return response.data;
    },
  });
};

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await productivityApi.getProjects();
      return response.data;
    },
  });
};

export const useTickets = () => {
  return useQuery({
    queryKey: ['tickets'],
    queryFn: async () => {
      const response = await servicesApi.getTickets();
      return response.data;
    },
  });
};

export const useMarketingCampaigns = () => {
  return useQuery({
    queryKey: ['marketingCampaigns'],
    queryFn: async () => {
      const response = await marketingApi.getCampaigns();
      return response.data;
    },
  });
};

export const useEmailTemplates = () => {
  return useQuery({
    queryKey: ['emailTemplates'],
    queryFn: async () => {
      const response = await marketingApi.getEmailTemplates();
      return response.data;
    },
  });
};

export const useOrganization = () => {
  return useQuery({
    queryKey: ['organization'],
    queryFn: async () => {
      const response = await organizationApi.getOrganization();
      return response.data;
    },
  });
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const response = await organizationApi.getOrganizationStats();
      return response.data;
    },
  });
};

export const useHRStats = () => {
  return useQuery({
    queryKey: ['hrStats'],
    queryFn: async () => {
      const response = await hrApi.getDashboardStats();
      return response.data;
    },
  });
};

export const useFinanceStats = () => {
  return useQuery({
    queryKey: ['financeStats'],
    queryFn: async () => {
      const response = await financeApi.getDashboardStats();
      return response.data;
    },
  });
};

export const useCRMStats = () => {
  return useQuery({
    queryKey: ['crmStats'],
    queryFn: async () => {
      const response = await crmApi.getDashboardStats();
      return response.data;
    },
  });
};

export const useSupplyChainStats = () => {
  return useQuery({
    queryKey: ['supplyChainStats'],
    queryFn: async () => {
      const response = await supplyChainApi.getDashboardStats();
      return response.data;
    },
  });
};

export const usePayrollStats = () => {
  return useQuery({
    queryKey: ['payrollStats'],
    queryFn: async () => {
      const response = await payrollApi.getDashboardStats();
      return response.data;
    },
  });
};

export const useProductivityStats = () => {
  return useQuery({
    queryKey: ['productivityStats'],
    queryFn: async () => {
      const response = await productivityApi.getStats();
      return response.data;
    },
  });
};
