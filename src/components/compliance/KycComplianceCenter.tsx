import React, { useState } from 'react';
import { useFils } from '../../context/FilsContext';
import { KycRecord, KycStatus } from '../../types';
import {
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  Camera,
  Search,
  Filter,
  ShieldCheck,
  UserCheck,
  UserX,
  History,
  Clock,
  Sparkles,
  RotateCw,
} from 'lucide-react';

export const KycComplianceCenter: React.FC = () => {
  const { kycRecords, reviewKyc, currentUser } = useFils();

  const [statusFilter, setStatusFilter] = useState<'All' | KycStatus>('All');
  const [selectedKyc, setSelectedKyc] = useState<KycRecord | null>(kycRecords[0] || null);

  // Review decision state
  const [reviewerNotes, setReviewerNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('Expired ID document');
  const [showRejectModal, setShowRejectModal] = useState(false);

  const filteredRecords = kycRecords.filter((k) =>
    statusFilter === 'All' ? true : k.status === statusFilter
  );

  const rejectionOptions = [
    'Expired ID document',
    'Blurred or unreadable document scan',
    'Facial biometric mismatch (< 80%)',
    'Suspected duplicate / fraudulent registration',
    'Document does not match national registry record',
    'Proof of address older than 90 days',
  ];

  const handleApprove = () => {
    if (!selectedKyc) return;
    reviewKyc(
      selectedKyc.id,
      'Verified',
      reviewerNotes || 'Approved per national regulatory telecommunications requirements.'
    );
    setReviewerNotes('');
  };

  const handleReject = () => {
    if (!selectedKyc) return;
    reviewKyc(selectedKyc.id, 'Rejected', reviewerNotes, rejectionReason);
    setShowRejectModal(false);
    setReviewerNotes('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            Regulatory Affairs & Identity Verification
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
            <span>FILS KYC & Compliance Center</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono font-medium">
              National Telco Standard
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Inspect customer identity documents, verify biometric liveness, guard against duplicate registrations, and sign off for OTA SIM activation.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-300">
            Pending Review:{' '}
            <span className="text-amber-400 font-bold">
              {kycRecords.filter((k) => k.status === 'Under Review' || k.status === 'Submitted').length}
            </span>
          </div>
          <div className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-300">
            Verified:{' '}
            <span className="text-emerald-400 font-bold">
              {kycRecords.filter((k) => k.status === 'Verified').length}
            </span>
          </div>
        </div>
      </div>

      {/* Main Split Layout: Queue on Left, Inspection Pane on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: KYC Records Queue (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {(['All', 'Under Review', 'Submitted', 'Verified', 'Rejected'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  statusFilter === st
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredRecords.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs bg-slate-900 border border-slate-800 rounded-2xl">
                No KYC records found under this filter.
              </div>
            ) : (
              filteredRecords.map((kyc) => {
                const isSelected = selectedKyc?.id === kyc.id;
                return (
                  <div
                    key={kyc.id}
                    onClick={() => setSelectedKyc(kyc)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-slate-800/80 border-emerald-500/60 shadow-lg shadow-emerald-500/5'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white">{kyc.customerName}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          kyc.status === 'Verified'
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : kyc.status === 'Rejected'
                            ? 'bg-rose-500/15 text-rose-400'
                            : 'bg-amber-500/15 text-amber-400'
                        }`}
                      >
                        {kyc.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 space-y-1 font-mono">
                      <div className="flex justify-between">
                        <span>{kyc.idType}:</span>
                        <span className="text-slate-200">{kyc.nationalIdNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>MSISDN:</span>
                        <span className="text-emerald-400">{kyc.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Submitted:</span>
                        <span>{kyc.submissionDate.slice(0, 16)}</span>
                      </div>
                    </div>

                    {kyc.isDuplicateFlagged && (
                      <div className="mt-2 text-[10px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-1 rounded-md flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Duplicate National ID Detected Across Carrier</span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Deep Inspection Panel (7 cols) */}
        <div className="lg:col-span-7">
          {selectedKyc ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>{selectedKyc.customerName}</span>
                    <span className="text-xs text-slate-400 font-mono">
                      (Record: {selectedKyc.id})
                    </span>
                  </h3>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {selectedKyc.nationality} · DOB: {selectedKyc.dob} · Gender: {selectedKyc.gender}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-slate-400 font-mono">COMPLIANCE SCORE</div>
                  <div
                    className={`text-2xl font-black font-mono ${
                      selectedKyc.complianceScore >= 90
                        ? 'text-emerald-400'
                        : selectedKyc.complianceScore >= 70
                        ? 'text-amber-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {selectedKyc.complianceScore}%
                  </div>
                </div>
              </div>

              {/* ID Documents & Biometric Previews */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Submitted Verification Artifacts
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Front */}
                  <div className="space-y-1">
                    <div className="text-[11px] text-slate-400">ID Document Front</div>
                    <div className="h-36 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden relative group">
                      <img
                        src={selectedKyc.documentFrontUrl}
                        alt="ID Front"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <span className="text-[10px] font-mono text-white bg-slate-900/90 px-2 py-1 rounded">
                          Scan Validated
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Back */}
                  <div className="space-y-1">
                    <div className="text-[11px] text-slate-400">ID Document Back</div>
                    <div className="h-36 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden relative group">
                      <img
                        src={selectedKyc.documentBackUrl}
                        alt="ID Back"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <span className="text-[10px] font-mono text-white bg-slate-900/90 px-2 py-1 rounded">
                          MRZ Decoded
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Selfie */}
                  <div className="space-y-1">
                    <div className="text-[11px] text-slate-400">Live Biometric Selfie</div>
                    <div className="h-36 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden relative group">
                      <img
                        src={selectedKyc.selfieUrl}
                        alt="Live Selfie"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute bottom-2 right-2 bg-emerald-500/90 text-slate-950 font-bold font-mono text-[9px] px-1.5 py-0.5 rounded">
                        Match: 96%
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Regulatory Checklist */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-white mb-2">
                  Statutory Telecom Compliance Checks
                </div>
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Document expiry within legal validity period
                    </span>
                    <span className="text-emerald-400 font-mono">PASSED</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      National Registry ID authenticity check
                    </span>
                    <span className="text-emerald-400 font-mono">PASSED</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      {selectedKyc.isDuplicateFlagged ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                      Maximum active SIM lines limit per subscriber (&le; 3)
                    </span>
                    <span
                      className={`font-mono ${
                        selectedKyc.isDuplicateFlagged ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {selectedKyc.isDuplicateFlagged ? 'FLAGGED' : 'PASSED'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Assigned SIM & Reviewer Information */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-mono space-y-1 text-slate-400">
                <div className="flex justify-between">
                  <span>Assigned SIM ICCID:</span>
                  <span className="text-white font-bold">{selectedKyc.assignedSimIccid}</span>
                </div>
                <div className="flex justify-between">
                  <span>Residential Address:</span>
                  <span className="text-slate-200">
                    {selectedKyc.residentialAddress}, {selectedKyc.city}
                  </span>
                </div>
                {selectedKyc.reviewedBy && (
                  <div className="flex justify-between pt-2 border-t border-slate-800 text-emerald-400">
                    <span>Reviewed By:</span>
                    <span>
                      {selectedKyc.reviewedBy} at {selectedKyc.reviewedAt}
                    </span>
                  </div>
                )}
                {selectedKyc.rejectionReason && (
                  <div className="flex justify-between pt-2 border-t border-slate-800 text-rose-400">
                    <span>Rejection Reason:</span>
                    <span>{selectedKyc.rejectionReason}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              {selectedKyc.status !== 'Verified' && (
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setShowRejectModal(true)}
                    className="flex-1 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject & Quarantine Registration</span>
                  </button>

                  <button
                    onClick={handleApprove}
                    className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve & Unlock Carrier Activation</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 text-sm bg-slate-900 border border-slate-800 rounded-3xl">
              Select a customer verification record from the left queue to inspect.
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-rose-400">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-bold text-white text-base">Reject KYC Record</h3>
            </div>
            <p className="text-xs text-slate-400">
              State the official statutory reason for rejecting this customer registration. The
              assigned SIM card will return to available inventory.
            </p>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Statutory Reason
              </label>
              <select
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
              >
                {rejectionOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Auditor Notes / Instructions
              </label>
              <textarea
                rows={2}
                value={reviewerNotes}
                onChange={(e) => setReviewerNotes(e.target.value)}
                placeholder="Specific guidance for the agent..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReject}
                className="flex-1 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-xs transition-colors"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
