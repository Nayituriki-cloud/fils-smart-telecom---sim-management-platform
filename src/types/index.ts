export type UserRole =
  | 'super_admin'
  | 'operations_manager'
  | 'compliance_officer'
  | 'finance_manager'
  | 'branch_manager'
  | 'agent'
  | 'customer';

export type SimStatus =
  | 'Available'
  | 'Assigned'
  | 'Registration Pending'
  | 'Verified'
  | 'Activated'
  | 'Suspended'
  | 'Deactivated';

export type NetworkType = '4G LTE' | '5G Ultra' | 'VoLTE' | 'eSIM Profile';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  roleTitle: string;
  branchId?: string;
  branchName?: string;
  avatarUrl?: string;
  mfaEnabled: boolean;
  status: 'Active' | 'Suspended' | 'Pending Verification';
  createdAt: string;
}

export interface SimAuditEntry {
  id: string;
  timestamp: string;
  action: string;
  performedBy: string;
  role: string;
  note?: string;
}

export interface SIM {
  id: string;
  iccid: string; // SIM Serial e.g. 89250 01100 24891 0021
  msisdn: string; // Phone number e.g. +250 78 842 1930
  imsi: string;
  pin1: string;
  puk1: string;
  pin2: string;
  puk2: string;
  networkType: NetworkType;
  status: SimStatus;
  customerId?: string;
  customerName?: string;
  agentId?: string;
  agentName?: string;
  branchId: string;
  branchName: string;
  registrationDate?: string;
  activationDate?: string;
  auditTrail: SimAuditEntry[];
}

export type KycStatus = 'Draft' | 'Submitted' | 'Under Review' | 'Verified' | 'Rejected';

export interface KycRecord {
  id: string;
  customerId: string;
  customerName: string;
  phone: string;
  email: string;
  nationalIdNumber: string;
  idType: 'National ID' | 'Passport' | 'Alien Resident Card';
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  nationality: string;
  residentialAddress: string;
  city: string;
  documentFrontUrl: string;
  documentBackUrl: string;
  selfieUrl: string;
  proofOfAddressUrl?: string;
  submissionDate: string;
  status: KycStatus;
  complianceScore: number; // 0-100
  isDuplicateFlagged: boolean;
  assignedSimIccid?: string;
  reviewerNotes?: string;
  rejectionReason?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export type ProductCategory =
  | 'Airtime'
  | 'Data Bundle'
  | 'Voice Package'
  | 'SMS Package'
  | 'Business Bundle'
  | 'Promotional';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number; // In local currency e.g. RWF / USD
  currency: string;
  validity: string; // e.g. "30 Days", "24 Hours"
  quota: string; // e.g. "25 GB High Speed", "500 Minutes", "1,000 Airtime"
  description: string;
  agentCommissionRate: number; // e.g. 6.5 (%)
  active: boolean;
  popular?: boolean;
  features: string[];
}

export interface BankAccountDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  swiftCode: string;
  branch: string;
  currency: string;
  contactPhone?: string;
  routingNumber?: string;
  instructions?: string;
}

export type PaymentMethod =
  | 'Direct Bank Transfer'
  | 'Instant Bank Wire (EFT)'
  | 'MTN MoMo'
  | 'Airtel Money'
  | 'M-Pesa'
  | 'Mobile Money'
  | 'Debit/Credit Card'
  | 'Agent Cash Voucher';

export interface Transaction {
  id: string;
  reference: string;
  type: 'Airtime Topup' | 'Data Purchase' | 'SIM Registration' | 'Voice Bundle' | 'Commission Payout' | 'eSIM Setup';
  amount: number;
  currency: string;
  msisdn: string;
  customerId: string;
  customerName: string;
  agentId?: string;
  agentName?: string;
  branchId?: string;
  paymentMethod: PaymentMethod;
  status: 'Completed' | 'Pending' | 'Failed' | 'Refunded';
  timestamp: string;
  productName?: string;
  receiptNumber: string;
  bankDetails?: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    senderReference?: string;
    transferSlipRef?: string;
    senderBank?: string;
  };
}

export interface Commission {
  id: string;
  agentId: string;
  agentName: string;
  branchId: string;
  transactionRef: string;
  productName: string;
  saleAmount: number;
  commissionRate: number;
  amount: number;
  currency: string;
  status: 'Pending' | 'Approved' | 'Disbursed';
  date: string;
  disbursedAt?: string;
}

export interface Branch {
  id: string;
  code: string;
  name: string;
  region: string;
  address: string;
  managerName: string;
  managerPhone: string;
  activeAgentsCount: number;
  simQuota: number;
  simsAllocated: number;
  simsActivated: number;
  totalRevenue: number;
  currency: string;
  status: 'Active' | 'Under Audit';
}

export interface SupportTicketMessage {
  id: string;
  senderName: string;
  isStaff: boolean;
  text: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  referenceNumber: string; // e.g. TKT-2026-9042
  customerId: string;
  customerName: string;
  customerPhone: string;
  subject: string;
  category: 'SIM Activation' | 'Network Issue' | 'Billing & Airtime' | 'KYC Verification' | 'Agent Inquiry' | 'PUK & PIN Reset';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  createdAt: string;
  resolvedAt?: string;
  messages: SupportTicketMessage[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  channel: 'SMS' | 'Email' | 'Push' | 'In-App';
  type: 'info' | 'success' | 'warning' | 'alert';
  timestamp: string;
  read: boolean;
  msisdn?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  role: string;
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface SecurityAlert {
  id: string;
  timestamp: string;
  type: 'Duplicate ID' | 'Rapid Registrations' | 'Geographic Anomaly' | 'Failed Login Spikes' | 'Unauthorized Status Advance';
  severity: 'low' | 'medium' | 'high';
  description: string;
  targetMsisdn?: string;
  branchName?: string;
  status: 'Investigating' | 'Resolved' | 'False Positive';
}
