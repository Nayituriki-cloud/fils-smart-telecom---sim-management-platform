import React, { useState } from 'react';
import { useFils } from '../../context/FilsContext';
import { UserRole } from '../../types';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Key,
  Users,
  AlertTriangle,
  CheckCircle2,
  Search,
  Download,
  FileText,
  Clock,
  Zap,
} from 'lucide-react';

export const SecurityCenter: React.FC = () => {
  const {
    auditLogs,
    securityAlerts,
    resolveSecurityAlert,
    currentUser,
    users,
    toggleMfa,
  } = useFils();

  const [activeTab, setActiveTab] = useState<'rbac' | 'audit' | 'alerts' | 'policies'>('rbac');
  const [auditSearch, setAuditSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'info' | 'warning' | 'critical'>('all');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.userName.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.resource.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.details.toLowerCase().includes(auditSearch.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || log.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const rbacRoles: {
    role: UserRole;
    title: string;
    description: string;
    permissions: string[];
  }[] = [
    {
      role: 'super_admin',
      title: 'Super Admin',
      description: 'Unrestricted enterprise control across network core, billing, audit, and policies.',
      permissions: [
        'Full System Configuration',
        'SIM State Overrides & Quarantine',
        'MNO Gateway API Keys',
        'Staff User Provisioning',
        'Audit Trail Export',
      ],
    },
    {
      role: 'operations_manager',
      title: 'Operations Manager',
      description: 'SIM inventory logistics, network provisioning, and regional branch quotas.',
      permissions: [
        'SIM Inventory Allocation',
        'Carrier HSS State Activation',
        'Branch Stock Transfers',
        'Agent Territory Assignments',
      ],
    },
    {
      role: 'compliance_officer',
      title: 'Compliance Officer',
      description: 'Statutory KYC review, biometric liveness validation, fraud quarantine.',
      permissions: [
        'National ID Document Verification',
        'KYC Approval & Rejection',
        'Duplicate Identity Flagging',
        'Suspicious SIM Freeze',
      ],
    },
    {
      role: 'finance_manager',
      title: 'Finance Manager',
      description: 'Billing audit, tariff pricing, mobile money reconciliation, and agent payouts.',
      permissions: [
        'Batch Commission Settlement',
        'Revenue & Tax Invoicing',
        'Tariff Pricing Adjustments',
        'Payment Gateway Audits',
      ],
    },
    {
      role: 'branch_manager',
      title: 'Branch Manager',
      description: 'Regional station oversight, kiosk agent roster, and local stock control.',
      permissions: [
        'Local SIM Stock Management',
        'Agent Performance Auditing',
        'Branch Sales Reporting',
        'Support Ticket Escalation',
      ],
    },
    {
      role: 'agent',
      title: 'Field Agent',
      description: 'Customer onboarding, document upload, POS sales, and receipt generation.',
      permissions: [
        'Customer KYC Data Capture',
        'Airtime & Data Bundle Sales',
        'SIM Pairing Submission',
        'Receipt Printing',
      ],
    },
    {
      role: 'customer',
      title: 'Subscriber / Customer',
      description: 'Personal line management, bundle purchases, and PUK unlock assistance.',
      permissions: [
        'View Active SIM Balances',
        'Self-Service Top-Up',
        'PUK Code Retrieval',
        'Open Support Inquiries',
      ],
    },
  ];

  const exportAuditLogs = () => {
    const headers = 'Timestamp,User,Role,Action,Resource,Details,IP,Severity\n';
    const rows = filteredLogs
      .map(
        (l) =>
          `"${l.timestamp}","${l.userName}","${l.role}","${l.action}","${l.resource}","${l.details}","${l.ipAddress}","${l.severity}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FILS-Audit-Trail-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            Enterprise Governance & Cryptography
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
            <span>FILS Security Center & RBAC</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-mono font-medium">
              Zero Trust Architecture
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Role-based access matrix, immutable compliance audit logs, multi-factor authentication, and automated fraud quarantine.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-2 text-xs font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300">Security Health:</span>
            <span className="text-emerald-400 font-bold">98 / 100</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 pb-4 border-b border-slate-800/80 overflow-x-auto">
        {[
          { id: 'rbac', label: '1. Role-Based Access Control (RBAC)', icon: Users },
          { id: 'audit', label: '2. Immutable Audit Trail', icon: FileText },
          { id: 'alerts', label: '3. Fraud & Suspicious Activity', icon: ShieldAlert },
          { id: 'policies', label: '4. Encryption & Privacy Policies', icon: Lock },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: RBAC MATRIX */}
      {activeTab === 'rbac' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-400 max-w-2xl">
            FILS enforces fine-grained role segregation according to national telecom regulations.
            Field agents cannot override sensitive SIM states; compliance officers validate identity
            records; only finance managers can trigger bank disbursements.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rbacRoles.map((r) => {
              const isCurrent = currentUser.role === r.role;
              return (
                <div
                  key={r.role}
                  className={`p-5 bg-slate-900 border rounded-2xl flex flex-col justify-between transition-all ${
                    isCurrent
                      ? 'border-emerald-500/80 shadow-lg shadow-emerald-500/10'
                      : 'border-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-white">{r.title}</span>
                      {isCurrent && (
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-bold uppercase">
                          Your Active Role
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mb-4 leading-relaxed">{r.description}</p>
                    <div className="space-y-1.5 mb-4">
                      {r.permissions.map((p, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-xs text-slate-300 font-mono"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 text-[10px] text-slate-500 font-mono">
                    RBAC Identifier: role.{r.role}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: AUDIT TRAIL (Requirement 10) */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search audit action, user name, IP address, or details..."
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value as any)}
                className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="all">All Severities</option>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="critical">Critical</option>
              </select>

              <button
                onClick={exportAuditLogs}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Export Audit CSV</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 font-mono">
                <tr>
                  <th className="p-3.5">TIMESTAMP</th>
                  <th className="p-3.5">OPERATOR</th>
                  <th className="p-3.5">ACTION</th>
                  <th className="p-3.5">RESOURCE</th>
                  <th className="p-3.5">AUDIT DETAILS</th>
                  <th className="p-3.5">SOURCE IP</th>
                  <th className="p-3.5 text-right">SEVERITY</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono text-slate-300">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 text-slate-400">{log.timestamp}</td>
                    <td className="p-3.5 font-sans">
                      <div className="font-semibold text-white">{log.userName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{log.role}</div>
                    </td>
                    <td className="p-3.5 text-emerald-400 font-bold">{log.action}</td>
                    <td className="p-3.5 text-slate-300">{log.resource}</td>
                    <td className="p-3.5 font-sans text-slate-300 max-w-xs">{log.details}</td>
                    <td className="p-3.5 text-slate-500">{log.ipAddress}</td>
                    <td className="p-3.5 text-right">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          log.severity === 'critical'
                            ? 'bg-rose-500/15 text-rose-400'
                            : log.severity === 'warning'
                            ? 'bg-amber-500/15 text-amber-400'
                            : 'bg-emerald-500/15 text-emerald-400'
                        }`}
                      >
                        {log.severity.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: FRAUD ALERTS (Requirement 10) */}
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-400 max-w-2xl">
            Automated anomaly detection identifies duplicate ID reuse, high-frequency registrations
            by rogue field agents, and unauthorized SIM status advancement attempts.
          </div>

          <div className="space-y-3">
            {securityAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      alert.severity === 'high'
                        ? 'bg-rose-500/15 text-rose-400'
                        : 'bg-amber-500/15 text-amber-400'
                    }`}
                  >
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-sm">{alert.type}</h4>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {alert.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {alert.description}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-2 font-mono">
                      {alert.branchName && <span>Location: {alert.branchName}</span>}
                      {alert.targetMsisdn && <span>Target MSISDN: {alert.targetMsisdn}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 font-sans">
                  {alert.status === 'Investigating' ? (
                    <>
                      <button
                        onClick={() => resolveSecurityAlert(alert.id, 'Resolved')}
                        className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-colors"
                      >
                        Mark Cleared
                      </button>
                      <button
                        onClick={() => resolveSecurityAlert(alert.id, 'False Positive')}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors"
                      >
                        False Alarm
                      </button>
                    </>
                  ) : (
                    <span className="px-3 py-1 bg-slate-800 text-emerald-400 font-mono text-xs rounded-xl font-semibold">
                      STATUS: {alert.status.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ENCRYPTION & PRIVACY POLICIES */}
      {activeTab === 'policies' && (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">
              Telecom Regulatory & Cryptographic Architecture
            </h3>
            <p className="text-xs text-slate-400">
              Technical protections implemented across FILS core infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <Lock className="w-4 h-4" />
                <span>Zero Raw Payment Card Storage</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                FILS never stores raw credit/debit card numbers, CVVs, or bank credentials. All
                payments are tokenized through authorized mobile money switches (MTN MoMo, M-Pesa,
                Airtel Money) and PCI-DSS level 1 compliant processors.
              </p>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <Key className="w-4 h-4" />
                <span>National ID Document Encryption</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Scanned National ID documents, passport photos, and biometric selfies are encrypted
                using AES-256-GCM. Decryption keys are rotated periodically with strict access
                logging.
              </p>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Carrier Gateway Rate Limiting</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                SIM registration endpoints are rate-limited to 20 requests/minute per agent terminal
                to thwart bot-driven brute-force SIM activation attacks.
              </p>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <Users className="w-4 h-4" />
                <span>Multi-Factor Authentication (MFA)</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                MFA is mandatory for all administrative and field agent accounts. Subscribers can
                enable MFA to lock their SIM profiles against unauthorized SIM swap requests.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
