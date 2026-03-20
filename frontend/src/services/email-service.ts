import { api } from './api';

export interface EmailTemplate {
  id?: string;
  name: string;
  subject: string;
  body: string;
  type: 'invoice' | 'quotation' | 'notification' | 'welcome' | 'reminder';
}

export interface EmailParams {
  to: string[];
  subject: string;
  body: string;
  attachments?: string[];
  templateId?: string;
  metadata?: Record<string, any>;
}

export interface DutyAssignment {
  id?: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedBy: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  relatedTo?: {
    type: 'invoice' | 'lead' | 'employee' | 'task';
    id: string;
  };
}

export const emailService = {
  // Send email
  send: async (params: EmailParams) => {
    try {
      const response = await api.post('/email/send', params);
      return { success: true, data: response.data };
    } catch (error: any) {
      // For demo purposes, simulate success if API is not available
      console.log('Email service - simulating email send:', params);
      return { success: true, data: { message: 'Email queued for delivery', simulated: true } };
    }
  },

  // Send invoice email
  sendInvoice: async (invoice: any, customerEmail: string) => {
    return emailService.send({
      to: [customerEmail],
      subject: `Invoice ${invoice.invoiceNumber} - Payment Required`,
      body: `
        <h2>Invoice ${invoice.invoiceNumber}</h2>
        <p>Dear Customer,</p>
        <p>Please find attached your invoice for the amount of ${invoice.total}.</p>
        <p><strong>Due Date:</strong> ${invoice.dueDate}</p>
        <p><strong>Amount:</strong> ${invoice.total}</p>
        <p>Please settle the payment at your earliest convenience.</p>
        <p>Best regards,<br/>LemurSystem</p>
      `,
      attachments: [invoice.id],
    });
  },

  // Send quotation email
  sendQuotation: async (quotation: any, customerEmail: string) => {
    return emailService.send({
      to: [customerEmail],
      subject: `Quotation ${quotation.quotationNumber} - ${quotation.customerName}`,
      body: `
        <h2>Quotation ${quotation.quotationNumber}</h2>
        <p>Dear ${quotation.customerName},</p>
        <p>Please find attached our quotation for your review.</p>
        <p><strong>Total:</strong> ${quotation.total}</p>
        <p><strong>Valid Until:</strong> ${quotation.validUntil}</p>
        <p>Please let us know if you have any questions.</p>
        <p>Best regards,<br/>LemurSystem</p>
      `,
      attachments: [quotation.id],
    });
  },

  // Send welcome email
  sendWelcomeEmail: async (user: any) => {
    return emailService.send({
      to: [user.email],
      subject: 'Welcome to LemurSystem!',
      body: `
        <h2>Welcome, ${user.firstName}!</h2>
        <p>Thank you for joining LemurSystem. We're excited to have you on board!</p>
        <p>Your account has been set up with the following details:</p>
        <ul>
          <li><strong>Organization:</strong> ${user.organizationName}</li>
          <li><strong>Plan:</strong> ${user.subscription}</li>
          <li><strong>Role:</strong> ${user.role}</li>
        </ul>
        <p>Get started by exploring your dashboard.</p>
        <p>Best regards,<br/>LemurSystem Team</p>
      `,
    });
  },

  // Send reminder email
  sendReminder: async (to: string, subject: string, message: string) => {
    return emailService.send({
      to: [to],
      subject: `Reminder: ${subject}`,
      body: `
        <h2>Reminder</h2>
        <p>${message}</p>
        <p>Best regards,<br/>LemurSystem</p>
      `,
    });
  },

  // Get email templates
  getTemplates: async () => {
    const response = await api.get('/email/templates');
    return response.data;
  },

  // Create email template
  createTemplate: async (template: EmailTemplate) => {
    const response = await api.post('/email/templates', template);
    return response.data;
  },
};

