import React, { useState } from 'react';
import { useFils } from '../../context/FilsContext';
import { SIM, SimStatus } from '../../types';
import {
  Layers,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  History,
  ShieldAlert,
  ArrowRight,
  X,
  Lock,
  Radio,
  FileSpreadsheet,
  Cpu,
} from 'lucide-react';

export const SimManagement: React.FC = () => {
  const { sims, branches, updateSimStatus, currentUser } = useFils();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [branchFilter, setBranchFilter] = useState<string>('All');
  const [selectedSim, setSelectedSim] = useState<SIM | null>(null);

  // Status transition modal
  const [statusModalSim, setStatusModalSim] = useState<SIM | null>(null);
  const [newStatus, setNewStatus] = useState<SimStatus>('Activated');
  const [statusReason, setStatusReason] = useState('');

  const statusOptions: SimStatus[] = [
    'Available',
    'Assigned',
    'Registration Pending',
    'Verified',
    'Activated',
    'Suspended',
    'Deactivated',
  ];

  const filteredSims = sims.filter((sim) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      sim.iccid.toLowerCase().includes(term) ||
      sim.msisdn.toLowerCase().includes(term) ||
      (sim.customerName && sim.customerName.toLowerCase().includes(term)) ||
      (sim.agentName && sim.agentName.toLowerCase().includes(term));

    const matchesStatus = statusFilter === 'All' || sim.status === statusFilter;
    const matchesBranch = branchFilter === 'All' || sim.branchId === branchFilter;

    return matchesSearch && matchesStatus && matchesBranch;
  });

  const canChangeStatus =
    currentUser.role === 'super_admin' ||
    currentUser.role === 'operations_manager' ||
    currentUser.role === 'compliance_officer';

  const handleStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusModalSim) return;
    if (!statusReason.trim()) {
      alert('A compliance justification reason is strictly required to change SIM status.');
      return;
    }

    updateSimStatus(statusModalSim.id, newStatus, statusReason);
    setStatusModalSim(null);
    setStatusReason('');
  };

  const exportSimCsv = () => {
    const headers = 'ICCID,MSISDN,IMSI,Network,Status,Customer,Agent,Branch,Registered,Activated\n';
    const rows = filteredSims
      .map(
        (s) =>
          `"${s.iccid}","${s.msisdn}","${s.imsi}","${s.networkType}","${s.status}","${s.customerName || ''}","${s.agentName || ''}","${s.branchName}","${s.registrationDate || ''}","${s.activationDate || ''}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FILS-SIM-Inventory-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            Carrier Core & HSS Inventory
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
            <span>FILS SIM Lifecycle Management</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono font-medium">
              {sims.length} Total Units
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Trace, authorize, and audit every stage from factory blank SIM to live carrier OTA activation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportSimCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV Batch</span>
          </button>
        </div>
      </div>

      {/* Lifecycle Flow Graphic */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto">
        <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2">
          Carrier State Transition Pipeline
        </div>
        <div className="flex items-center gap-2 min-w-[700px]">
          {statusOptions.map((st, idx) => (
            <React.Fragment key={st}>
              <div className="flex-1 p-2 rounded-xl bg-slate-950 border border-slate-800/80 text-center">
                <div className="text-[10px] text-slate-500 font-mono font-bold">{idx + 1}</div>
                <div className="text-xs font-semibold text-slate-200 mt-0.5">{st}</div>
              </div>
              {idx < statusOptions.length - 1 && (
                <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search ICCID serial, MSISDN, IMSI, or assigned customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex gap-2">
          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="All">All Statuses ({sims.length})</option>
            {statusOptions.map((st) => (
              <option key={st} value={st}>
                {st} ({sims.filter((s) => s.status === st).length})
              </option>
            ))}
          </select>

          {/* Branch Dropdown */}
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="All">All Branches</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* SIM Table */}
      <div className="overflow-x-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 font-mono">
            <tr>
              <th className="p-3.5">SIM SERIAL (ICCID)</th>
              <th className="p-3.5">PHONE NUMBER (MSISDN)</th>
              <th className="p-3.5">TECHNOLOGY</th>
              <th className="p-3.5">LIFECYCLE STATUS</th>
              <th className="p-3.5">CUSTOMER / AGENT</th>
              <th className="p-3.5">BRANCH</th>
              <th className="p-3.5 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 font-mono text-slate-300">
            {filteredSims.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-500">
                  No SIM cards match the selected query.
                </td>
              </tr>
            ) : (
              filteredSims.map((sim) => (
                <tr key={sim.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5">
                    <div className="font-bold text-white">{sim.iccid}</div>
                    <div className="text-[10px] text-slate-500">IMSI: {sim.imsi}</div>
                  </td>
                  <td className="p-3.5 font-bold text-emerald-400">{sim.msisdn}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-[11px] text-slate-300">
                      {sim.networkType}
                    </span>
                  </td>
                  <td className="p-3.5 font-sans">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        sim.status === 'Activated'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : sim.status === 'Available'
                          ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                          : sim.status === 'Registration Pending'
                          ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          : sim.status === 'Verified'
                          ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
                          : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {sim.status}
                    </span>
                  </td>
                  <td className="p-3.5 font-sans">
                    <div className="text-white font-medium">
                      {sim.customerName || (
                        <span className="text-slate-500 italic">Not Assigned</span>
                      )}
                    </div>
                    {sim.agentName && (
                      <div className="text-[10px] text-slate-400">Agent: {sim.agentName}</div>
                    )}
                  </td>
                  <td className="p-3.5 font-sans text-slate-400">{sim.branchName}</td>
                  <td className="p-3.5 text-right font-sans space-x-1.5">
                    <button
                      onClick={() => setSelectedSim(sim)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors"
                    >
                      Details & Audit
                    </button>
                    {canChangeStatus && (
                      <button
                        onClick={() => {
                          setStatusModalSim(sim);
                          setNewStatus(sim.status);
                        }}
                        className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 rounded-lg text-xs font-semibold transition-colors"
                      >
                        Change Status
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* SIM Detail & Audit Trail Modal */}
      {selectedSim && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-base">
                  SIM Profile: {selectedSim.iccid}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSim(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Technical Chip Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-500">MSISDN</div>
                  <div className="font-bold text-emerald-400 mt-1">{selectedSim.msisdn}</div>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-500">NETWORK</div>
                  <div className="font-bold text-white mt-1">{selectedSim.networkType}</div>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-500">PIN 1 / PIN 2</div>
                  <div className="font-bold text-white mt-1">
                    {selectedSim.pin1} / {selectedSim.pin2}
                  </div>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-500">PUK 1 / PUK 2</div>
                  <div className="font-bold text-amber-400 mt-1">
                    {selectedSim.puk1} / {selectedSim.puk2}
                  </div>
                </div>
              </div>

              {/* Assignment Information */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Assigned Subscriber:</span>
                  <span className="font-bold text-white">
                    {selectedSim.customerName || 'None'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Issuing Agent:</span>
                  <span className="text-slate-300">{selectedSim.agentName || 'None'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Branch Location:</span>
                  <span className="text-slate-300">{selectedSim.branchName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Registration Date:</span>
                  <span className="font-mono text-slate-300">
                    {selectedSim.registrationDate || 'Pending'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">OTA Activation Date:</span>
                  <span className="font-mono text-emerald-400">
                    {selectedSim.activationDate || 'Pending'}
                  </span>
                </div>
              </div>

              {/* Chronological Audit Trail */}
              <div>
                <div className="flex items-center gap-2 font-bold text-white text-xs uppercase tracking-wider mb-3">
                  <History className="w-4 h-4 text-emerald-400" />
                  <span>Immutable Carrier State Audit History</span>
                </div>

                <div className="space-y-2 font-mono text-xs">
                  {selectedSim.auditTrail.length === 0 ? (
                    <div className="text-slate-500 text-xs py-2">
                      No status transitions recorded yet for this factory blank.
                    </div>
                  ) : (
                    selectedSim.auditTrail.map((entry) => (
                      <div
                        key={entry.id}
                        className="p-3 bg-slate-950 rounded-xl border border-slate-800/80"
                      >
                        <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1">
                          <span className="text-emerald-400">{entry.action}</span>
                          <span>{entry.timestamp}</span>
                        </div>
                        <div className="text-slate-300 font-sans text-xs">{entry.note}</div>
                        <div className="text-[10px] text-slate-500 mt-1">
                          Auth: {entry.performedBy} ({entry.role})
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
              <button
                onClick={() => setSelectedSim(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sensitive Status Transition Modal */}
      {statusModalSim && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-white text-base">Authorized Status Transition</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Transitioning SIM <span className="text-white font-mono">{statusModalSim.iccid}</span>{' '}
              ({statusModalSim.msisdn}). This will write to carrier audit logs.
            </p>

            <form onSubmit={handleStatusSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  New Lifecycle State
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as SimStatus)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {statusOptions.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Compliance & Regulatory Justification *
                </label>
                <textarea
                  rows={3}
                  value={statusReason}
                  onChange={(e) => setStatusReason(e.target.value)}
                  placeholder="e.g. Validated customer documents; authorized OTA activation or suspicious activity quarantine..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStatusModalSim(null)}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors"
                >
                  Execute Transition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
