import React from 'react';
import { useFils } from '../../context/FilsContext';
import { Printer, X, Download, ShieldCheck, CheckCircle2, Smartphone } from 'lucide-react';

export const ReceiptModal: React.FC = () => {
  const { selectedReceiptTransaction, setSelectedReceiptTransaction } = useFils();

  if (!selectedReceiptTransaction) return null;

  const tx = selectedReceiptTransaction;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative">
        {/* Modal Header */}
        <div className="p-4 bg-slate-800/80 border-b border-slate-700/60 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <ReceiptIcon className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold text-slate-100 text-sm">Official Electronic Receipt</h3>
          </div>
          <button
            onClick={() => setSelectedReceiptTransaction(null)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Paper */}
        <div className="p-6 bg-white text-slate-900 font-mono text-xs select-all">
          {/* FILS Header */}
          <div className="text-center border-b border-dashed border-slate-300 pb-4 mb-4">
            <div className="font-black text-xl tracking-widest text-slate-950">FILS TELECOM</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest">Connect. Manage. Grow.</div>
            <div className="text-[10px] text-slate-600 mt-1">National Operator License #RURA-TEL-2025/08</div>
            <div className="text-[10px] text-slate-500">TIN: 104829103 · VAT Included (18%)</div>
          </div>

          {/* Transaction Metadata */}
          <div className="space-y-1 mb-4 text-[11px] border-b border-dashed border-slate-300 pb-4">
            <div className="flex justify-between">
              <span className="text-slate-500">Receipt No:</span>
              <span className="font-bold text-slate-900">{tx.receiptNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Tx Reference:</span>
              <span className="font-semibold text-slate-800">{tx.reference}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Date & Time:</span>
              <span>{tx.timestamp}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Target MSISDN:</span>
              <span className="font-bold text-emerald-700">{tx.msisdn}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Customer Name:</span>
              <span className="text-slate-800">{tx.customerName}</span>
            </div>
            {tx.agentName && (
              <div className="flex justify-between">
                <span className="text-slate-500">Serving Agent:</span>
                <span className="text-slate-800">{tx.agentName}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-500">Payment Gateway:</span>
              <span className="font-bold text-emerald-800">{tx.paymentMethod}</span>
            </div>
            {tx.bankDetails && (
              <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-[10px] space-y-0.5 mt-2">
                <div className="font-bold text-slate-800 flex items-center justify-between border-b border-slate-200 pb-0.5 mb-1">
                  <span>REAL BANK TRANSFER SETTLEMENT:</span>
                  <span className="text-emerald-700 font-bold">VERIFIED CLEARED</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Beneficiary Account:</span>
                  <span className="font-bold text-slate-900">{tx.bankDetails.accountName}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Receiving Bank:</span>
                  <span className="font-semibold text-slate-800">{tx.bankDetails.bankName}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Account Number:</span>
                  <span className="font-mono font-bold text-slate-900">{tx.bankDetails.accountNumber}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Bank Wire UTR / Slip:</span>
                  <span className="font-mono font-bold text-emerald-700">{tx.bankDetails.transferSlipRef}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Payment Contact / SMS:</span>
                  <span className="font-mono font-bold text-slate-900">0785964635</span>
                </div>
                {tx.bankDetails.senderBank && (
                  <div className="flex justify-between text-slate-500">
                    <span>Sender Channel:</span>
                    <span>{tx.bankDetails.senderBank}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Itemized Line Items */}
          <div className="mb-4 border-b border-dashed border-slate-300 pb-4">
            <div className="flex justify-between font-bold text-slate-900 mb-2 border-b border-slate-200 pb-1">
              <span>DESCRIPTION</span>
              <span>AMOUNT</span>
            </div>
            <div className="flex justify-between py-1">
              <div>
                <div className="font-semibold text-slate-800">{tx.productName || tx.type}</div>
                <div className="text-[10px] text-slate-500">Approved Telecom Service</div>
              </div>
              <div className="font-bold text-slate-900">
                {tx.amount.toLocaleString()} {tx.currency}
              </div>
            </div>

            <div className="pt-3 mt-2 border-t border-slate-200 space-y-1">
              <div className="flex justify-between text-slate-600 text-[10px]">
                <span>Net Subtotal:</span>
                <span>{Math.round(tx.amount / 1.18).toLocaleString()} {tx.currency}</span>
              </div>
              <div className="flex justify-between text-slate-600 text-[10px]">
                <span>VAT (18%):</span>
                <span>{Math.round(tx.amount - tx.amount / 1.18).toLocaleString()} {tx.currency}</span>
              </div>
              <div className="flex justify-between font-black text-sm text-slate-950 pt-1 border-t border-slate-900">
                <span>TOTAL PAID:</span>
                <span>{tx.amount.toLocaleString()} {tx.currency}</span>
              </div>
            </div>
          </div>

          {/* Status & Barcode simulation */}
          <div className="text-center pt-1 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-md font-sans text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              STATUS: {tx.status.toUpperCase()}
            </div>

            {/* Barcode Lines */}
            <div className="flex justify-center items-center gap-0.5 h-8 my-2">
              {[4, 2, 6, 1, 5, 2, 4, 3, 7, 2, 1, 5, 3, 6, 2, 4, 1, 6, 3, 5, 2, 4, 7, 1, 3, 5, 2].map((w, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900 h-full"
                  style={{ width: `${w * 1.2}px` }}
                />
              ))}
            </div>
            <div className="text-[9px] text-slate-500 tracking-widest">{tx.reference}</div>

            <p className="text-[9px] text-slate-500 max-w-xs mx-auto pt-2">
              Thank you for choosing FILS. For customer care call 0785964635 / 100 (Toll-Free) or visit www.fils-telecom.com
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between no-print">
          <div className="text-xs text-slate-400">
            Secure digital proof of transaction
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              Print / Thermal
            </button>
            <button
              onClick={() => setSelectedReceiptTransaction(null)}
              className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-lg text-xs transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function ReceiptIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
      <path d="M16 8h-8" />
      <path d="M16 12h-8" />
      <path d="M10 16h-2" />
    </svg>
  );
}
