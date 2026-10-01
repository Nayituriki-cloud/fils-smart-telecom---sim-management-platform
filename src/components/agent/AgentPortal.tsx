import React, { useState } from 'react';
import { useFils } from '../../context/FilsContext';
import { PaymentMethod, Product } from '../../types';
import {
  UserPlus,
  Zap,
  Layers,
  DollarSign,
  Receipt,
  FileCheck2,
  Camera,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Smartphone,
  Search,
  Filter,
  ArrowDownToLine,
  HelpCircle,
  Building2,
  ShieldAlert,
} from 'lucide-react';

export const AgentPortal: React.FC = () => {
  const {
    currentUser,
    agentSims,
    sims,
    products,
    commissions,
    transactions,
    sellProductAsAgent,
    registerSimInField,
    updateSimStatus,
    disburseCommissions,
    setSelectedReceiptTransaction,
    setActiveView,
    receivingBankAccount,
  } = useFils();

  const [activeTab, setActiveTab] = useState<'register' | 'sell' | 'inventory' | 'commissions' | 'history'>('register');

  // Customer registration state
  const [regForm, setRegForm] = useState({
    customerName: '',
    phone: '',
    email: '',
    idNumber: '',
    idType: 'National ID' as const,
    dob: '1995-04-12',
    gender: 'Female' as const,
    address: 'KN 45 St, Kiyovu',
    city: 'Kigali',
    iccid: '',
    frontDocCaptured: true,
    backDocCaptured: true,
    selfieCaptured: true,
  });
  const [regFeedback, setRegFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // Agent product sale state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(products[0] || null);
  const [sellTargetPhone, setSellTargetPhone] = useState('+250 78 ');
  const [sellCustomerName, setSellCustomerName] = useState('Walk-in Customer');
  const [sellPaymentMethod, setSellPaymentMethod] = useState<PaymentMethod>('Direct Bank Transfer');
  const [sellBankRef, setSellBankRef] = useState(`BK-POS-${Math.floor(100000 + Math.random() * 900000)}`);
  const [isSelling, setIsSelling] = useState(false);
  const [saleSuccessMessage, setSaleSuccessMessage] = useState('');

  // Cashout Modal state
  const [showCashOutModal, setShowCashOutModal] = useState(false);
  const [cashoutMethod, setCashoutMethod] = useState<'Bank Transfer' | 'Mobile Money'>('Bank Transfer');
  const [cashoutBankName, setCashoutBankName] = useState('Bank of Kigali');
  const [cashoutAccName, setCashoutAccName] = useState('Emmanuel Nayituriki');
  const [cashoutAccNumber, setCashoutAccNumber] = useState('00040-06948201-38');
  const [cashoutSuccessMsg, setCashoutSuccessMsg] = useState('');

  // Commissions
  const agentCommissions = commissions.filter(
    (c) => c.agentId === currentUser.id || currentUser.role === 'super_admin'
  );
  const pendingCommissionSum = agentCommissions
    .filter((c) => c.status === 'Approved')
    .reduce((sum, c) => sum + c.amount, 0);
  const totalPaidCommissionSum = agentCommissions
    .filter((c) => c.status === 'Disbursed')
    .reduce((sum, c) => sum + c.amount, 0);

  // Sales history for this agent
  const agentSales = transactions.filter(
    (t) => t.agentId === currentUser.id || currentUser.role === 'super_admin'
  );

  // Available SIMs for agent to register
  const availableSims = sims.filter((s) => s.status === 'Available');

  const handleRegisterCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.iccid) {
      alert('Please select or enter an available SIM ICCID serial number.');
      return;
    }

    const res = registerSimInField({
      customerName: regForm.customerName,
      phone: regForm.phone,
      email: regForm.email || `${regForm.customerName.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      idNumber: regForm.idNumber,
      idType: regForm.idType,
      dob: regForm.dob,
      gender: regForm.gender,
      address: regForm.address,
      city: regForm.city,
      iccid: regForm.iccid,
    });

    setRegFeedback(res);
    if (res.success) {
      setRegForm({
        ...regForm,
        customerName: '',
        phone: '',
        idNumber: '',
        iccid: '',
      });
    }
  };

  const handleSellProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    setIsSelling(true);

    setTimeout(() => {
      try {
        const isBank =
          sellPaymentMethod === 'Direct Bank Transfer' ||
          sellPaymentMethod === 'Instant Bank Wire (EFT)';

        const tx = sellProductAsAgent(
          selectedProduct.id,
          sellTargetPhone,
          sellCustomerName,
          sellPaymentMethod,
          isBank
            ? {
                senderBank: 'Bank of Kigali',
                senderAccountName: sellCustomerName,
                transferSlipRef: sellBankRef,
              }
            : undefined
        );
        setIsSelling(false);
        setSaleSuccessMessage(
          isBank
            ? `Direct bank payment of ${selectedProduct.price.toLocaleString()} RWF confirmed to ${receivingBankAccount.accountName}! Receipt #${tx.receiptNumber}`
            : `Sale completed for ${sellTargetPhone}! Generated receipt #${tx.receiptNumber}`
        );
        setTimeout(() => setSaleSuccessMessage(''), 3500);
      } catch (err: any) {
        setIsSelling(false);
        alert(err.message);
      }
    }, 600);
  };

  const handleOpenCashOut = () => {
    if (pendingCommissionSum === 0) {
      alert('No pending approved commissions to cash out at this moment.');
      return;
    }
    setShowCashOutModal(true);
  };

  const handleExecuteCashout = (e: React.FormEvent) => {
    e.preventDefault();
    const disbursed = disburseCommissions(currentUser.id, {
      method: cashoutMethod,
      bankName: cashoutBankName,
      accountName: cashoutAccName,
      accountNumber: cashoutAccNumber,
    });
    setCashoutSuccessMsg(
      cashoutMethod === 'Bank Transfer'
        ? `Electronic Wire of ${disbursed.toLocaleString()} RWF sent to account ${cashoutAccName} (${cashoutBankName} Acc: ${cashoutAccNumber})!`
        : `Instant MoMo cashout of ${disbursed.toLocaleString()} RWF sent to wallet (${currentUser.phone})!`
    );
    setTimeout(() => {
      setShowCashOutModal(false);
      setCashoutSuccessMsg('');
    }, 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Agent Kiosk Header */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-teal-500 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white">{currentUser.name}</h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-mono font-semibold">
                  FIELD AGENT POS
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Station: {currentUser.branchName || 'Kigali Heights Commercial Hub'} · Code: #AG-408
              </p>
              <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-2 font-mono">
                <span>SIM Stock: {availableSims.length} available</span>
                <span>·</span>
                <span>Active 4G/5G POS Terminal</span>
              </div>
            </div>
          </div>

          {/* Commission Quick Box */}
          <div className="flex items-center gap-3 p-3 bg-slate-950 rounded-2xl border border-slate-800">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
                Unpaid Commission
              </div>
              <div className="text-xl font-extrabold text-emerald-400 font-mono">
                {pendingCommissionSum.toLocaleString()} <span className="text-xs">RWF</span>
              </div>
            </div>
            <button
              onClick={handleOpenCashOut}
              className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
            >
              <ArrowDownToLine className="w-3.5 h-3.5" />
              <span>Cash Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 pb-6 border-b border-slate-800 overflow-x-auto">
        {[
          { id: 'register', label: '1. Register Customer & SIM', icon: UserPlus },
          { id: 'sell', label: '2. POS Airtime & Data Sales', icon: Zap },
          { id: 'inventory', label: '3. SIM Inventory Batch', icon: Layers },
          { id: 'commissions', label: '4. Commission Ledger', icon: DollarSign },
          { id: 'history', label: '5. Sales History & Receipts', icon: Receipt },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: REGISTER CUSTOMER & KYC (Requirement 4 & 6) */}
      {activeTab === 'register' && (
        <div className="py-6 max-w-3xl mx-auto">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-white">Instant Customer SIM Registration</h2>
                <p className="text-xs text-slate-400">
                  Follow official telecom KYC guidelines. Verify original National ID and take live photo.
                </p>
              </div>
              <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
                <FileCheck2 className="w-5 h-5" />
              </div>
            </div>

            {regFeedback && (
              <div
                className={`p-4 rounded-xl text-xs font-semibold mb-6 flex items-start gap-2.5 ${
                  regFeedback.success
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
                }`}
              >
                {regFeedback.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div>{regFeedback.message}</div>
              </div>
            )}

            <form onSubmit={handleRegisterCustomer} className="space-y-4">
              {/* Select SIM from Inventory */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Assign Available SIM (ICCID Serial) *
                </label>
                <select
                  value={regForm.iccid}
                  onChange={(e) => setRegForm({ ...regForm, iccid: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-teal-500"
                  required
                >
                  <option value="">-- Select an Available SIM Serial --</option>
                  {availableSims.map((sim) => (
                    <option key={sim.id} value={sim.iccid}>
                      {sim.iccid} · Type: {sim.networkType} · MSISDN: {sim.msisdn}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-500 mt-1 font-mono">
                  {availableSims.length} SIM cards currently ready for registration in your branch quota.
                </p>
              </div>

              {/* Customer Personal Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Customer Full Legal Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Jean-Luc Habimana"
                    value={regForm.customerName}
                    onChange={(e) => setRegForm({ ...regForm, customerName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Customer Phone Number (MSISDN) *
                  </label>
                  <input
                    type="text"
                    placeholder="+250 78 842 XXXX"
                    value={regForm.phone}
                    onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-teal-500"
                    required
                  />
                </div>
              </div>

              {/* Identification details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Identity Document Type
                  </label>
                  <select
                    value={regForm.idType}
                    onChange={(e) => setRegForm({ ...regForm, idType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="National ID">National ID Card (Rwanda)</option>
                    <option value="Passport">International Passport (EAC)</option>
                    <option value="Alien Resident Card">Alien Resident Card</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    National ID / Passport Number *
                  </label>
                  <input
                    type="text"
                    placeholder="16 digits (e.g. 1199580049210928)"
                    value={regForm.idNumber}
                    onChange={(e) => setRegForm({ ...regForm, idNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-teal-500"
                    required
                  />
                </div>
              </div>

              {/* Residence */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Residential Street Address
                  </label>
                  <input
                    type="text"
                    value={regForm.address}
                    onChange={(e) => setRegForm({ ...regForm, address: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">City / Sector</label>
                  <input
                    type="text"
                    value={regForm.city}
                    onChange={(e) => setRegForm({ ...regForm, city: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
                    required
                  />
                </div>
              </div>

              {/* Biometric & Document Capture Simulation */}
              <div className="pt-2">
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  KYC Biometric Verification Evidence
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center">
                    <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center mx-auto mb-2">
                      <Camera className="w-4 h-4" />
                    </div>
                    <div className="text-[11px] font-semibold text-white">ID Front Scan</div>
                    <div className="text-[10px] text-emerald-400 mt-1 font-mono">Captured OK</div>
                  </div>

                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center">
                    <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center mx-auto mb-2">
                      <Camera className="w-4 h-4" />
                    </div>
                    <div className="text-[11px] font-semibold text-white">ID Back Scan</div>
                    <div className="text-[10px] text-emerald-400 mt-1 font-mono">Captured OK</div>
                  </div>

                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center">
                    <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center mx-auto mb-2">
                      <Camera className="w-4 h-4" />
                    </div>
                    <div className="text-[11px] font-semibold text-white">Live Liveness</div>
                    <div className="text-[10px] text-emerald-400 mt-1 font-mono">Verified 98%</div>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg shadow-teal-500/20"
                >
                  Submit Registration & Request SIM Activation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: SELL APPROVED PRODUCTS (Requirement 4 & 7) */}
      {activeTab === 'sell' && (
        <div className="py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Products Selector */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-white">Select Product for Customer</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.map((prod) => {
                const isSelected = selectedProduct?.id === prod.id;
                return (
                  <div
                    key={prod.id}
                    onClick={() => setSelectedProduct(prod)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-teal-500/10 border-teal-500 text-white shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] text-teal-400 font-mono font-semibold uppercase">
                        {prod.category}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono">
                        +{prod.agentCommissionRate}% Comm.
                      </span>
                    </div>
                    <h3 className="font-bold text-white text-sm">{prod.name}</h3>
                    <div className="text-xs font-bold text-cyan-300 font-mono my-1">
                      {prod.quota}
                    </div>
                    <div className="text-xs text-slate-400 line-clamp-2">{prod.description}</div>
                    <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="font-bold text-white font-mono">
                        {prod.price.toLocaleString()} {prod.currency}
                      </span>
                      <span className="text-[10px] text-slate-400">{prod.validity}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* POS Checkout & Receipt Generator */}
          <div>
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl sticky top-24">
              <h3 className="text-base font-bold text-white mb-1">POS Checkout Terminal</h3>
              <p className="text-xs text-slate-400 mb-4">
                Instant delivery to customer number with instant agent commission credit.
              </p>

              {saleSuccessMessage && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{saleSuccessMessage}</span>
                </div>
              )}

              {selectedProduct ? (
                <form onSubmit={handleSellProduct} className="space-y-4">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-400">Selected Item</div>
                    <div className="font-semibold text-white text-xs">{selectedProduct.name}</div>
                    <div className="flex justify-between items-center mt-2 text-xs font-mono">
                      <span className="text-slate-400">Price:</span>
                      <span className="font-bold text-white">
                        {selectedProduct.price.toLocaleString()} {selectedProduct.currency}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-mono text-emerald-400 mt-0.5">
                      <span>Agent Commission:</span>
                      <span>
                        +{Math.round((selectedProduct.price * selectedProduct.agentCommissionRate) / 100).toLocaleString()}{' '}
                        {selectedProduct.currency}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Customer Phone Number
                    </label>
                    <input
                      type="text"
                      value={sellTargetPhone}
                      onChange={(e) => setSellTargetPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-teal-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      value={sellCustomerName}
                      onChange={(e) => setSellCustomerName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Authorized Payment Channel
                    </label>
                    <select
                      value={sellPaymentMethod}
                      onChange={(e) => setSellPaymentMethod(e.target.value as PaymentMethod)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500 font-semibold"
                    >
                      <option value="Direct Bank Transfer">
                        🏛️ Direct Bank Transfer to Account (Emmanuel Nayituriki · Bank of Kigali)
                      </option>
                      <option value="Instant Bank Wire (EFT)">
                        ⚡ Instant Bank Wire (Electronic Funds Transfer)
                      </option>
                      <option value="MTN MoMo">MTN MoMo Push</option>
                      <option value="M-Pesa">M-Pesa</option>
                      <option value="Airtel Money">Airtel Money</option>
                      <option value="Agent Cash Voucher">Agent Cash / Voucher</option>
                      <option value="Debit/Credit Card">POS Card Reader</option>
                    </select>
                  </div>

                  {(sellPaymentMethod === 'Direct Bank Transfer' ||
                    sellPaymentMethod === 'Instant Bank Wire (EFT)') && (
                    <div className="p-3 bg-slate-950 rounded-xl border border-teal-500/40 space-y-2 text-xs font-mono">
                      <div className="flex justify-between items-center text-[11px] text-teal-400 font-bold border-b border-slate-800 pb-1">
                        <span>REAL BANK ACCOUNT:</span>
                        <span>{receivingBankAccount.bankName}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Beneficiary:</span>
                        <span className="font-bold text-white">{receivingBankAccount.accountName}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Account Number:</span>
                        <span className="font-bold text-emerald-400">{receivingBankAccount.accountNumber}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Payment Contact Phone:</span>
                        <span className="font-bold text-teal-300">{receivingBankAccount.contactPhone || '0785964635'}</span>
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 font-sans mb-0.5">
                          Bank Wire Transfer Slip / UTR Code *
                        </label>
                        <input
                          type="text"
                          value={sellBankRef}
                          onChange={(e) => setSellBankRef(e.target.value)}
                          placeholder="e.g. BK-POS-98120"
                          className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-emerald-400 focus:outline-none focus:border-teal-500"
                        />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSelling}
                    className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20"
                  >
                    <Receipt className="w-4 h-4" />
                    <span>{isSelling ? 'Processing POS...' : 'Sell & Generate Official Receipt'}</span>
                  </button>
                </form>
              ) : (
                <div className="text-center py-10 text-slate-500 text-xs">
                  Select a product from the list to begin sale.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SIM INVENTORY (Requirement 3 & 4) */}
      {activeTab === 'inventory' && (
        <div className="py-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white">Agent SIM Card Inventory</h2>
              <p className="text-xs text-slate-400">
                SIM cards allocated to branch {currentUser.branchName || 'Kigali Heights'}.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg">
                Available: {availableSims.length}
              </span>
              <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg">
                Activated: {sims.filter((s) => s.status === 'Activated').length}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto bg-slate-900 border border-slate-800 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-mono">
                <tr>
                  <th className="p-3">ICCID (SIM SERIAL)</th>
                  <th className="p-3">PHONE NUMBER</th>
                  <th className="p-3">NETWORK</th>
                  <th className="p-3">STATUS</th>
                  <th className="p-3">ASSIGNED TO</th>
                  <th className="p-3 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
                {sims.map((sim) => (
                  <tr key={sim.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-semibold text-white">{sim.iccid}</td>
                    <td className="p-3 text-emerald-400 font-bold">{sim.msisdn}</td>
                    <td className="p-3">{sim.networkType}</td>
                    <td className="p-3 font-sans">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          sim.status === 'Available'
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : sim.status === 'Activated'
                            ? 'bg-cyan-500/15 text-cyan-400'
                            : sim.status === 'Registration Pending'
                            ? 'bg-amber-500/15 text-amber-400'
                            : sim.status === 'Verified'
                            ? 'bg-teal-500/15 text-teal-400'
                            : 'bg-rose-500/15 text-rose-400'
                        }`}
                      >
                        {sim.status}
                      </span>
                    </td>
                    <td className="p-3 font-sans text-slate-300">
                      {sim.customerName || 'Unassigned'}
                    </td>
                    <td className="p-3 text-right font-sans">
                      {sim.status === 'Available' && (
                        <button
                          onClick={() => {
                            setRegForm({ ...regForm, iccid: sim.iccid });
                            setActiveTab('register');
                          }}
                          className="px-2.5 py-1 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold rounded-md text-[11px] transition-colors"
                        >
                          Register
                        </button>
                      )}
                      {sim.status === 'Verified' && (
                        <button
                          onClick={() =>
                            updateSimStatus(sim.id, 'Activated', 'Agent requested final OTA activation')
                          }
                          className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-md text-[11px] transition-colors"
                        >
                          Trigger OTA
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: COMMISSION SYSTEM (Requirement 8) */}
      {activeTab === 'commissions' && (
        <div className="py-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
              <div className="text-xs text-slate-400 mb-1">Approved Ready to Cash Out</div>
              <div className="text-2xl font-bold font-mono text-emerald-400">
                {pendingCommissionSum.toLocaleString()} RWF
              </div>
              <div className="text-[10px] text-slate-500 mt-2 font-mono">
                Instant Mobile Money Settlement
              </div>
            </div>

            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
              <div className="text-xs text-slate-400 mb-1">Total Lifetime Paid</div>
              <div className="text-2xl font-bold font-mono text-white">
                {totalPaidCommissionSum.toLocaleString()} RWF
              </div>
              <div className="text-[10px] text-slate-500 mt-2 font-mono">
                Disbursed to agent wallet
              </div>
            </div>

            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
              <div className="text-xs text-slate-400 mb-1">Average Commission Rate</div>
              <div className="text-2xl font-bold font-mono text-teal-300">7.2%</div>
              <div className="text-[10px] text-slate-500 mt-2 font-mono">
                Top tier field agent bracket
              </div>
            </div>
          </div>

          <div className="overflow-x-auto bg-slate-900 border border-slate-800 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-mono">
                <tr>
                  <th className="p-3">DATE / TIME</th>
                  <th className="p-3">TRANSACTION REF</th>
                  <th className="p-3">PRODUCT</th>
                  <th className="p-3">SALE VALUE</th>
                  <th className="p-3">RATE</th>
                  <th className="p-3">EARNED COMMISSION</th>
                  <th className="p-3">PAYOUT STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
                {agentCommissions.map((com) => (
                  <tr key={com.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 text-slate-400">{com.date}</td>
                    <td className="p-3 font-semibold text-white">{com.transactionRef}</td>
                    <td className="p-3 font-sans text-slate-200">{com.productName}</td>
                    <td className="p-3">
                      {com.saleAmount.toLocaleString()} {com.currency}
                    </td>
                    <td className="p-3 text-teal-400">{com.commissionRate}%</td>
                    <td className="p-3 font-bold text-emerald-400">
                      +{com.amount.toLocaleString()} {com.currency}
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold font-sans ${
                          com.status === 'Disbursed'
                            ? 'bg-slate-800 text-slate-400'
                            : 'bg-emerald-500/15 text-emerald-400'
                        }`}
                      >
                        {com.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: SALES HISTORY */}
      {activeTab === 'history' && (
        <div className="py-6 space-y-4">
          <h2 className="text-xl font-bold text-white">Agent POS Sales Log</h2>
          <div className="overflow-x-auto bg-slate-900 border border-slate-800 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-mono">
                <tr>
                  <th className="p-3">TX REF</th>
                  <th className="p-3">TIME</th>
                  <th className="p-3">RECIPIENT</th>
                  <th className="p-3">SERVICE</th>
                  <th className="p-3">AMOUNT</th>
                  <th className="p-3">PAYMENT</th>
                  <th className="p-3 text-right">RECEIPT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
                {agentSales.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-semibold text-white">{tx.reference}</td>
                    <td className="p-3 text-slate-400">{tx.timestamp}</td>
                    <td className="p-3 font-bold text-emerald-400">{tx.msisdn}</td>
                    <td className="p-3 font-sans text-slate-200">{tx.productName || tx.type}</td>
                    <td className="p-3 font-bold text-white">
                      {tx.amount.toLocaleString()} {tx.currency}
                    </td>
                    <td className="p-3 text-slate-400">{tx.paymentMethod}</td>
                    <td className="p-3 text-right font-sans">
                      <button
                        onClick={() => setSelectedReceiptTransaction(tx)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-md text-[11px] font-semibold transition-colors"
                      >
                        Print Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Cash Out to Real Bank Account Modal */}
      {showCashOutModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-base">Withdraw Agent Commission</h3>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold">
                {pendingCommissionSum.toLocaleString()} RWF
              </span>
            </div>

            {cashoutSuccessMsg ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-2xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{cashoutSuccessMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleExecuteCashout} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Payout Destination Method
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setCashoutMethod('Bank Transfer')}
                      className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                        cashoutMethod === 'Bank Transfer'
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      🏛️ Real Bank Transfer
                    </button>
                    <button
                      type="button"
                      onClick={() => setCashoutMethod('Mobile Money')}
                      className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                        cashoutMethod === 'Mobile Money'
                          ? 'bg-teal-500/20 border-teal-500 text-teal-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      📱 Mobile Money (MoMo)
                    </button>
                  </div>
                </div>

                {cashoutMethod === 'Bank Transfer' ? (
                  <div className="p-4 bg-slate-950 rounded-2xl border border-emerald-500/30 space-y-3 font-mono text-xs">
                    <div>
                      <label className="block text-[10px] text-slate-400 font-sans mb-1">
                        Bank Name
                      </label>
                      <input
                        type="text"
                        value={cashoutBankName}
                        onChange={(e) => setCashoutBankName(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 font-sans mb-1">
                        Beneficiary Account Name
                      </label>
                      <input
                        type="text"
                        value={cashoutAccName}
                        onChange={(e) => setCashoutAccName(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 font-bold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 font-sans mb-1">
                        Bank Account Number
                      </label>
                      <input
                        type="text"
                        value={cashoutAccNumber}
                        onChange={(e) => setCashoutAccNumber(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-emerald-400 font-bold focus:outline-none focus:border-emerald-500 tracking-wider"
                        required
                      />
                    </div>
                    <div className="text-[10px] text-slate-400 font-sans pt-1">
                      Direct electronic funds transfer (EFT) processed through the national banking clearing house.
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300">
                    <div>Mobile Wallet: <span className="font-mono text-white font-bold">{currentUser.phone}</span></div>
                    <div className="text-[11px] text-slate-400 mt-1">Instant push to registered MoMo account.</div>
                  </div>
                )}

                <div className="flex justify-between items-center text-xs p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-400 font-mono">Disbursement Total:</span>
                  <span className="font-bold text-white font-mono text-base text-emerald-400">
                    {pendingCommissionSum.toLocaleString()} RWF
                  </span>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCashOutModal(false)}
                    className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ArrowDownToLine className="w-4 h-4" />
                    <span>Authorize Wire Transfer</span>
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
