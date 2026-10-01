import React, { useState } from 'react';
import { useFils } from '../../context/FilsContext';
import {
  Users,
  Layers,
  Smartphone,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  Building2,
  AlertTriangle,
  ArrowUpRight,
  Download,
  Filter,
  BarChart3,
  Signal,
  ShieldAlert,
  Edit2,
  Copy,
  Check,
  CreditCard,
  Lock,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    users,
    sims,
    kycRecords,
    transactions,
    commissions,
    branches,
    securityAlerts,
    setActiveView,
    switchUserRole,
    receivingBankAccount,
    updateReceivingBankAccount,
  } = useFils();

  const [dateRange, setDateRange] = useState('Month');
  const [showBankModal, setShowBankModal] = useState(false);
  const [bankEditForm, setBankEditForm] = useState({ ...receivingBankAccount });
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  // Bank transfer revenue calculation
  const bankTransfers = transactions.filter(
    (t) =>
      t.paymentMethod === 'Direct Bank Transfer' ||
      t.paymentMethod === 'Instant Bank Wire (EFT)'
  );
  const bankTransferTotal = bankTransfers.reduce((sum, t) => sum + t.amount, 0);

  // Copy helper
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveBankDetails = (e: React.FormEvent) => {
    e.preventDefault();
    updateReceivingBankAccount(bankEditForm);
    setSaveSuccessMsg(true);
    setTimeout(() => {
      setSaveSuccessMsg(false);
      setShowBankModal(false);
    }, 1500);
  };

  // Stats calculation
  const totalCustomers = users.filter((u) => u.role === 'customer').length + 24680;
  const activeSimsCount = sims.filter((s) => s.status === 'Activated').length + 21450;
  const availableSimsCount = sims.filter((s) => s.status === 'Available').length + 8420;
  const pendingKycCount = kycRecords.filter(
    (k) => k.status === 'Submitted' || k.status === 'Under Review'
  ).length;
  const activeAgentsCount = branches.reduce((sum, b) => sum + b.activeAgentsCount, 0);

  // Financial aggregates
  const todaySales = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalRevenue = branches.reduce((sum, b) => sum + b.totalRevenue, 0);
  const totalCommissions = commissions.reduce((sum, c) => sum + c.amount, 0) + 1284000;

  // Category breakdown
  const categorySplit = [
    { label: '5G & 4G Data Bundles', pct: 54, color: 'bg-emerald-500' },
    { label: 'Airtime Recharge', pct: 28, color: 'bg-teal-500' },
    { label: 'All-Net Voice Packages', pct: 12, color: 'bg-cyan-500' },
    { label: 'eSIM & Corporate Connect', pct: 6, color: 'bg-indigo-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            Executive Operations Dashboard
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
            <span>FILS Telecom Management Suite</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-mono font-medium">
              Live Core
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Enterprise telecommunications performance, SIM logistics, KYC velocity, and revenue reconciliation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs font-mono">
            {['Today', 'Week', 'Month', 'Quarter'].map((r) => (
              <button
                key={r}
                onClick={() => setDateRange(r)}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  dateRange === r
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Primary KPI Grid (Requirement 5) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Customers */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-center text-slate-400 mb-2">
            <span className="text-xs font-medium">Total Customers</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-white">
              {totalCustomers.toLocaleString()}
            </div>
            <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-mono">
              <TrendingUp className="w-3 h-3" />
              <span>+8.4% month-over-month</span>
            </div>
          </div>
        </div>

        {/* Active SIMs */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-center text-slate-400 mb-2">
            <span className="text-xs font-medium">Active Carrier SIMs</span>
            <Signal className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-cyan-300">
              {activeSimsCount.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 font-mono">
              98.2% network activity rate
            </div>
          </div>
        </div>

        {/* Available SIMs */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-center text-slate-400 mb-2">
            <span className="text-xs font-medium">Available Blank SIMs</span>
            <Layers className="w-4 h-4 text-teal-400" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-white">
              {availableSimsCount.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 font-mono">
              In branch & field inventory
            </div>
          </div>
        </div>

        {/* Pending Registrations */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-center text-slate-400 mb-2">
            <span className="text-xs font-medium">Pending KYC Reviews</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-amber-400">
              {pendingKycCount}
            </div>
            <button
              onClick={() => {
                switchUserRole('compliance_officer');
                setActiveView('compliance');
              }}
              className="text-[11px] text-amber-300 hover:underline mt-1 font-semibold flex items-center gap-1"
            >
              <span>Review in Compliance</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Active Agents */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-center text-slate-400 mb-2">
            <span className="text-xs font-medium">Accredited Field Agents</span>
            <Building2 className="w-4 h-4 text-teal-400" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-white">
              {activeAgentsCount} Agents
            </div>
            <div className="text-[11px] text-slate-400 mt-1 font-mono">
              Across 5 regional hubs
            </div>
          </div>
        </div>

        {/* Today's Sales */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-center text-slate-400 mb-2">
            <span className="text-xs font-medium">Today's POS Sales</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-emerald-400">
              {todaySales.toLocaleString()} <span className="text-xs">RWF</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1 font-mono">
              {transactions.length} transactions processed
            </div>
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-center text-slate-400 mb-2">
            <span className="text-xs font-medium">Monthly Gross Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-white">
              {totalRevenue.toLocaleString()} <span className="text-xs">RWF</span>
            </div>
            <div className="text-[11px] text-emerald-400 mt-1 font-mono">
              104.2% of national target
            </div>
          </div>
        </div>

        {/* Commissions Paid */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-center text-slate-400 mb-2">
            <span className="text-xs font-medium">Agent Commissions</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-amber-300">
              {totalCommissions.toLocaleString()} <span className="text-xs">RWF</span>
            </div>
            <button
              onClick={() => {
                switchUserRole('finance_manager');
                setActiveView('commissions');
              }}
              className="text-[11px] text-slate-400 hover:text-white mt-1 font-mono flex items-center gap-1"
            >
              <span>Settlement Center &rarr;</span>
            </button>
          </div>
        </div>
      </div>

      {/* Analytics & Breakdown Section (Requirement 5 & 13) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Telecom Product Mix */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl">
          <h3 className="font-bold text-white text-base mb-1">Carrier Revenue Breakdown</h3>
          <p className="text-xs text-slate-400 mb-4">
            Product revenue share by category across all networks.
          </p>

          <div className="space-y-4">
            {categorySplit.map((cat) => (
              <div key={cat.label} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">{cat.label}</span>
                  <span className="text-white font-bold font-mono">{cat.pct}%</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${cat.color} rounded-full`}
                    style={{ width: `${cat.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Average ARPU:</span>
            <span className="text-white font-bold">4,850 RWF / month</span>
          </div>
        </div>

        {/* Regional Branch Leaderboard */}
        <div className="lg:col-span-2 p-6 bg-slate-900 border border-slate-800 rounded-3xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-white text-base">Regional Hub Performance</h3>
              <p className="text-xs text-slate-400">
                SIM activations, agent strength, and gross revenue by territory.
              </p>
            </div>
            <button
              onClick={() => setActiveView('branches')}
              className="text-xs font-semibold text-emerald-400 hover:underline"
            >
              Manage Hubs &rarr;
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 font-mono">
                <tr>
                  <th className="pb-2">HUB NAME</th>
                  <th className="pb-2">REGION</th>
                  <th className="pb-2">AGENTS</th>
                  <th className="pb-2">ACTIVATIONS</th>
                  <th className="pb-2 text-right">REVENUE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                {branches.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 font-bold text-white font-sans">{b.name}</td>
                    <td className="py-2.5 text-slate-400">{b.region}</td>
                    <td className="py-2.5">{b.activeAgentsCount}</td>
                    <td className="py-2.5 text-emerald-400 font-bold">
                      {b.simsActivated.toLocaleString()}
                    </td>
                    <td className="py-2.5 text-right font-bold text-white">
                      {b.totalRevenue.toLocaleString()} {b.currency}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Direct Real Bank Transfer Settlement Card (Emmanuel Nayituriki Account) */}
      <div className="p-6 bg-slate-900 border border-emerald-500/30 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Official Real Bank Settlement Account
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                ACTIVE RECEIVING GATEWAY
              </span>
            </div>
            <h3 className="text-lg font-bold text-white">
              Primary Direct Bank Transfer Destination
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              All direct bank transfers, airtime/data bank payments, and telecom wire settlements are deposited to this designated account.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] text-slate-400 font-mono uppercase">Direct Bank Inflows</div>
              <div className="text-lg font-extrabold text-emerald-400 font-mono">
                {bankTransferTotal.toLocaleString()} RWF
              </div>
            </div>
            <button
              onClick={() => {
                setBankEditForm({ ...receivingBankAccount });
                setShowBankModal(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-500/20"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Account Details</span>
            </button>
          </div>
        </div>

        {/* Bank Account Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
            <div>
              <div className="text-[10px] text-slate-400 font-mono">BENEFICIARY NAME</div>
              <div className="font-bold text-white text-sm">{receivingBankAccount.accountName}</div>
            </div>
            <button
              onClick={() => handleCopy(receivingBankAccount.accountName, 'accName')}
              className="p-1.5 hover:text-emerald-400 text-slate-400 transition-colors"
              title="Copy"
            >
              {copiedKey === 'accName' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
            <div>
              <div className="text-[10px] text-slate-400 font-mono">BANK NAME & BRANCH</div>
              <div className="font-bold text-emerald-400">{receivingBankAccount.bankName}</div>
              <div className="text-[10px] text-slate-400">{receivingBankAccount.branch}</div>
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-emerald-500/40 flex justify-between items-center">
            <div>
              <div className="text-[10px] text-slate-400 font-mono">ACCOUNT NUMBER</div>
              <div className="font-extrabold text-white text-base tracking-wider font-mono">
                {receivingBankAccount.accountNumber}
              </div>
            </div>
            <button
              onClick={() => handleCopy(receivingBankAccount.accountNumber, 'accNum')}
              className="p-1.5 hover:text-emerald-400 text-slate-400 transition-colors"
              title="Copy"
            >
              {copiedKey === 'accNum' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
            <div>
              <div className="text-[10px] text-slate-400 font-mono">CONTACT / NOTIFICATION PHONE</div>
              <div className="font-extrabold text-emerald-300 text-sm font-mono">
                {receivingBankAccount.contactPhone || '0785964635'}
              </div>
            </div>
            <button
              onClick={() => handleCopy(receivingBankAccount.contactPhone || '0785964635', 'contactPhone')}
              className="p-1.5 hover:text-emerald-400 text-slate-400 transition-colors"
              title="Copy"
            >
              {copiedKey === 'contactPhone' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-400 font-mono">SWIFT / BIC:</span>
              <span className="font-mono font-bold text-white">{receivingBankAccount.swiftCode}</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-[10px] text-slate-400 font-mono">CURRENCY:</span>
              <span className="font-mono font-bold text-emerald-400">{receivingBankAccount.currency}</span>
            </div>
          </div>
        </div>

        {receivingBankAccount.instructions && (
          <div className="mt-3 p-2.5 bg-slate-950/70 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2">
            <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong className="text-slate-300">Clearing Note: </strong>
              {receivingBankAccount.instructions}
            </span>
          </div>
        )}
      </div>

      {/* Security & Risk Alert Feed */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base">Active Fraud & Anomaly Alerts</h3>
          </div>
          <button
            onClick={() => setActiveView('security')}
            className="text-xs text-amber-400 hover:underline font-semibold"
          >
            Open Security Center &rarr;
          </button>
        </div>

        <div className="space-y-3">
          {securityAlerts.map((alert) => (
            <div
              key={alert.id}
              className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl flex items-start justify-between gap-4 text-xs"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle
                  className={`w-4 h-4 shrink-0 mt-0.5 ${
                    alert.severity === 'high'
                      ? 'text-rose-400'
                      : alert.severity === 'medium'
                      ? 'text-amber-400'
                      : 'text-sky-400'
                  }`}
                />
                <div>
                  <div className="font-bold text-white flex items-center gap-2">
                    <span>{alert.type}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{alert.timestamp}</span>
                  </div>
                  <div className="text-slate-400 mt-0.5">{alert.description}</div>
                </div>
              </div>

              <div className="shrink-0 font-mono">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    alert.status === 'Resolved'
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : 'bg-amber-500/15 text-amber-400'
                  }`}
                >
                  {alert.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Bank Account Settings Modal */}
      {showBankModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-base">Configure Real Receiving Bank Account</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold">
                MERCHANT ACCOUNT
              </span>
            </div>

            {saveSuccessMsg ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-2xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Bank account details successfully updated and saved!</span>
              </div>
            ) : (
              <form onSubmit={handleSaveBankDetails} className="space-y-3 font-sans text-xs">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Beneficiary Account Name *
                  </label>
                  <input
                    type="text"
                    value={bankEditForm.accountName}
                    onChange={(e) => setBankEditForm({ ...bankEditForm, accountName: e.target.value })}
                    placeholder="e.g. Emmanuel Nayituriki"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Contact Phone (Confirmation & Inquiries) *
                  </label>
                  <input
                    type="text"
                    value={bankEditForm.contactPhone || ''}
                    onChange={(e) => setBankEditForm({ ...bankEditForm, contactPhone: e.target.value })}
                    placeholder="e.g. 0785964635"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Bank Name *
                    </label>
                    <input
                      type="text"
                      value={bankEditForm.bankName}
                      onChange={(e) => setBankEditForm({ ...bankEditForm, bankName: e.target.value })}
                      placeholder="e.g. Bank of Kigali (BK)"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Branch *
                    </label>
                    <input
                      type="text"
                      value={bankEditForm.branch}
                      onChange={(e) => setBankEditForm({ ...bankEditForm, branch: e.target.value })}
                      placeholder="e.g. Kigali Heights Commercial Branch"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Account Number *
                    </label>
                    <input
                      type="text"
                      value={bankEditForm.accountNumber}
                      onChange={(e) => setBankEditForm({ ...bankEditForm, accountNumber: e.target.value })}
                      placeholder="e.g. 00040-06948201-38"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      SWIFT / BIC Code *
                    </label>
                    <input
                      type="text"
                      value={bankEditForm.swiftCode}
                      onChange={(e) => setBankEditForm({ ...bankEditForm, swiftCode: e.target.value })}
                      placeholder="e.g. BKIGRWRW"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Routing / Clearing Code
                    </label>
                    <input
                      type="text"
                      value={bankEditForm.routingNumber || ''}
                      onChange={(e) => setBankEditForm({ ...bankEditForm, routingNumber: e.target.value })}
                      placeholder="e.g. BK-001-948"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Currency
                    </label>
                    <input
                      type="text"
                      value={bankEditForm.currency}
                      onChange={(e) => setBankEditForm({ ...bankEditForm, currency: e.target.value })}
                      placeholder="e.g. RWF"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Customer Transfer Memo Instructions
                  </label>
                  <textarea
                    rows={2}
                    value={bankEditForm.instructions || ''}
                    onChange={(e) => setBankEditForm({ ...bankEditForm, instructions: e.target.value })}
                    placeholder="Instructions displayed to customers and agents during bank transfer..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowBankModal(false)}
                    className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save & Deploy Bank Details</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
