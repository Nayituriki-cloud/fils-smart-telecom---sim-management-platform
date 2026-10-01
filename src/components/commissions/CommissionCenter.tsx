import React, { useState } from 'react';
import { useFils } from '../../context/FilsContext';
import {
  DollarSign,
  ArrowDownToLine,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Users,
  Wallet,
  Building,
  Building2,
  TrendingUp,
  Receipt,
  Edit2,
  Lock,
} from 'lucide-react';

export const CommissionCenter: React.FC = () => {
  const {
    commissions,
    disburseCommissions,
    branches,
    currentUser,
    receivingBankAccount,
    updateReceivingBankAccount,
  } = useFils();

  const [statusFilter, setStatusFilter] = useState<'All' | 'Approved' | 'Disbursed' | 'Pending'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [disburseSuccess, setDisburseSuccess] = useState('');

  // Bank Account Modal
  const [showBankSettingsModal, setShowBankSettingsModal] = useState(false);
  const [editBankForm, setEditBankForm] = useState({ ...receivingBankAccount });

  const approvedSum = commissions
    .filter((c) => c.status === 'Approved')
    .reduce((sum, c) => sum + c.amount, 0);

  const disbursedSum = commissions
    .filter((c) => c.status === 'Disbursed')
    .reduce((sum, c) => sum + c.amount, 0);

  const totalSum = commissions.reduce((sum, c) => sum + c.amount, 0);

  const filteredCommissions = commissions.filter((c) => {
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesSearch =
      c.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.transactionRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.productName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleBatchDisburse = () => {
    if (approvedSum === 0) {
      alert('No approved commission records pending settlement.');
      return;
    }
    const settledAmount = disburseCommissions(undefined, {
      method: 'Bank Transfer',
      bankName: receivingBankAccount.bankName,
      accountName: receivingBankAccount.accountName,
      accountNumber: receivingBankAccount.accountNumber,
    });
    setDisburseSuccess(
      `Successfully disbursed ${settledAmount.toLocaleString()} RWF via Real Bank Transfer (EFT) to account ${receivingBankAccount.accountName} (${receivingBankAccount.bankName} Acc: ${receivingBankAccount.accountNumber}).`
    );
    setTimeout(() => setDisburseSuccess(''), 5000);
  };

  const handleSaveBankSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateReceivingBankAccount(editBankForm);
    setShowBankSettingsModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            Finance & Bank Account Settlement
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
            <span>Agent Commission & Bank Payout System</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
              Direct Bank Clearing: ACTIVE
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time calculation of agent earnings and electronic wire settlements directly to designated accounts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditBankForm({ ...receivingBankAccount });
              setShowBankSettingsModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors"
          >
            <Building2 className="w-4 h-4 text-emerald-400" />
            <span>Bank Settlement Config</span>
          </button>
          <button
            onClick={handleBatchDisburse}
            disabled={approvedSum === 0}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-lg shadow-emerald-500/20"
          >
            <ArrowDownToLine className="w-4 h-4" />
            <span>Disburse Real Bank Wire ({approvedSum.toLocaleString()} RWF)</span>
          </button>
        </div>
      </div>

      {/* Primary Settlement Account Status Banner */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-white flex items-center gap-2">
              <span>Primary Real Bank Account: {receivingBankAccount.accountName}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">
                DEFAULT SETTLEMENT
              </span>
            </div>
            <div className="text-slate-400 font-mono mt-0.5">
              {receivingBankAccount.bankName} · Acc: <span className="text-white font-bold">{receivingBankAccount.accountNumber}</span> · SWIFT: {receivingBankAccount.swiftCode} · Contact: <span className="text-emerald-400 font-bold">{receivingBankAccount.contactPhone || '0785964635'}</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            setEditBankForm({ ...receivingBankAccount });
            setShowBankSettingsModal(true);
          }}
          className="text-xs font-semibold text-emerald-400 hover:underline self-start md:self-auto"
        >
          Edit Account &rarr;
        </button>
      </div>

      {disburseSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{disburseSuccess}</span>
        </div>
      )}

      {/* Metric Cards (Requirement 8) */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="flex justify-between items-center text-slate-400 mb-1">
            <span className="text-xs">Pending Approved Payout</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {approvedSum.toLocaleString()} <span className="text-xs">RWF</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1 font-mono">
            Ready for instant batch mobile transfer
          </div>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="flex justify-between items-center text-slate-400 mb-1">
            <span className="text-xs">Total Settled (Paid)</span>
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {disbursedSum.toLocaleString()} <span className="text-xs">RWF</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1 font-mono">
            Transferred directly to agent accounts
          </div>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="flex justify-between items-center text-slate-400 mb-1">
            <span className="text-xs">Cumulative Commission</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-300">
            {totalSum.toLocaleString()} <span className="text-xs">RWF</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1 font-mono">All-time earnings</div>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="flex justify-between items-center text-slate-400 mb-1">
            <span className="text-xs">Average Commission Payout</span>
            <Wallet className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-300">
            {commissions.length > 0 ? Math.round(totalSum / commissions.length).toLocaleString() : 0}{' '}
            <span className="text-xs">RWF</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1 font-mono">Per transaction average</div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by agent name, transaction reference, or product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex gap-2">
          {(['All', 'Approved', 'Disbursed'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                statusFilter === st
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Commission Ledger Table */}
      <div className="overflow-x-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 font-mono">
            <tr>
              <th className="p-3.5">DATE & TIME</th>
              <th className="p-3.5">TX REFERENCE</th>
              <th className="p-3.5">AGENT NAME</th>
              <th className="p-3.5">PRODUCT SOLD</th>
              <th className="p-3.5">SALE AMOUNT</th>
              <th className="p-3.5">COMMISSION RATE</th>
              <th className="p-3.5">PAYOUT EARNED</th>
              <th className="p-3.5 text-right">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 font-mono text-slate-300">
            {filteredCommissions.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-500">
                  No commission entries found.
                </td>
              </tr>
            ) : (
              filteredCommissions.map((com) => (
                <tr key={com.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 text-slate-400">{com.date}</td>
                  <td className="p-3.5 font-bold text-white">{com.transactionRef}</td>
                  <td className="p-3.5 font-sans font-semibold text-slate-200">{com.agentName}</td>
                  <td className="p-3.5 font-sans text-slate-300">{com.productName}</td>
                  <td className="p-3.5">
                    {com.saleAmount.toLocaleString()} {com.currency}
                  </td>
                  <td className="p-3.5 text-teal-400">{com.commissionRate}%</td>
                  <td className="p-3.5 font-bold text-emerald-400">
                    +{com.amount.toLocaleString()} {com.currency}
                  </td>
                  <td className="p-3.5 text-right font-sans">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        com.status === 'Disbursed'
                          ? 'bg-slate-800 text-slate-400 border border-slate-700'
                          : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {com.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Bank Account Settings Modal */}
      {showBankSettingsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-base">Configure Settlement Bank Account</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                REAL BANK CLEARING
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Payments transferred by customers and commission payouts to this account will clear automatically via national electronic wire switches.
            </p>

            <form onSubmit={handleSaveBankSettings} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={editBankForm.bankName}
                    onChange={(e) => setEditBankForm({ ...editBankForm, bankName: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Beneficiary Account Name
                  </label>
                  <input
                    type="text"
                    value={editBankForm.accountName}
                    onChange={(e) => setEditBankForm({ ...editBankForm, accountName: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-bold focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Contact Phone (Confirmation & MoMo Payouts)
                </label>
                <input
                  type="text"
                  value={editBankForm.contactPhone || ''}
                  onChange={(e) => setEditBankForm({ ...editBankForm, contactPhone: e.target.value })}
                  placeholder="e.g. 0785964635"
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono font-bold text-emerald-400 focus:outline-none focus:border-emerald-500 tracking-wider"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Bank Account Number
                  </label>
                  <input
                    type="text"
                    value={editBankForm.accountNumber}
                    onChange={(e) => setEditBankForm({ ...editBankForm, accountNumber: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono font-bold text-emerald-400 focus:outline-none focus:border-emerald-500 tracking-wider"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    SWIFT / BIC Code
                  </label>
                  <input
                    type="text"
                    value={editBankForm.swiftCode}
                    onChange={(e) => setEditBankForm({ ...editBankForm, swiftCode: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Branch Location
                  </label>
                  <input
                    type="text"
                    value={editBankForm.branch}
                    onChange={(e) => setEditBankForm({ ...editBankForm, branch: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Currency & Clearing
                  </label>
                  <input
                    type="text"
                    value={editBankForm.currency}
                    onChange={(e) => setEditBankForm({ ...editBankForm, currency: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Customer Transfer Reference Instructions
                </label>
                <textarea
                  rows={2}
                  value={editBankForm.instructions || ''}
                  onChange={(e) => setEditBankForm({ ...editBankForm, instructions: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBankSettingsModal(false)}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors"
                >
                  Save Account Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