export const dutyService = {
  // Assign a duty
  assign: async (duty: DutyAssignment) => {
    try {
      const response = await api.post('/duties', duty);
      return { success: true, data: response.data };
    } catch (error: any) {
      // For demo purposes, simulate success
      const savedDuty = { ...duty, id: Math.random().toString(36).substring(2, 15) };
      const duties = JSON.parse(localStorage.getItem('erp-duties') || '[]');
      duties.push(savedDuty);
      localStorage.setItem('erp-duties', JSON.stringify(duties));
      return { success: true, data: savedDuty };
    }
  },

  // Get duties for user
  getUserDuties: async (userId: string) => {
    try {
      const response = await api.get(`/duties/user/${userId}`);
      return response.data;
    } catch (error: any) {
      // Return from localStorage for demo
      const duties = JSON.parse(localStorage.getItem('erp-duties') || '[]');
      return duties.filter((d: DutyAssignment) => d.assignedTo === userId);
    }
  },

  // Update duty status
  updateStatus: async (dutyId: string, status: DutyAssignment['status']) => {
    try {
      const response = await api.patch(`/duties/${dutyId}`, { status });
      return { success: true, data: response.data };
    } catch (error: any) {
      const duties = JSON.parse(localStorage.getItem('erp-duties') || '[]');
      const updated = duties.map((d: DutyAssignment) => 
        d.id === dutyId ? { ...d, status } : d
      );
      localStorage.setItem('erp-duties', JSON.stringify(updated));
      return { success: true };
    }
  },

  // Get all duties (admin)
  getAllDuties: async () => {
    try {
      const response = await api.get('/duties');
      return response.data;
    } catch (error: any) {
      return JSON.parse(localStorage.getItem('erp-duties') || '[]');
    }
  },
};

export const analyticsService = {
  // Get dashboard analytics
  getDashboardStats: async () => {
    try {
      const response = await api.get('/analytics/dashboard');
      return response.data;
    } catch (error: any) {
      // Return mock data for demo
      return {
        revenue: { total: 125000, change: 12.5 },
        invoices: { total: 45, paid: 32, pending: 10, overdue: 3 },
        customers: { total: 28, new: 5 },
        employees: { total: 15, active: 12 },
        leads: { total: 42, converted: 15 },
      };
    }
  },

  // Get revenue analytics
  getRevenueAnalytics: async (period: 'day' | 'week' | 'month' | 'year') => {
    try {
      const response = await api.get(`/analytics/revenue?period=${period}`);
      return response.data;
    } catch (error: any) {
      return {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        data: [12000, 15000, 18000, 14000, 20000, 25000],
      };
    }
  },

  // Get employee performance
  getEmployeePerformance: async () => {
    try {
      const response = await api.get('/analytics/employees');
      return response.data;
    } catch (error: any) {
      return [
        { name: 'John Smith', tasks: 45, efficiency: 92 },
        { name: 'Jane Doe', tasks: 38, efficiency: 88 },
        { name: 'Mike Johnson', tasks: 52, efficiency: 95 },
      ];
    }
  },

  // Get login activity
  getLoginActivity: async (days: number = 7) => {
    try {
      const response = await api.get(`/analytics/logins?days=${days}`);
      return response.data;
    } catch (error: any) {
      return Array.from({ length: days }, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        logins: Math.floor(Math.random() * 20) + 5,
      }));
    }
  },
};

export const notificationService = {
  // Get notifications for user
  getNotifications: async (userId: string) => {
    try {
      const response = await api.get(`/notifications/${userId}`);
      return response.data;
    } catch (error: any) {
      return JSON.parse(localStorage.getItem('erp-inbox-notifications') || '[]');
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId: string) => {
    try {
      await api.patch(`/notifications/${notificationId}`, { read: true });
    } catch (error: any) {
      const notifications = JSON.parse(localStorage.getItem('erp-inbox-notifications') || '[]');
      const updated = notifications.map((n: any) => 
        n.id === notificationId ? { ...n, read: true } : n
      );
      localStorage.setItem('erp-inbox-notifications', JSON.stringify(updated));
    }
  },

  // Create notification
  create: async (notification: any) => {
    try {
      const response = await api.post('/notifications', notification);
      return response.data;
    } catch (error: any) {
      const notifications = JSON.parse(localStorage.getItem('erp-inbox-notifications') || '[]');
      notifications.unshift({ ...notification, id: Math.random().toString(36).substring(2, 15) });
      localStorage.setItem('erp-inbox-notifications', JSON.stringify(notifications));
      return notification;
    }
  },
};