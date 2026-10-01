import React, { useState } from 'react';
import { useFils } from '../../context/FilsContext';
import { SupportTicket } from '../../types';
import {
  HelpCircle,
  MessageSquare,
  PhoneCall,
  PlusCircle,
  Search,
  CheckCircle2,
  Clock,
  Send,
  AlertCircle,
  Headphones,
  LifeBuoy,
  FileQuestion,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const SupportCenter: React.FC = () => {
  const { tickets, createSupportTicket, replyToTicket, updateTicketStatus, currentUser } = useFils();

  const [activeTab, setActiveTab] = useState<'tickets' | 'faq' | 'contacts'>('tickets');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(tickets[0] || null);
  const [replyMessage, setReplyMessage] = useState('');
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);

  // New ticket form
  const [newTicketSubject, setNewTicketSubject] = useState('');
  const [newTicketCategory, setNewTicketCategory] = useState<any>('SIM Activation');
  const [newTicketPriority, setNewTicketPriority] = useState<any>('Medium');
  const [newTicketBody, setNewTicketBody] = useState('');

  // FAQ state
  const [faqSearch, setFaqSearch] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How do I unblock a SIM card that asks for a PUK code?',
      a: 'If you entered the wrong SIM PIN 3 times, your phone will request a PUK (PIN Unlock Key). You can instantly retrieve your PUK1 and PUK2 codes in the Customer Portal under "Security & PUK PIN" using your 4-digit account security PIN, or by calling our toll-free customer care line at 100.',
    },
    {
      q: 'How long does KYC identity approval take after agent registration?',
      a: 'Under normal network operations, automated document scanning and facial liveness verification take less than 3 minutes. If manual compliance review is required by a regulatory officer, approval is completed within 30 minutes during standard business hours.',
    },
    {
      q: 'Can I convert my physical FILS SIM into an eSIM profile?',
      a: 'Yes! FILS supports eSIM for compatible iPhone, Samsung, and Pixel devices. You can request an eSIM QR profile through an authorized agent kiosk or self-service customer portal with biometric verification.',
    },
    {
      q: 'What is the maximum number of SIM cards a single customer can register?',
      a: 'In compliance with National Telecommunications and Cyber Security Regulations, an individual subscriber can register a maximum of three (3) active voice/data SIM lines across the network under one verified National ID.',
    },
    {
      q: 'How do agents withdraw their earned sales commissions?',
      a: 'Field agents can request instantaneous Mobile Money settlement from the Agent Portal at any time. Payouts are credited directly to their registered MTN MoMo or Airtel Money wallet within seconds with zero disbursement fee.',
    },
  ];

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
      f.a.toLowerCase().includes(faqSearch.toLowerCase())
  );

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketSubject.trim() || !newTicketBody.trim()) return;

    const tkt = createSupportTicket(
      newTicketSubject,
      newTicketCategory,
      newTicketPriority,
      newTicketBody
    );
    setSelectedTicket(tkt);
    setShowNewTicketModal(false);
    setNewTicketSubject('');
    setNewTicketBody('');
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyMessage.trim()) return;

    replyToTicket(selectedTicket.id, replyMessage);
    setReplyMessage('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            24/7 Subscriber & Field Agent Helpdesk
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
            <span>Customer Care & Support Center</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-mono font-medium">
              SLA &lt; 15 mins
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track customer complaints, verify PUK lock requests, report network faults, and browse telecom regulatory knowledge base.
          </p>
        </div>

        <button
          onClick={() => setShowNewTicketModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-md shadow-emerald-500/20"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Open Support Ticket</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 pb-4 border-b border-slate-800/80 overflow-x-auto">
        {[
          { id: 'tickets', label: '1. Support Inquiries & Tickets', icon: MessageSquare },
          { id: 'faq', label: '2. Telecom FAQs & Guides', icon: FileQuestion },
          { id: 'contacts', label: '3. Emergency & Carrier Hotlines', icon: PhoneCall },
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

      {/* TAB 1: TICKETS SPLIT VIEW */}
      {activeTab === 'tickets' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Ticket List (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="text-xs font-semibold text-slate-400 font-mono mb-2">
              ACTIVE TICKETS ({tickets.length})
            </div>

            {tickets.map((tkt) => {
              const isSelected = selectedTicket?.id === tkt.id;
              return (
                <div
                  key={tkt.id}
                  onClick={() => setSelectedTicket(tkt)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-800/80 border-emerald-500/60 shadow-lg shadow-emerald-500/5'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-mono font-bold text-emerald-400">
                      {tkt.referenceNumber}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold font-mono ${
                        tkt.status === 'Resolved'
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : tkt.status === 'In Progress'
                          ? 'bg-cyan-500/15 text-cyan-400'
                          : 'bg-amber-500/15 text-amber-400'
                      }`}
                    >
                      {tkt.status}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white mb-1 line-clamp-1">{tkt.subject}</h4>
                  <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between">
                    <span>{tkt.customerName}</span>
                    <span>{tkt.category}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Ticket Conversation View (7 cols) */}
          <div className="lg:col-span-7">
            {selectedTicket ? (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col h-[580px]">
                {/* Header */}
                <div className="pb-4 border-b border-slate-800 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        {selectedTicket.referenceNumber}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {selectedTicket.priority} Priority
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white mt-1">{selectedTicket.subject}</h3>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      Customer: {selectedTicket.customerName} ({selectedTicket.customerPhone})
                    </div>
                  </div>

                  <select
                    value={selectedTicket.status}
                    onChange={(e) => updateTicketStatus(selectedTicket.id, e.target.value as any)}
                    className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-emerald-400 focus:outline-none"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                {/* Conversation Body */}
                <div className="flex-1 overflow-y-auto py-4 space-y-3">
                  {selectedTicket.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        msg.isStaff ? 'items-start' : 'items-end'
                      }`}
                    >
                      <div className="text-[10px] text-slate-400 font-mono mb-1">
                        {msg.senderName} · {msg.timestamp.slice(11, 16)}
                      </div>
                      <div
                        className={`p-3.5 rounded-2xl max-w-md text-xs leading-relaxed ${
                          msg.isStaff
                            ? 'bg-slate-800 text-slate-200 border border-slate-700/80 rounded-tl-xs'
                            : 'bg-emerald-500/20 text-emerald-100 border border-emerald-500/30 rounded-tr-xs'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reply Form */}
                <form
                  onSubmit={handleSendReply}
                  className="pt-3 border-t border-slate-800 flex gap-2"
                >
                  <input
                    type="text"
                    placeholder={`Reply as ${currentUser.name} (${currentUser.roleTitle})...`}
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </form>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-500 text-xs bg-slate-900 border border-slate-800 rounded-3xl">
                Select a ticket from the left panel.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: FAQ */}
      {activeTab === 'faq' && (
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search telecom FAQs (PUK codes, SIM registration, eSIM, commissions)..."
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-3">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-white hover:text-emerald-400"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="p-4 pt-0 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 font-sans">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: CONTACTS & HOTLINES */}
      {activeTab === 'contacts' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
              <Headphones className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-white text-base">Subscriber Toll-Free</h4>
            <div className="text-xl font-bold font-mono text-emerald-400">100</div>
            <p className="text-xs text-slate-400">
              Free of charge from any FILS SIM card. Available 24 hours / 7 days.
            </p>
          </div>

          <div className="p-6 bg-slate-900 border border-emerald-500/40 rounded-3xl text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center mx-auto">
              <PhoneCall className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-white text-base">Official Support & Payments Helpline</h4>
            <div className="text-xl font-extrabold font-mono text-emerald-300">0785964635</div>
            <div className="text-[11px] font-mono text-slate-400">+250 78 596 4635</div>
            <p className="text-xs text-slate-400">
              Direct line for customer inquiries, SIM activation support, and bank transfer payment confirmation.
            </p>
          </div>

          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto">
              <LifeBuoy className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-white text-base">Carrier NOC & Fraud Unit</h4>
            <div className="text-xl font-bold font-mono text-cyan-300">noc@fils-telecom.com</div>
            <p className="text-xs text-slate-400">
              Urgent SIM swap disputes, fraud quarantine notifications, and police inquiries.
            </p>
          </div>
        </div>
      )}

      {/* New Ticket Modal */}
      {showNewTicketModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="font-bold text-white text-base mb-1">Open Customer Support Ticket</h3>
            <p className="text-xs text-slate-400 mb-4">
              A unique reference number will be generated immediately for tracking.
            </p>

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Inquiry Subject
                </label>
                <input
                  type="text"
                  placeholder="e.g. SIM registration status inquiry"
                  value={newTicketSubject}
                  onChange={(e) => setNewTicketSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={newTicketCategory}
                    onChange={(e) => setNewTicketCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="SIM Activation">SIM Activation</option>
                    <option value="Network Issue">Network Issue</option>
                    <option value="Billing & Airtime">Billing & Airtime</option>
                    <option value="KYC Verification">KYC Verification</option>
                    <option value="PUK & PIN Reset">PUK & PIN Reset</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Priority</label>
                  <select
                    value={newTicketPriority}
                    onChange={(e) => setNewTicketPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Description of Issue
                </label>
                <textarea
                  rows={3}
                  placeholder="Provide clear details for the carrier support team..."
                  value={newTicketBody}
                  onChange={(e) => setNewTicketBody(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewTicketModal(false)}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors"
                >
                  Generate Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
