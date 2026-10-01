import React, { useState } from 'react';
import { useFils } from '../../context/FilsContext';
import { Branch } from '../../types';
import {
  Building2,
  Users,
  Layers,
  TrendingUp,
  MapPin,
  Phone,
  ArrowRightLeft,
  CheckCircle2,
  Search,
} from 'lucide-react';

export const BranchManagement: React.FC = () => {
  const { branches, sims, currentUser, addAuditLog } = useFils();

  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(branches[0] || null);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [sourceBranchId, setSourceBranchId] = useState(branches[0]?.id || '');
  const [targetBranchId, setTargetBranchId] = useState(branches[1]?.id || '');
  const [transferCount, setTransferCount] = useState(100);
  const [transferSuccess, setTransferSuccess] = useState('');

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sourceBranchId === targetBranchId) {
      alert('Source and destination branches must be different.');
      return;
    }

    const src = branches.find((b) => b.id === sourceBranchId);
    const dst = branches.find((b) => b.id === targetBranchId);

    addAuditLog(
      'SIM_STOCK_TRANSFER',
      `Between ${src?.name} and ${dst?.name}`,
      `Transferred ${transferCount} SIM blanks from ${src?.name} to ${dst?.name}`,
      'info'
    );

    setTransferSuccess(
      `Successfully transferred ${transferCount} SIM blanks to ${dst?.name} logistics cache.`
    );
    setTimeout(() => {
      setShowTransferModal(false);
      setTransferSuccess('');
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            Regional Territory & Kiosk Operations
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
            <span>FILS Branch & Regional Hub Management</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono font-medium">
              {branches.length} Operational Centers
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Monitor branch performance, field agent deployment rosters, regional SIM inventory quotas, and stock transfers.
          </p>
        </div>

        <button
          onClick={() => setShowTransferModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-md shadow-emerald-500/20"
        >
          <ArrowRightLeft className="w-4 h-4" />
          <span>Transfer SIM Inventory</span>
        </button>
      </div>

      {/* Branch Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {branches.map((b) => {
          const quotaPercent = Math.round((b.simsAllocated / b.simQuota) * 100);
          return (
            <div
              key={b.id}
              onClick={() => setSelectedBranch(b)}
              className={`p-6 bg-slate-900 border rounded-3xl flex flex-col justify-between cursor-pointer transition-all ${
                selectedBranch?.id === b.id
                  ? 'border-emerald-500/70 shadow-lg shadow-emerald-500/5'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono text-emerald-400 font-semibold">{b.code}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold font-mono">
                    {b.status}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-1">{b.name}</h3>
                <div className="text-xs text-slate-400 flex items-start gap-1.5 mb-4">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                  <span>{b.address}</span>
                </div>

                {/* Quota Progress */}
                <div className="space-y-1 mb-4">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">SIM Inventory Quota</span>
                    <span className="text-white font-bold">{quotaPercent}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full"
                      style={{ width: `${quotaPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>{b.simsAllocated.toLocaleString()} allocated</span>
                    <span>{b.simQuota.toLocaleString()} quota cap</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono p-3 bg-slate-950 rounded-xl border border-slate-800/80 mb-4">
                  <div>
                    <div className="text-[10px] text-slate-500">FIELD AGENTS</div>
                    <div className="text-white font-bold mt-0.5">{b.activeAgentsCount} Active</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500">ACTIVATIONS</div>
                    <div className="text-emerald-400 font-bold mt-0.5">
                      {b.simsActivated.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="text-[10px] text-slate-500 font-mono">GROSS REVENUE</div>
                  <div className="font-bold text-white font-mono">
                    {b.totalRevenue.toLocaleString()} {b.currency}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-500 font-mono">MANAGER</div>
                  <div className="text-slate-300 font-semibold">{b.managerName}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Transfer SIM Inventory Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="font-bold text-white text-base mb-1">Transfer SIM Stock</h3>
            <p className="text-xs text-slate-400 mb-4">
              Re-allocate unassigned SIM blanks between regional distribution hubs.
            </p>

            {transferSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{transferSuccess}</span>
              </div>
            )}

            <form onSubmit={handleTransferSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Source Branch (From)
                </label>
                <select
                  value={sourceBranchId}
                  onChange={(e) => setSourceBranchId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.simsAllocated} in stock)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Destination Branch (To)
                </label>
                <select
                  value={targetBranchId}
                  onChange={(e) => setTargetBranchId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Quantity of SIM Cards
                </label>
                <input
                  type="number"
                  min={10}
                  max={2000}
                  value={transferCount}
                  onChange={(e) => setTransferCount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors"
                >
                  Execute Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
