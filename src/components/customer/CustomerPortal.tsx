import React, { useState } from 'react';
import { useFils } from '../../context/FilsContext';
import { PaymentMethod } from '../../types';
import {
  Smartphone,
  Wifi,
  PhoneCall,
  MessageSquare,
  CreditCard,
  History,
  Shield,
  Key,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  HelpCircle,
  ChevronRight,
  Download,
  Eye,
  EyeOff,
  Zap,
  Lock,
  ArrowUpRight,
  Sparkles,
  Building2,
  Copy,
  Check,
} from 'lucide-react';

export const CustomerPortal: React.FC = () => {
  const {
    currentUser,
    customerSim,
    sims,
    kycRecords,
    products,
    transactions,
    purchaseProduct,
    toggleMfa,
    registerSimInField,
    setSelectedReceiptTransaction,
    setActiveView,
    receivingBankAccount,
  } = useFils();

  // Tab state
  const [activeTab, setActiveTab] = useState<'dashboard' | 'buy' | 'bank_account' | 'history' | 'security' | 'register_sim'>('dashboard');

  // Balances
  const [airtimeBalance, setAirtimeBalance] = useState(14500); // RWF
  const [dataBalanceGb, setDataBalanceGb] = useState(18.4); // GB of 30 GB
  const [voiceMinutes, setVoiceMinutes] = useState(340); // mins
  const [smsBalance, setSmsBalance] = useState(120); // SMS

  // PUK revealing toggle
  const [showPuk, setShowPuk] = useState(false);
  const [pukPinCode, setPukPinCode] = useState('');
  const [pukError, setPukError] = useState('');

  // Bundle purchase modal
  const [selectedProductToBuy, setSelectedProductToBuy] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Direct Bank Transfer');
  const [targetPhone, setTargetPhone] = useState(currentUser.phone);
  const [isProcessingBuy, setIsProcessingBuy] = useState(false);
  const [purchaseSuccessMsg, setPurchaseSuccessMsg] = useState('');

  // Bank transfer input state
  const [senderBankName, setSenderBankName] = useState('Bank of Kigali');
  const [senderAccountName, setSenderAccountName] = useState('Emmanuel Nayituriki');
  const [bankTransferRef, setBankTransferRef] = useState(`BK-TRF-${Math.floor(100000 + Math.random() * 900000)}`);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Self-service SIM registration form
  const [newSimForm, setNewSimForm] = useState({
    iccid: '',
    phone: '',
    idNumber: '',
    idType: 'National ID' as const,
    dob: '1998-07-19',
    gender: 'Male' as const,
    address: 'KG 120 St, Gisozi Hill',
    city: 'Kigali',
  });
  const [simRegStatus, setSimRegStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  // Customer transactions
  const customerTxs = transactions.filter(
    (t) => t.customerId === currentUser.id || t.msisdn === currentUser.phone
  );

  // Customer KYC record
  const customerKyc = kycRecords.find(
    (k) => k.customerId === currentUser.id || k.phone === currentUser.phone
  );

  const handlePurchaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductToBuy) return;
    setIsProcessingBuy(true);
    setTimeout(() => {
      try {
        const isBank =
          paymentMethod === 'Direct Bank Transfer' || paymentMethod === 'Instant Bank Wire (EFT)';

        const tx = purchaseProduct(
          selectedProductToBuy.id,
          targetPhone,
          paymentMethod,
          isBank
            ? {
                senderBank: senderBankName,
                senderAccountName: senderAccountName,
                transferSlipRef: bankTransferRef,
              }
            : undefined
        );
        setIsProcessingBuy(false);
        setPurchaseSuccessMsg(
          isBank
            ? `Bank transfer to ${receivingBankAccount.accountName} cleared! ${selectedProductToBuy.name} activated.`
            : `Successfully purchased ${selectedProductToBuy.name}!`
        );

        // Instant simulated balance top-up
        if (selectedProductToBuy.category === 'Airtime') {
          setAirtimeBalance((prev) => prev + selectedProductToBuy.price);
        } else if (selectedProductToBuy.category === 'Data Bundle') {
          setDataBalanceGb((prev) => prev + 15);
        } else if (selectedProductToBuy.category === 'Voice Package') {
          setVoiceMinutes((prev) => prev + 300);
        }

        setTimeout(() => {
          setSelectedProductToBuy(null);
          setPurchaseSuccessMsg('');
        }, 1500);
      } catch (err: any) {
        setIsProcessingBuy(false);
        alert(err.message);
      }
    }, 800);
  };

  const handleRegisterSim = (e: React.FormEvent) => {
    e.preventDefault();
    const result = registerSimInField({
      customerName: currentUser.name,
      phone: newSimForm.phone || currentUser.phone,
      email: currentUser.email,
      idNumber: newSimForm.idNumber,
      idType: newSimForm.idType,
      dob: newSimForm.dob,
      gender: newSimForm.gender,
      address: newSimForm.address,
      city: newSimForm.city,
      iccid: newSimForm.iccid,
    });
    setSimRegStatus(result);
  };

  const handleRevealPuk = (e: React.FormEvent) => {
    e.preventDefault();
    if (pukPinCode === '1234') {
      setShowPuk(true);
      setPukError('');
    } else {
      setPukError('Incorrect account PIN. Default demo PIN is: 1234');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            Subscriber Care Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
            <span>Welcome, {currentUser.name}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-medium">
              5G Active
            </span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Primary MSISDN: {currentUser.phone} · Registered Subscriber ID: #{currentUser.id}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('buy')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Recharge Airtime & Bundles</span>
          </button>
          <button
            onClick={() => setActiveTab('register_sim')}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Register New SIM</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 py-4 border-b border-slate-800/80 overflow-x-auto">
        {[
          { id: 'dashboard', label: 'My Services & Balances', icon: Smartphone },
          { id: 'buy', label: 'Buy Data & Airtime', icon: Zap },
          { id: 'bank_account', label: 'Bank Account Details', icon: Building2 },
          { id: 'history', label: 'Transaction History', icon: History },
          { id: 'security', label: 'Security & PUK PIN', icon: Shield },
          { id: 'register_sim', label: 'Register FILS SIM', icon: PlusCircle },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="py-6 space-y-6">
          {/* Active SIM Graphic & Live Balances */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Visual SIM Chip Card */}
            <div className="relative rounded-3xl p-6 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-emerald-500/30 shadow-2xl flex flex-col justify-between overflow-hidden group">
              <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-xl tracking-widest text-white font-mono">FILS</span>
                    <span className="text-[10px] text-emerald-400 font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 uppercase tracking-wider font-mono">
                      5G ULTRA
                    </span>
                  </div>
                  <Wifi className="w-5 h-5 text-emerald-400" />
                </div>

                {/* Golden SIM Chip Graphic */}
                <div className="w-12 h-9 rounded-md bg-gradient-to-tr from-amber-400 via-amber-300 to-amber-500 p-0.5 mb-6 shadow-inner">
                  <div className="w-full h-full border border-amber-600/40 rounded-[4px] grid grid-cols-2 gap-0.5 p-1 opacity-90">
                    <div className="border-r border-amber-700/30" />
                    <div />
                  </div>
                </div>

                <div className="space-y-1 mb-4">
                  <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
                    SIM Serial (ICCID)
                  </div>
                  <div className="text-sm sm:text-base font-bold font-mono text-white tracking-widest">
                    {customerSim ? customerSim.iccid : '89250 01100 24891 0021'}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-end justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 font-mono">SUBSCRIBER</div>
                  <div className="text-xs font-semibold text-slate-200">{currentUser.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 font-mono">PHONE NUMBER</div>
                  <div className="text-xs font-bold text-emerald-400 font-mono">
                    {customerSim ? customerSim.msisdn : currentUser.phone}
                  </div>
                </div>
              </div>
            </div>

            {/* Balances Grid */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Airtime */}
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400">Main Airtime Balance</span>
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Zap className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                    {airtimeBalance.toLocaleString()} <span className="text-sm text-slate-400">RWF</span>
                  </div>
                  <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Active line · Unlimited validity</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('buy')}
                  className="mt-4 w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors text-center"
                >
                  Top Up Airtime &rarr;
                </button>
              </div>

              {/* High-Speed Data */}
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400">5G High-Speed Data</span>
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                    <Wifi className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-cyan-300 font-mono">
                    {dataBalanceGb} <span className="text-sm text-slate-400">GB</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full"
                      style={{ width: `${(dataBalanceGb / 30) * 100}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1.5 flex justify-between font-mono">
                    <span>Remaining of 30 GB</span>
                    <span>Valid: 24 days left</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('buy')}
                  className="mt-4 w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors text-center"
                >
                  Buy Data Bundle &rarr;
                </button>
              </div>

              {/* Voice Minutes */}
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400">All-Network Voice</span>
                  <div className="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-teal-300 font-mono">
                    {voiceMinutes} <span className="text-sm text-slate-400">Mins</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Crystal-clear VoLTE to any telecom operator
                  </div>
                </div>
                <div className="text-[11px] text-slate-500 font-mono mt-4">
                  Expires in 28 days
                </div>
              </div>

              {/* SMS Quota */}
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400">National SMS Quota</span>
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-mono">
                    {smsBalance} <span className="text-sm text-slate-400">SMS</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">Free delivery reports included</div>
                </div>
                <div className="text-[11px] text-slate-500 font-mono mt-4">
                  Expires in 28 days
                </div>
              </div>
            </div>
          </div>

          {/* KYC Status & SIM Verification Timeline */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
              <div>
                <h3 className="font-bold text-white text-base">Identity & Regulatory KYC Status</h3>
                <p className="text-xs text-slate-400">
                  Required telecommunications regulatory verification for MSISDN {currentUser.phone}
                </p>
              </div>
              <span className="self-start sm:self-auto px-3 py-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-xs rounded-full font-semibold">
                KYC STATUS: {customerKyc ? customerKyc.status.toUpperCase() : 'VERIFIED'}
              </span>
            </div>

            {/* Stepper */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xs shrink-0">
                  ✓
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">1. Registration</div>
                  <div className="text-[11px] text-slate-400">SIM paired with ID</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xs shrink-0">
                  ✓
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">2. Document Upload</div>
                  <div className="text-[11px] text-slate-400">National ID & Biometrics</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xs shrink-0">
                  ✓
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">3. Compliance Review</div>
                  <div className="text-[11px] text-slate-400">Score: 98% (Passed)</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xs shrink-0">
                  ✓
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">4. 5G Activated</div>
                  <div className="text-[11px] text-slate-400">Core Network Live</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BUY DATA & AIRTIME */}
      {activeTab === 'buy' && (
        <div className="py-6 space-y-6">
          <div className="max-w-2xl">
            <h2 className="text-xl font-bold text-white mb-1">Recharge Airtime & Data Bundles</h2>
            <p className="text-xs text-slate-400">
              Select an approved tariff bundle to replenish your balance instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="p-5 bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-semibold text-emerald-400 uppercase">
                      {prod.category}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">{prod.validity}</span>
                  </div>
                  <h3 className="font-bold text-white text-base mb-1">{prod.name}</h3>
                  <div className="text-xs font-bold text-cyan-300 font-mono mb-2">{prod.quota}</div>
                  <p className="text-xs text-slate-400 mb-4">{prod.description}</p>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold font-mono text-white">
                      {prod.price.toLocaleString()}
                    </span>{' '}
                    <span className="text-xs text-slate-400">{prod.currency}</span>
                  </div>
                  <button
                    onClick={() => setSelectedProductToBuy(prod)}
                    className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors"
                  >
                    Select & Pay
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Modal */}
          {selectedProductToBuy && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
                <h3 className="text-lg font-bold text-white mb-1">Confirm Purchase</h3>
                <p className="text-xs text-slate-400 mb-4">
                  Recharging <span className="text-white font-semibold">{selectedProductToBuy.name}</span>
                </p>

                {purchaseSuccessMsg ? (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl text-center font-medium text-xs flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{purchaseSuccessMsg}</span>
                  </div>
                ) : (
                  <form onSubmit={handlePurchaseSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Recipient Phone Number (MSISDN)
                      </label>
                      <input
                        type="text"
                        value={targetPhone}
                        onChange={(e) => setTargetPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Select Payment Method
                      </label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 font-semibold"
                      >
                        <option value="Direct Bank Transfer">
                          🏛️ Direct Bank Transfer to Account (Emmanuel Nayituriki · Bank of Kigali)
                        </option>
                        <option value="Instant Bank Wire (EFT)">
                          ⚡ Instant Bank Wire (Electronic Funds Transfer)
                        </option>
                        <option value="MTN MoMo">MTN MoMo (Mobile Money)</option>
                        <option value="Airtel Money">Airtel Money</option>
                        <option value="M-Pesa">M-Pesa</option>
                        <option value="Debit/Credit Card">Bank Card (Visa / Mastercard)</option>
                      </select>
                    </div>

                    {/* Direct Real Bank Account Transfer Card */}
                    {(paymentMethod === 'Direct Bank Transfer' ||
                      paymentMethod === 'Instant Bank Wire (EFT)') && (
                      <div className="p-4 bg-slate-950 border border-emerald-500/40 rounded-xl space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-emerald-400" />
                            <span className="text-xs font-bold text-white">Receiving Bank Account</span>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold">
                            REAL BANK TRANSFER
                          </span>
                        </div>

                        {/* Account Details Box */}
                        <div className="space-y-2 text-xs font-mono">
                          <div className="flex justify-between items-center bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                            <div>
                              <div className="text-[10px] text-slate-400">BENEFICIARY ACCOUNT NAME</div>
                              <div className="font-bold text-white text-xs">
                                {receivingBankAccount.accountName}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleCopy(receivingBankAccount.accountName, 'accName')}
                              className="p-1 hover:text-emerald-400 text-slate-400 transition-colors"
                              title="Copy Account Name"
                            >
                              {copiedField === 'accName' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>

                          <div className="flex justify-between items-center bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                            <div>
                              <div className="text-[10px] text-slate-400">RECEIVING BANK</div>
                              <div className="font-bold text-emerald-400 text-xs">
                                {receivingBankAccount.bankName}
                              </div>
                            </div>
                            <span className="text-[10px] text-slate-400">{receivingBankAccount.branch}</span>
                          </div>

                          <div className="flex justify-between items-center bg-slate-900/90 p-2 rounded-lg border border-emerald-500/30">
                            <div>
                              <div className="text-[10px] text-slate-400">ACCOUNT NUMBER</div>
                              <div className="font-extrabold text-white text-sm tracking-wider">
                                {receivingBankAccount.accountNumber}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleCopy(receivingBankAccount.accountNumber, 'accNum')}
                              className="px-2 py-1 bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 rounded text-[10px] font-semibold flex items-center gap-1 transition-colors"
                            >
                              {copiedField === 'accNum' ? (
                                <>
                                  <Check className="w-3 h-3" />
                                  <span>Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>

                          <div className="flex justify-between items-center bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                            <div>
                              <div className="text-[10px] text-slate-400">TRANSFER CONFIRMATION CONTACT (PHONE / MOMO)</div>
                              <div className="font-bold text-emerald-400 text-xs tracking-wider">
                                {receivingBankAccount.contactPhone || '0785964635'}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleCopy(receivingBankAccount.contactPhone || '0785964635', 'contactPhone')}
                              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-semibold flex items-center gap-1 transition-colors"
                            >
                              {copiedField === 'contactPhone' ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span className="text-emerald-400">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>

                          <div className="flex justify-between items-center text-[11px] text-slate-400 px-1">
                            <span>SWIFT / BIC: <span className="text-white font-bold">{receivingBankAccount.swiftCode}</span></span>
                            <span>Currency: <span className="text-white font-bold">{receivingBankAccount.currency}</span></span>
                          </div>
                        </div>

                        {/* Customer Transfer Verification Inputs */}
                        <div className="pt-2 border-t border-slate-800/80 space-y-2 font-sans">
                          <div className="text-[11px] font-semibold text-slate-300">
                            Sender Confirmation Details
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] text-slate-400 mb-0.5">
                                Your Bank (Sending Bank)
                              </label>
                              <input
                                type="text"
                                value={senderBankName}
                                onChange={(e) => setSenderBankName(e.target.value)}
                                placeholder="e.g. Bank of Kigali / Equity"
                                className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-slate-400 mb-0.5">
                                Sender Account Name
                              </label>
                              <input
                                type="text"
                                value={senderAccountName}
                                onChange={(e) => setSenderAccountName(e.target.value)}
                                placeholder="Your Account Name"
                                className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] text-slate-400 mb-0.5">
                              Bank Transaction Reference / UTR Number *
                            </label>
                            <input
                              type="text"
                              value={bankTransferRef}
                              onChange={(e) => setBankTransferRef(e.target.value)}
                              placeholder="e.g. BK-TRF-984120"
                              className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
                              required
                            />
                            <div className="text-[10px] text-slate-500 mt-1 flex items-center justify-between font-mono">
                              <span>Transfer slip verified by carrier switch</span>
                              <span className="text-emerald-400 font-semibold">Immediate Credit</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                      <span className="text-slate-400">Total Due:</span>
                      <span className="font-bold text-white font-mono text-base">
                        {selectedProductToBuy.price.toLocaleString()} {selectedProductToBuy.currency}
                      </span>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setSelectedProductToBuy(null)}
                        className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isProcessingBuy}
                        className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        {isProcessingBuy ? 'Processing Payment...' : 'Authorize Payment'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB: BANK ACCOUNT DETAILS */}
      {activeTab === 'bank_account' && (
        <div className="py-6 max-w-3xl mx-auto space-y-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Direct Bank Payment Account</h2>
                  <p className="text-xs text-slate-400">
                    Official receiving bank details for real electronic funds transfers (EFT)
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-mono font-bold self-start sm:self-auto">
                CLEARED FOR DIRECT WIRE
              </span>
            </div>

            {/* Bank Card Graphic */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-emerald-500/30 space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                  REAL BANK SETTLEMENT ACCOUNT
                </div>
                <div className="text-xs font-mono text-slate-400">INSTANT RECONCILIATION</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono pt-2">
                <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase">Beneficiary Account Name</div>
                  <div className="font-bold text-white text-sm mt-0.5">
                    {receivingBankAccount.accountName}
                  </div>
                </div>

                <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase">Receiving Bank</div>
                  <div className="font-bold text-emerald-400 text-sm mt-0.5">
                    {receivingBankAccount.bankName}
                  </div>
                </div>

                <div className="p-3 bg-slate-900/90 rounded-xl border border-emerald-500/40">
                  <div className="text-[10px] text-slate-500 uppercase">Account Number</div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="font-black text-white text-base tracking-wider">
                      {receivingBankAccount.accountNumber}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(receivingBankAccount.accountNumber, 'accTab')}
                      className="px-2 py-1 bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 text-[10px] font-bold rounded flex items-center gap-1 transition-colors"
                    >
                      {copiedField === 'accTab' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedField === 'accTab' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase">SWIFT / BIC Code</div>
                  <div className="font-bold text-white text-sm mt-0.5">
                    {receivingBankAccount.swiftCode}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Branch: <span className="font-semibold text-white">{receivingBankAccount.branch}</span> · Currency: <span className="font-semibold text-white">{receivingBankAccount.currency}</span> · Routing: <span className="font-mono text-emerald-400">{receivingBankAccount.routingNumber}</span>
                </span>
              </div>
            </div>

            {/* Transfer Instructions */}
            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-white text-sm">How to Make Direct Bank Payment Transfer:</h4>
              <ol className="list-decimal list-inside space-y-2 text-slate-300 leading-relaxed">
                <li>Log in to your banking app or internet banking (Bank of Kigali, Equity Bank, Standard Bank, etc.) or visit any bank branch.</li>
                <li>Initiate an Instant Transfer / Wire to <strong className="text-white">Emmanuel Nayituriki</strong> at <strong className="text-emerald-400">Bank of Kigali</strong>, Account <strong className="text-white font-mono">00040-06948201-38</strong>.</li>
                <li>Enter your phone number (<strong className="text-emerald-400 font-mono">{currentUser.phone}</strong>) in the payment reference or transfer description.</li>
                <li>Your airtime, data bundle, or bill will be automatically cleared and credited instantly!</li>
              </ol>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setActiveTab('buy')}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <Zap className="w-4 h-4" />
                <span>Buy Data & Airtime with Bank Transfer Now</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TRANSACTION HISTORY */}
      {activeTab === 'history' && (
        <div className="py-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Transaction & Billing History</h2>
              <p className="text-xs text-slate-400">
                All electronic recharges, bundles, and SIM activations under your account.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto bg-slate-900 border border-slate-800 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-mono">
                <tr>
                  <th className="p-3">REFERENCE</th>
                  <th className="p-3">DATE / TIME</th>
                  <th className="p-3">DESCRIPTION</th>
                  <th className="p-3">AMOUNT</th>
                  <th className="p-3">PAYMENT</th>
                  <th className="p-3">STATUS</th>
                  <th className="p-3 text-right">RECEIPT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
                {customerTxs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      No transactions recorded yet.
                    </td>
                  </tr>
                ) : (
                  customerTxs.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 font-semibold text-white">{tx.reference}</td>
                      <td className="p-3 text-slate-400">{tx.timestamp}</td>
                      <td className="p-3 font-sans text-slate-200">
                        {tx.productName || tx.type}
                      </td>
                      <td className="p-3 font-bold text-white">
                        {tx.amount.toLocaleString()} {tx.currency}
                      </td>
                      <td className="p-3 text-slate-400">{tx.paymentMethod}</td>
                      <td className="p-3">
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                          <CheckCircle2 className="w-3 h-3" />
                          {tx.status}
                        </span>
                      </td>
                      <td className="p-3 text-right font-sans">
                        <button
                          onClick={() => setSelectedReceiptTransaction(tx)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-md text-[11px] font-semibold transition-colors"
                        >
                          View Receipt
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: SECURITY & PUK PIN */}
      {activeTab === 'security' && (
        <div className="py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* SIM Lock & PUK Unlock Assistance */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
            <div className="flex items-center gap-2 mb-2">
              <Key className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-white text-base">PUK Code Recovery</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              If your phone asks for a PUK code after entering 3 wrong SIM PINs, enter your account
              PIN below to reveal your primary carrier PUK1 and PUK2 codes.
            </p>

            {showPuk ? (
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-3 font-mono">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-amber-300">PUK 1 Code:</span>
                  <span className="text-lg font-bold text-white tracking-widest">
                    {customerSim ? customerSim.puk1 : '98412033'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-amber-300">PUK 2 Code:</span>
                  <span className="text-lg font-bold text-white tracking-widest">
                    {customerSim ? customerSim.puk2 : '44109822'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-amber-300">Default PIN 1:</span>
                  <span className="font-semibold text-white">1234</span>
                </div>
                <div className="text-[10px] text-slate-400 pt-2 border-t border-amber-500/20">
                  After entering PUK1, your handset will prompt you to set a new 4-digit PIN.
                </div>
              </div>
            ) : (
              <form onSubmit={handleRevealPuk} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Enter Account PIN to Reveal PUK (Demo PIN: 1234)
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={pukPinCode}
                    onChange={(e) => setPukPinCode(e.target.value)}
                    placeholder="••••"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-center font-mono tracking-widest text-white focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>
                {pukError && <div className="text-xs text-rose-400">{pukError}</div>}
                <button
                  type="submit"
                  className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-colors"
                >
                  Reveal PUK Codes
                </button>
              </form>
            )}
          </div>

          {/* Account MFA Security Settings */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-base">Account Security & MFA</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                Protect your telecommunications account from unauthorized SIM swap attempts.
                Two-Factor Authentication sends a one-time OTP to your verified MSISDN before any
                profile edits or eSIM downloads.
              </p>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-white">Multi-Factor Auth (SMS OTP)</div>
                    <div className="text-[11px] text-slate-400">OTP required on logins</div>
                  </div>
                  <button
                    onClick={() => toggleMfa()}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                      currentUser.mfaEnabled
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {currentUser.mfaEnabled ? 'ENABLED' : 'DISABLED'}
                  </button>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                  <span className="text-slate-400">SIM Swap Guard</span>
                  <span className="text-emerald-400 font-medium">PROTECTED</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => setActiveView('support')}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <HelpCircle className="w-4 h-4 text-emerald-400" />
                <span>Contact 24/7 Subscriber Support</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: REGISTER A FILS SIM */}
      {activeTab === 'register_sim' && (
        <div className="py-6 max-w-2xl mx-auto">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
            <h2 className="text-xl font-bold text-white mb-1">Register an Available FILS SIM</h2>
            <p className="text-xs text-slate-400 mb-6">
              Pair an unactivated SIM card starter pack purchased from an agent kiosk with your
              verified national identity.
            </p>

            {simRegStatus && (
              <div
                className={`p-4 rounded-xl text-xs font-medium mb-6 ${
                  simRegStatus.success
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
                }`}
              >
                {simRegStatus.message}
              </div>
            )}

            <form onSubmit={handleRegisterSim} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  SIM Serial (ICCID Barcode - 19 digits)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 89250 01100 24891 0024"
                  value={newSimForm.iccid}
                  onChange={(e) => setNewSimForm({ ...newSimForm, iccid: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                  required
                />
                <p className="text-[10px] text-slate-500 mt-1 font-mono">
                  Available demo serials: 89250 01100 24891 0024 or 89250 01100 24891 0025
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Requested MSISDN / Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+250 78 955 8824"
                    value={newSimForm.phone}
                    onChange={(e) => setNewSimForm({ ...newSimForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    ID Document Type
                  </label>
                  <select
                    value={newSimForm.idType}
                    onChange={(e) =>
                      setNewSimForm({
                        ...newSimForm,
                        idType: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="National ID">National ID Card</option>
                    <option value="Passport">Passport</option>
                    <option value="Alien Resident Card">Alien Resident Card</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  National ID / Passport Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. 11998800293411"
                  value={newSimForm.idNumber}
                  onChange={(e) => setNewSimForm({ ...newSimForm, idNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Residential Address
                  </label>
                  <input
                    type="text"
                    value={newSimForm.address}
                    onChange={(e) => setNewSimForm({ ...newSimForm, address: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">City / District</label>
                  <input
                    type="text"
                    value={newSimForm.city}
                    onChange={(e) => setNewSimForm({ ...newSimForm, city: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-lg shadow-emerald-500/20"
                >
                  Submit SIM Registration for Compliance Clearance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
