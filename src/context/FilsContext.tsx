import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  SIM,
  SimStatus,
  KycRecord,
  KycStatus,
  Product,
  Transaction,
  Commission,
  Branch,
  SupportTicket,
  NotificationItem,
  AuditLog,
  SecurityAlert,
  PaymentMethod,
  BankAccountDetails,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_SIMS,
  INITIAL_KYC_RECORDS,
  INITIAL_PRODUCTS,
  INITIAL_TRANSACTIONS,
  INITIAL_COMMISSIONS,
  INITIAL_BRANCHES,
  INITIAL_SUPPORT_TICKETS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_SECURITY_ALERTS,
} from '../data/mockData';

export const DEFAULT_RECEIVING_BANK_ACCOUNT: BankAccountDetails = {
  bankName: 'Bank of Kigali (BK)',
  accountName: 'Emmanuel Nayituriki',
  accountNumber: '00040-06948201-38',
  swiftCode: 'BKIGRWRW',
  branch: 'Kigali Heights Commercial Branch',
  currency: 'RWF',
  contactPhone: '0785964635',
  routingNumber: 'BK-001-948',
  instructions:
    'Transfer funds directly to Emmanuel Nayituriki at Bank of Kigali. Include your FLS Reference Code in the bank transfer memo. Send confirmation SMS or WhatsApp to 0785964635 for instant automated ledger clearance.',
};

export type AppView =
  | 'home'
  | 'customer'
  | 'agent'
  | 'sims'
  | 'admin'
  | 'compliance'
  | 'products'
  | 'commissions'
  | 'branches'
  | 'security'
  | 'support'
  | 'telecom_api'
  | 'notifications';

interface FilsContextType {
  currentUser: User;
  currentRole: UserRole;
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  switchUserRole: (role: UserRole, userId?: string) => void;
  
  // Real Bank Account Configuration
  receivingBankAccount: BankAccountDetails;
  updateReceivingBankAccount: (details: Partial<BankAccountDetails>) => void;

  // Data
  users: User[];
  sims: SIM[];
  kycRecords: KycRecord[];
  products: Product[];
  transactions: Transaction[];
  commissions: Commission[];
  branches: Branch[];
  tickets: SupportTicket[];
  notifications: NotificationItem[];
  auditLogs: AuditLog[];
  securityAlerts: SecurityAlert[];

  // Selected receipt to view / print
  selectedReceiptTransaction: Transaction | null;
  setSelectedReceiptTransaction: (tx: Transaction | null) => void;

  // Actions
  updateSimStatus: (simId: string, newStatus: SimStatus, reason: string) => void;
  registerSimInField: (data: {
    customerName: string;
    phone: string;
    email: string;
    idNumber: string;
    idType: 'National ID' | 'Passport' | 'Alien Resident Card';
    dob: string;
    gender: 'Male' | 'Female' | 'Other';
    address: string;
    city: string;
    iccid: string;
    frontDocUrl?: string;
    backDocUrl?: string;
    selfieUrl?: string;
  }) => { success: boolean; message: string; simId?: string };
  
  reviewKyc: (kycId: string, status: KycStatus, notes?: string, rejectionReason?: string) => void;
  
  purchaseProduct: (
    productId: string,
    msisdn: string,
    paymentMethod: PaymentMethod,
    bankDetails?: {
      senderBank?: string;
      senderAccountName?: string;
      transferSlipRef?: string;
    }
  ) => Transaction;
  
  sellProductAsAgent: (
    productId: string,
    customerPhone: string,
    customerName: string,
    paymentMethod: PaymentMethod,
    bankDetails?: {
      senderBank?: string;
      senderAccountName?: string;
      transferSlipRef?: string;
    }
  ) => Transaction;
  
  disburseCommissions: (
    agentId?: string,
    payoutDestination?: {
      method: 'Bank Transfer' | 'Mobile Money';
      bankName?: string;
      accountNumber?: string;
      accountName?: string;
    }
  ) => number;
  
  createProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  
  createSupportTicket: (subject: string, category: any, priority: any, initialMessage: string) => SupportTicket;
  replyToTicket: (ticketId: string, messageText: string) => void;
  updateTicketStatus: (ticketId: string, newStatus: SupportTicket['status']) => void;

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  sendNotification: (item: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;

  toggleMfa: (userId?: string) => void;
  addAuditLog: (action: string, resource: string, details: string, severity?: 'info' | 'warning' | 'critical') => void;
  resolveSecurityAlert: (alertId: string, resolution: 'Resolved' | 'False Positive') => void;

  // Helper stats
  customerSim: SIM | undefined;
  agentSims: SIM[];
  unreadNotifsCount: number;
}

const FilsContext = createContext<FilsContextType | undefined>(undefined);

export const FilsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persistence in localStorage
  const loadState = <T,>(key: string, defaultValue: T): T => {
    try {
      const saved = localStorage.getItem(`fils_${key}`);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  const [users, setUsers] = useState<User[]>(() => {
    const loaded = loadState<User[]>('users', INITIAL_USERS);
    return loaded.map((u) =>
      u.id === 'usr-1'
        ? {
            ...u,
            name: 'Emmanuel Nayituriki',
            email: 'emmanuelnayituriki993@gmail.com',
            phone: '0785964635',
            roleTitle: 'Chief Executive & System Administrator',
          }
        : u
    );
  });
  const [currentRole, setCurrentRole] = useState<UserRole>(() => loadState('currentRole', 'super_admin'));
  const [activeView, setActiveView] = useState<AppView>(() => loadState('activeView', 'home'));
  const [currentUserId, setCurrentUserId] = useState<string>(() => loadState('currentUserId', 'usr-1'));

  const [receivingBankAccount, setReceivingBankAccount] = useState<BankAccountDetails>(() => {
    const loaded = loadState<BankAccountDetails>('receivingBankAccount', DEFAULT_RECEIVING_BANK_ACCOUNT);
    return {
      ...DEFAULT_RECEIVING_BANK_ACCOUNT,
      ...loaded,
      contactPhone: loaded?.contactPhone || '0785964635',
    };
  });

  const [sims, setSims] = useState<SIM[]>(() => loadState('sims', INITIAL_SIMS));
  const [kycRecords, setKycRecords] = useState<KycRecord[]>(() => loadState('kycRecords', INITIAL_KYC_RECORDS));
  const [products, setProducts] = useState<Product[]>(() => loadState('products', INITIAL_PRODUCTS));
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadState('transactions', INITIAL_TRANSACTIONS));
  const [commissions, setCommissions] = useState<Commission[]>(() => loadState('commissions', INITIAL_COMMISSIONS));
  const [branches, setBranches] = useState<Branch[]>(() => loadState('branches', INITIAL_BRANCHES));
  const [tickets, setTickets] = useState<SupportTicket[]>(() => loadState('tickets', INITIAL_SUPPORT_TICKETS));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => loadState('notifications', INITIAL_NOTIFICATIONS));
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => loadState('auditLogs', INITIAL_AUDIT_LOGS));
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>(() => loadState('securityAlerts', INITIAL_SECURITY_ALERTS));

  const [selectedReceiptTransaction, setSelectedReceiptTransaction] = useState<Transaction | null>(null);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('fils_users', JSON.stringify(users));
  }, [users]);
  useEffect(() => {
    localStorage.setItem('fils_currentRole', JSON.stringify(currentRole));
  }, [currentRole]);
  useEffect(() => {
    localStorage.setItem('fils_activeView', JSON.stringify(activeView));
  }, [activeView]);
  useEffect(() => {
    localStorage.setItem('fils_currentUserId', JSON.stringify(currentUserId));
  }, [currentUserId]);
  useEffect(() => {
    localStorage.setItem('fils_receivingBankAccount', JSON.stringify(receivingBankAccount));
  }, [receivingBankAccount]);
  useEffect(() => {
    localStorage.setItem('fils_sims', JSON.stringify(sims));
  }, [sims]);
  useEffect(() => {
    localStorage.setItem('fils_kycRecords', JSON.stringify(kycRecords));
  }, [kycRecords]);
  useEffect(() => {
    localStorage.setItem('fils_products', JSON.stringify(products));
  }, [products]);
  useEffect(() => {
    localStorage.setItem('fils_transactions', JSON.stringify(transactions));
  }, [transactions]);
  useEffect(() => {
    localStorage.setItem('fils_commissions', JSON.stringify(commissions));
  }, [commissions]);
  useEffect(() => {
    localStorage.setItem('fils_branches', JSON.stringify(branches));
  }, [branches]);
  useEffect(() => {
    localStorage.setItem('fils_tickets', JSON.stringify(tickets));
  }, [tickets]);
  useEffect(() => {
    localStorage.setItem('fils_notifications', JSON.stringify(notifications));
  }, [notifications]);
  useEffect(() => {
    localStorage.setItem('fils_auditLogs', JSON.stringify(auditLogs));
  }, [auditLogs]);
  useEffect(() => {
    localStorage.setItem('fils_securityAlerts', JSON.stringify(securityAlerts));
  }, [securityAlerts]);

  // Derived current user
  const currentUser: User =
    users.find((u) => u.id === currentUserId && u.role === currentRole) ||
    users.find((u) => u.role === currentRole) ||
    users[0];

  const switchUserRole = (newRole: UserRole, targetUserId?: string) => {
    setCurrentRole(newRole);
    if (targetUserId) {
      setCurrentUserId(targetUserId);
    } else {
      const match = users.find((u) => u.role === newRole);
      if (match) setCurrentUserId(match.id);
    }

    // Contextual view switch for intuitive UX
    if (newRole === 'customer') {
      setActiveView('customer');
    } else if (newRole === 'agent') {
      setActiveView('agent');
    } else if (newRole === 'compliance_officer') {
      setActiveView('compliance');
    } else if (newRole === 'finance_manager') {
      setActiveView('commissions');
    } else if (newRole === 'operations_manager') {
      setActiveView('sims');
    } else if (newRole === 'branch_manager') {
      setActiveView('branches');
    } else if (newRole === 'super_admin' && (activeView === 'customer' || activeView === 'agent')) {
      setActiveView('admin');
    }
  };

  const addAuditLog = (
    action: string,
    resource: string,
    details: string,
    severity: 'info' | 'warning' | 'critical' = 'info'
  ) => {
    const newEntry: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userId: currentUser.id,
      userName: currentUser.name,
      role: currentUser.role,
      action,
      resource,
      details,
      ipAddress: '197.243.32.' + Math.floor(Math.random() * 80 + 10),
      severity,
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  const sendNotification = (item: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const notif: NotificationItem = {
      ...item,
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const updateSimStatus = (simId: string, newStatus: SimStatus, reason: string) => {
    const targetSim = sims.find((s) => s.id === simId);
    if (!targetSim) return;

    const oldStatus = targetSim.status;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const auditEntry = {
      id: `aud-${Date.now()}`,
      timestamp: nowStr,
      action: `Status Transition: ${oldStatus} ➔ ${newStatus}`,
      performedBy: currentUser.name,
      role: currentUser.role,
      note: reason,
    };

    setSims((prev) =>
      prev.map((s) => {
        if (s.id === simId) {
          return {
            ...s,
            status: newStatus,
            activationDate:
              newStatus === 'Activated' ? nowStr : s.activationDate,
            auditTrail: [auditEntry, ...s.auditTrail],
          };
        }
        return s;
      })
    );

    addAuditLog(
      'SIM_STATUS_CHANGE',
      `SIM ${targetSim.iccid} (${targetSim.msisdn})`,
      `Transitioned from ${oldStatus} to ${newStatus}. Note: ${reason}`,
      newStatus === 'Suspended' || newStatus === 'Deactivated' ? 'warning' : 'info'
    );

    if (newStatus === 'Activated' && targetSim.msisdn) {
      sendNotification({
        title: 'Your FILS SIM has been activated',
        message: `Your SIM (${targetSim.msisdn}) is now active on the FILS 5G network. Dial *100# to check balances.`,
        channel: 'SMS',
        type: 'success',
        msisdn: targetSim.msisdn,
      });
    } else if (newStatus === 'Suspended' && targetSim.msisdn) {
      sendNotification({
        title: 'FILS SIM Suspended',
        message: `Your line ${targetSim.msisdn} has been suspended by operations. Reason: ${reason}. Contact support immediately.`,
        channel: 'SMS',
        type: 'alert',
        msisdn: targetSim.msisdn,
      });
    }
  };

  const registerSimInField = (data: {
    customerName: string;
    phone: string;
    email: string;
    idNumber: string;
    idType: 'National ID' | 'Passport' | 'Alien Resident Card';
    dob: string;
    gender: 'Male' | 'Female' | 'Other';
    address: string;
    city: string;
    iccid: string;
    frontDocUrl?: string;
    backDocUrl?: string;
    selfieUrl?: string;
  }) => {
    const existingSim = sims.find((s) => s.iccid.replace(/\s+/g, '') === data.iccid.replace(/\s+/g, ''));
    if (!existingSim) {
      return { success: false, message: `SIM ICCID ${data.iccid} not found in registered telecom inventory.` };
    }

    if (existingSim.status !== 'Available') {
      return { success: false, message: `SIM is already in state: ${existingSim.status}. Only 'Available' SIMs can be registered.` };
    }

    // Duplicate ID check
    const isDuplicate = kycRecords.some(
      (k) => k.nationalIdNumber.toLowerCase() === data.idNumber.toLowerCase() && k.status === 'Verified'
    );

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newCustId = `cust-${Date.now().toString().slice(-4)}`;

    // Create KYC Record
    const newKyc: KycRecord = {
      id: `kyc-${Date.now()}`,
      customerId: newCustId,
      customerName: data.customerName,
      phone: data.phone,
      email: data.email,
      nationalIdNumber: data.idNumber,
      idType: data.idType,
      dob: data.dob,
      gender: data.gender,
      nationality: 'Rwandan',
      residentialAddress: data.address,
      city: data.city,
      documentFrontUrl: data.frontDocUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      documentBackUrl: data.backDocUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      selfieUrl: data.selfieUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      submissionDate: nowStr,
      status: 'Submitted',
      complianceScore: isDuplicate ? 65 : 94,
      isDuplicateFlagged: isDuplicate,
      assignedSimIccid: existingSim.iccid,
      reviewerNotes: isDuplicate ? 'Warning: Duplicate National ID detected across network database.' : 'Awaiting compliance officer verification.',
    };

    setKycRecords((prev) => [newKyc, ...prev]);

    // Update SIM
    const auditEntry = {
      id: `aud-${Date.now()}`,
      timestamp: nowStr,
      action: 'Field Registration & KYC Linked',
      performedBy: currentUser.name,
      role: currentUser.role,
      note: `Registered to ${data.customerName} (${data.idType}: ${data.idNumber})`,
    };

    setSims((prev) =>
      prev.map((s) => {
        if (s.id === existingSim.id) {
          return {
            ...s,
            status: 'Registration Pending',
            customerId: newCustId,
            customerName: data.customerName,
            msisdn: data.phone,
            agentId: currentUser.id,
            agentName: currentUser.name,
            registrationDate: nowStr,
            auditTrail: [auditEntry, ...s.auditTrail],
          };
        }
        return s;
      })
    );

    // If duplicate flagged, create security alert
    if (isDuplicate) {
      setSecurityAlerts((prev) => [
        {
          id: `sec-${Date.now()}`,
          timestamp: nowStr,
          type: 'Duplicate ID',
          severity: 'medium',
          description: `Identity ${data.idNumber} (${data.customerName}) registered another SIM via agent ${currentUser.name}.`,
          targetMsisdn: data.phone,
          branchName: currentUser.branchName || 'Field Operations',
          status: 'Investigating',
        },
        ...prev,
      ]);
    }

    addAuditLog(
      'CUSTOMER_SIM_REGISTRATION',
      `SIM ${existingSim.iccid}`,
      `Agent ${currentUser.name} registered SIM for customer ${data.customerName} (${data.phone})`,
      isDuplicate ? 'warning' : 'info'
    );

    sendNotification({
      title: 'Your SIM registration has been received',
      message: `SIM registration for ${data.phone} received by FILS compliance desk. Status: In Review.`,
      channel: 'SMS',
      type: 'info',
      msisdn: data.phone,
    });

    return {
      success: true,
      message: 'SIM registration and KYC successfully submitted for compliance review!',
      simId: existingSim.id,
    };
  };

  const reviewKyc = (
    kycId: string,
    status: KycStatus,
    notes?: string,
    rejectionReason?: string
  ) => {
    const kyc = kycRecords.find((k) => k.id === kycId);
    if (!kyc) return;

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    setKycRecords((prev) =>
      prev.map((k) => {
        if (k.id === kycId) {
          return {
            ...k,
            status,
            reviewerNotes: notes || k.reviewerNotes,
            rejectionReason: rejectionReason,
            reviewedBy: currentUser.name,
            reviewedAt: nowStr,
          };
        }
        return k;
      })
    );

    // If KYC verified, advance SIM to 'Verified' or 'Activated'
    if (status === 'Verified' && kyc.assignedSimIccid) {
      setSims((prev) =>
        prev.map((s) => {
          if (s.iccid === kyc.assignedSimIccid) {
            const auditEntry = {
              id: `aud-${Date.now()}`,
              timestamp: nowStr,
              action: 'KYC Approved by Compliance',
              performedBy: currentUser.name,
              role: currentUser.role,
              note: `Identity confirmed. Score: ${kyc.complianceScore}%. MNO activation unlocked.`,
            };
            return {
              ...s,
              status: 'Verified',
              auditTrail: [auditEntry, ...s.auditTrail],
            };
          }
          return s;
        })
      );

      sendNotification({
        title: 'Your verification has been approved',
        message: `Your identity has been verified for phone number ${kyc.phone}. Network activation is pending final provisioning.`,
        channel: 'In-App',
        type: 'success',
        msisdn: kyc.phone,
      });
    } else if (status === 'Rejected' && kyc.assignedSimIccid) {
      setSims((prev) =>
        prev.map((s) => {
          if (s.iccid === kyc.assignedSimIccid) {
            const auditEntry = {
              id: `aud-${Date.now()}`,
              timestamp: nowStr,
              action: 'KYC Document Rejected',
              performedBy: currentUser.name,
              role: currentUser.role,
              note: `Reason: ${rejectionReason || 'Non-compliant documents'}`,
            };
            return {
              ...s,
              status: 'Available', // Returns to available pool after rejection
              customerId: undefined,
              customerName: undefined,
              auditTrail: [auditEntry, ...s.auditTrail],
            };
          }
          return s;
        })
      );

      sendNotification({
        title: 'Identity Verification Rejected',
        message: `Your FILS SIM registration for ${kyc.phone} was rejected. Reason: ${rejectionReason || 'Invalid document scan'}. Please re-submit at an authorized FILS agent kiosk.`,
        channel: 'SMS',
        type: 'alert',
        msisdn: kyc.phone,
      });
    }

    addAuditLog(
      'KYC_AUDIT_DECISION',
      `KYC Record ${kycId}`,
      `Compliance Officer ${currentUser.name} marked KYC as ${status}. ${rejectionReason ? `Reason: ${rejectionReason}` : ''}`,
      status === 'Rejected' ? 'warning' : 'info'
    );
  };

  const updateReceivingBankAccount = (details: Partial<BankAccountDetails>) => {
    setReceivingBankAccount((prev) => {
      const updated = { ...prev, ...details };
      addAuditLog(
        'BANK_ACCOUNT_SETTINGS_UPDATED',
        `Account: ${updated.accountName} (${updated.bankName})`,
        `Direct transfer bank account updated: ${updated.bankName} - ${updated.accountNumber}`,
        'warning'
      );
      return updated;
    });
  };

  const purchaseProduct = (
    productId: string,
    msisdn: string,
    paymentMethod: PaymentMethod,
    bankDetails?: {
      senderBank?: string;
      senderAccountName?: string;
      transferSlipRef?: string;
    }
  ): Transaction => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) throw new Error('Product not found');

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const txId = `tx-${Date.now()}`;
    const txRef = `FLS-TX-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const rcptNum = `RCPT-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const isBankPayment =
      paymentMethod === 'Direct Bank Transfer' || paymentMethod === 'Instant Bank Wire (EFT)';

    const newTx: Transaction = {
      id: txId,
      reference: txRef,
      type:
        prod.category === 'Airtime'
          ? 'Airtime Topup'
          : prod.category === 'Data Bundle'
          ? 'Data Purchase'
          : 'Voice Bundle',
      amount: prod.price,
      currency: prod.currency,
      msisdn,
      customerId: currentUser.id,
      customerName: currentUser.name,
      paymentMethod,
      status: 'Completed',
      timestamp: nowStr,
      productName: prod.name,
      receiptNumber: rcptNum,
      bankDetails: isBankPayment
        ? {
            bankName: receivingBankAccount.bankName,
            accountName: receivingBankAccount.accountName,
            accountNumber: receivingBankAccount.accountNumber,
            senderBank: bankDetails?.senderBank || 'Direct Bank Deposit',
            senderReference: bankDetails?.senderAccountName || currentUser.name,
            transferSlipRef:
              bankDetails?.transferSlipRef ||
              `BK-UTR-${Math.floor(10000000 + Math.random() * 90000000)}`,
          }
        : undefined,
    };

    setTransactions((prev) => [newTx, ...prev]);

    // Send notifications
    sendNotification({
      title: isBankPayment ? 'Bank Transfer Payment Verified & Credited' : 'Your transaction was successful',
      message: isBankPayment
        ? `Payment of ${prod.price.toLocaleString()} ${prod.currency} received into account ${receivingBankAccount.accountName} (${receivingBankAccount.bankName}). ${prod.name} activated for ${msisdn}. Ref: ${txRef}`
        : `You purchased ${prod.name} (${prod.quota}) for ${prod.price.toLocaleString()} ${prod.currency} via ${paymentMethod}. Ref: ${txRef}`,
      channel: isBankPayment ? 'SMS' : 'Push',
      type: 'success',
      msisdn,
    });

    addAuditLog(
      isBankPayment ? 'BANK_PAYMENT_TRANSFER_RECEIVED' : 'CUSTOMER_PRODUCT_PURCHASE',
      txRef,
      `${currentUser.name} paid ${prod.price} ${prod.currency} via ${paymentMethod} to account ${receivingBankAccount.accountName} for ${prod.name}`,
      'info'
    );

    setSelectedReceiptTransaction(newTx);
    return newTx;
  };

  const sellProductAsAgent = (
    productId: string,
    customerPhone: string,
    customerName: string,
    paymentMethod: PaymentMethod,
    bankDetails?: {
      senderBank?: string;
      senderAccountName?: string;
      transferSlipRef?: string;
    }
  ): Transaction => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) throw new Error('Product not found');

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const txId = `tx-${Date.now()}`;
    const txRef = `FLS-TX-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const rcptNum = `RCPT-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const isBankPayment =
      paymentMethod === 'Direct Bank Transfer' || paymentMethod === 'Instant Bank Wire (EFT)';

    const newTx: Transaction = {
      id: txId,
      reference: txRef,
      type:
        prod.category === 'Airtime'
          ? 'Airtime Topup'
          : prod.category === 'Data Bundle'
          ? 'Data Purchase'
          : 'Voice Bundle',
      amount: prod.price,
      currency: prod.currency,
      msisdn: customerPhone,
      customerId: `cust-anon-${Math.floor(Math.random() * 1000)}`,
      customerName: customerName || 'Walk-in Customer',
      agentId: currentUser.id,
      agentName: currentUser.name,
      branchId: currentUser.branchId || 'br-1',
      paymentMethod,
      status: 'Completed',
      timestamp: nowStr,
      productName: prod.name,
      receiptNumber: rcptNum,
      bankDetails: isBankPayment
        ? {
            bankName: receivingBankAccount.bankName,
            accountName: receivingBankAccount.accountName,
            accountNumber: receivingBankAccount.accountNumber,
            senderBank: bankDetails?.senderBank || 'Direct Bank Deposit',
            senderReference: bankDetails?.senderAccountName || customerName,
            transferSlipRef:
              bankDetails?.transferSlipRef ||
              `BK-POS-UTR-${Math.floor(10000000 + Math.random() * 90000000)}`,
          }
        : undefined,
    };

    setTransactions((prev) => [newTx, ...prev]);

    // Agent Commission calculation
    const earnedAmount = Math.round((prod.price * prod.agentCommissionRate) / 100);
    const newCommission: Commission = {
      id: `com-${Date.now()}`,
      agentId: currentUser.id,
      agentName: currentUser.name,
      branchId: currentUser.branchId || 'br-1',
      transactionRef: txRef,
      productName: prod.name,
      saleAmount: prod.price,
      commissionRate: prod.agentCommissionRate,
      amount: earnedAmount,
      currency: prod.currency,
      status: 'Approved',
      date: nowStr,
    };

    setCommissions((prev) => [newCommission, ...prev]);

    // Send notifications
    sendNotification({
      title: 'Agent Sale Completed & Commission Credited',
      message: `Sold ${prod.name} to ${customerPhone} via ${paymentMethod}. Earned ${earnedAmount.toLocaleString()} ${prod.currency} commission.`,
      channel: 'Push',
      type: 'success',
    });

    sendNotification({
      title: 'Your transaction was successful',
      message: `Payment received to ${receivingBankAccount.accountName} (${receivingBankAccount.bankName}). ${prod.name} applied to ${customerPhone}. Ref: ${txRef}`,
      channel: 'SMS',
      type: 'info',
      msisdn: customerPhone,
    });

    addAuditLog(
      'AGENT_PRODUCT_SALE',
      txRef,
      `Agent ${currentUser.name} processed sale ${prod.name} (${prod.price} ${prod.currency}) via ${paymentMethod} for ${customerPhone}`,
      'info'
    );

    setSelectedReceiptTransaction(newTx);
    return newTx;
  };

  const disburseCommissions = (
    agentId?: string,
    payoutDestination?: {
      method: 'Bank Transfer' | 'Mobile Money';
      bankName?: string;
      accountNumber?: string;
      accountName?: string;
    }
  ): number => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    let totalDisbursed = 0;

    setCommissions((prev) =>
      prev.map((c) => {
        if ((!agentId || c.agentId === agentId) && c.status === 'Approved') {
          totalDisbursed += c.amount;
          return {
            ...c,
            status: 'Disbursed',
            disbursedAt: nowStr,
          };
        }
        return c;
      })
    );

    const isBank = payoutDestination?.method === 'Bank Transfer';
    const destDesc = isBank
      ? `Real Bank Transfer to ${payoutDestination.accountName || receivingBankAccount.accountName} (${payoutDestination.bankName || receivingBankAccount.bankName} Acc: ${payoutDestination.accountNumber || receivingBankAccount.accountNumber})`
      : 'Agent Mobile Money Wallets';

    addAuditLog(
      'COMMISSION_DISBURSEMENT',
      agentId ? `Agent ${agentId}` : 'All Approved Commissions',
      `Settled ${totalDisbursed.toLocaleString()} RWF via ${destDesc}. Reference: EFT-BK-${Math.floor(100000 + Math.random() * 900000)}`,
      'info'
    );

    sendNotification({
      title: isBank ? 'Real Bank Transfer Payout Sent' : 'Commission Payout Settlement',
      message: isBank
        ? `Direct electronic funds transfer (EFT) of ${totalDisbursed.toLocaleString()} RWF sent to account ${payoutDestination?.accountName || receivingBankAccount.accountName} at ${payoutDestination?.bankName || receivingBankAccount.bankName}.`
        : `Mobile money payout of ${totalDisbursed.toLocaleString()} RWF has been successfully processed to agent wallets.`,
      channel: 'SMS',
      type: 'success',
    });

    return totalDisbursed;
  };

  const createProduct = (prodData: Omit<Product, 'id'>) => {
    const newProd: Product = {
      ...prodData,
      id: `prod-${Date.now()}`,
    };
    setProducts((prev) => [newProd, ...prev]);
    addAuditLog(
      'PRODUCT_CREATED',
      newProd.name,
      `Created new catalog product ${newProd.name} priced at ${newProd.price} ${newProd.currency}`,
      'info'
    );
  };

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, ...updates } : p))
    );
    addAuditLog(
      'PRODUCT_UPDATED',
      `Product ${productId}`,
      `Updated product specifications/price`,
      'info'
    );
  };

  const createSupportTicket = (
    subject: string,
    category: any,
    priority: any,
    initialMessage: string
  ): SupportTicket => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const refCode = `TKT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTicket: SupportTicket = {
      id: `tkt-${Date.now()}`,
      referenceNumber: refCode,
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerPhone: currentUser.phone,
      subject,
      category,
      priority,
      status: 'Open',
      createdAt: nowStr,
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderName: currentUser.name,
          isStaff: false,
          text: initialMessage,
          timestamp: nowStr,
        },
      ],
    };

    setTickets((prev) => [newTicket, ...prev]);

    sendNotification({
      title: `Support Ticket Created: ${refCode}`,
      message: `Your inquiry regarding "${subject}" has been assigned reference ${refCode}. An agent will respond shortly.`,
      channel: 'In-App',
      type: 'info',
    });

    addAuditLog(
      'SUPPORT_TICKET_OPENED',
      refCode,
      `Customer ${currentUser.name} created ticket: ${subject}`,
      'info'
    );

    return newTicket;
  };

  const replyToTicket = (ticketId: string, messageText: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const isStaff = currentUser.role !== 'customer';

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            status: isStaff ? 'In Progress' : t.status,
            messages: [
              ...t.messages,
              {
                id: `msg-${Date.now()}`,
                senderName: currentUser.name,
                isStaff,
                text: messageText,
                timestamp: nowStr,
              },
            ],
          };
        }
        return t;
      })
    );
  };

  const updateTicketStatus = (ticketId: string, newStatus: SupportTicket['status']) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              status: newStatus,
              resolvedAt: newStatus === 'Resolved' || newStatus === 'Closed' ? nowStr : t.resolvedAt,
            }
          : t
      )
    );
  };

  const toggleMfa = (userId?: string) => {
    const targetId = userId || currentUser.id;
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === targetId) {
          const updatedMfa = !u.mfaEnabled;
          addAuditLog(
            'MFA_POLICY_TOGGLED',
            `User ${u.name}`,
            `Multi-Factor Authentication was ${updatedMfa ? 'enabled' : 'disabled'}`,
            'warning'
          );
          return { ...u, mfaEnabled: updatedMfa };
        }
        return u;
      })
    );
  };

  const resolveSecurityAlert = (alertId: string, resolution: 'Resolved' | 'False Positive') => {
    setSecurityAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: resolution } : a))
    );
    addAuditLog(
      'SECURITY_ALERT_RESOLUTION',
      `Alert ${alertId}`,
      `Security alert marked as ${resolution} by ${currentUser.name}`,
      'info'
    );
  };

  // Helper getters
  const customerSim = sims.find((s) => s.customerId === currentUser.id || s.msisdn === currentUser.phone);
  const agentSims = sims.filter((s) => s.agentId === currentUser.id || s.branchId === currentUser.branchId);
  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  return (
    <FilsContext.Provider
      value={{
        currentUser,
        currentRole,
        activeView,
        setActiveView,
        switchUserRole,
        receivingBankAccount,
        updateReceivingBankAccount,
        users,
        sims,
        kycRecords,
        products,
        transactions,
        commissions,
        branches,
        tickets,
        notifications,
        auditLogs,
        securityAlerts,
        selectedReceiptTransaction,
        setSelectedReceiptTransaction,
        updateSimStatus,
        registerSimInField,
        reviewKyc,
        purchaseProduct,
        sellProductAsAgent,
        disburseCommissions,
        createProduct,
        updateProduct,
        createSupportTicket,
        replyToTicket,
        updateTicketStatus,
        markNotificationRead,
        markAllNotificationsRead,
        sendNotification,
        toggleMfa,
        addAuditLog,
        resolveSecurityAlert,
        customerSim,
        agentSims,
        unreadNotifsCount,
      }}
    >
      {children}
    </FilsContext.Provider>
  );
};

export const useFils = () => {
  const context = useContext(FilsContext);
  if (!context) {
    throw new Error('useFils must be used within a FilsProvider');
  }
  return context;
};
