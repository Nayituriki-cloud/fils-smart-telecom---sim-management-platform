import React, { useState } from 'react';
import { useFils } from '../../context/FilsContext';
import { FilsLogo } from '../common/FilsLogo';
import {
  Smartphone,
  UserCircle,
  ShieldCheck,
  Signal,
  Wifi,
  Search,
  MapPin,
  ChevronRight,
  PhoneCall,
  CheckCircle2,
  Clock,
  Award,
  Zap,
  Radio,
  FileCheck2,
  Headphones,
  QrCode,
  ArrowRight,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setActiveView, switchUserRole, products, branches } = useFils();
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');

  const filteredBranches = branches.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(searchLocation.toLowerCase()) ||
      b.address.toLowerCase().includes(searchLocation.toLowerCase()) ||
      b.region.toLowerCase().includes(searchLocation.toLowerCase());
    const matchesRegion = selectedRegion === 'All' || b.region.includes(selectedRegion);
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-800">
        {/* Ambient background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[250px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse">
              <Signal className="w-3.5 h-3.5" />
              <span>Next-Gen Telecommunications & SIM Ecosystem</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
              Connect. Manage.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                Grow.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-10 max-w-2xl mx-auto">
              FILS is the premier telecommunications platform powering instant SIM registration,
              regulatory biometric KYC compliance, carrier network provisioning, and real-time agent
              commissions across Africa and beyond.
            </p>

            {/* Quick Action Portals */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {/* Customer Portal */}
              <button
                onClick={() => {
                  switchUserRole('customer');
                  setActiveView('customer');
                }}
                className="group p-4 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-emerald-500/50 rounded-2xl text-left transition-all shadow-lg hover:shadow-emerald-500/10 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-white text-base mb-1">Customer Portal</h3>
                  <p className="text-xs text-slate-400">
                    Manage active SIM, top up airtime & 5G bundles.
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-emerald-400 mt-4 group-hover:translate-x-1 transition-transform">
                  <span>Enter Portal</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>

              {/* Agent Portal */}
              <button
                onClick={() => {
                  switchUserRole('agent');
                  setActiveView('agent');
                }}
                className="group p-4 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-teal-500/50 rounded-2xl text-left transition-all shadow-lg hover:shadow-teal-500/10 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-teal-500/15 text-teal-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <UserCircle className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-white text-base mb-1">Agent App</h3>
                  <p className="text-xs text-slate-400">
                    Field SIM registration, biometric KYC & commissions.
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-teal-400 mt-4 group-hover:translate-x-1 transition-transform">
                  <span>Field Sign-in</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>

              {/* Admin Panel */}
              <button
                onClick={() => {
                  switchUserRole('super_admin');
                  setActiveView('admin');
                }}
                className="group p-4 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/50 rounded-2xl text-left transition-all shadow-lg hover:shadow-cyan-500/10 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-white text-base mb-1">Admin Dashboard</h3>
                  <p className="text-xs text-slate-400">
                    SIM inventory, branch quotas, compliance & audit.
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-cyan-400 mt-4 group-hover:translate-x-1 transition-transform">
                  <span>Executive Hub</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Live Network Stats Strip */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 sm:p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-sm">
            <div className="text-center sm:text-left border-r border-slate-800 last:border-0 pr-4">
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">99.98%</div>
              <div className="text-xs text-slate-400 mt-0.5">Carrier Core Uptime</div>
            </div>
            <div className="text-center sm:text-left border-r border-slate-800 last:border-0 pr-4">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">&lt; 3 Mins</div>
              <div className="text-xs text-slate-400 mt-0.5">Avg. SIM KYC Activation</div>
            </div>
            <div className="text-center sm:text-left border-r border-slate-800 last:border-0 pr-4">
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">24,700+</div>
              <div className="text-xs text-slate-400 mt-0.5">Active FILS SIM Lines</div>
            </div>
            <div className="text-center sm:text-left">
              <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">1,850+</div>
              <div className="text-xs text-slate-400 mt-0.5">Accredited Field Agents</div>
            </div>
          </div>
        </div>
      </section>

      {/* Available Telecom Services */}
      <section className="py-16 bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
                Network Catalog
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Approved Telecommunication Services
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Authorized 5G Ultra, High-Speed Data, All-Net Voice and eSIM profiles.
              </p>
            </div>
            <button
              onClick={() => setActiveView('products')}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 self-start md:self-end"
            >
              <span>View full tariff catalog</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.slice(0, 3).map((prod) => (
              <div
                key={prod.id}
                className="p-6 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-medium text-emerald-400 font-mono">
                      {prod.category}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{prod.validity}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{prod.name}</h3>
                  <div className="text-sm font-semibold text-cyan-300 mb-3 font-mono">
                    {prod.quota}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">{prod.description}</p>
                  <ul className="space-y-1.5 mb-6">
                    {prod.features.slice(0, 3).map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-white font-mono">
                      {prod.price.toLocaleString()}
                    </span>{' '}
                    <span className="text-xs text-slate-400">{prod.currency}</span>
                  </div>
                  <button
                    onClick={() => {
                      switchUserRole('customer');
                      setActiveView('customer');
                    }}
                    className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 text-xs font-semibold rounded-lg transition-colors"
                  >
                    Purchase Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Find a FILS Agent Locator */}
      <section className="py-16 bg-slate-900/40 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-8">
            <div className="text-xs font-semibold text-teal-400 uppercase tracking-wider mb-2">
              National Distribution
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Find an Authorized FILS Agent</h2>
            <p className="text-sm text-slate-400 mt-1">
              Visit an authorized agent branch or field station for instant National ID verification,
              SIM card purchase, or SIM replacement.
            </p>
          </div>

          {/* Search bar & filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by city, street, or branch name (e.g. Kigali Heights, Nairobi)..."
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>
            <div className="flex gap-2">
              {['All', 'Kigali', 'Nairobi', 'Lagos', 'Western'].map((region) => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    selectedRegion === region
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>

          {/* Branch Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredBranches.map((branch) => (
              <div
                key={branch.id}
                className="p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-teal-400 font-semibold">
                      {branch.code}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {branch.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-sm mb-1">{branch.name}</h4>
                  <div className="flex items-start gap-1.5 text-xs text-slate-400 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                    <span>{branch.address}</span>
                  </div>
                  <div className="text-xs text-slate-400 space-y-1 mb-4">
                    <div>
                      Manager: <span className="text-slate-200">{branch.managerName}</span>
                    </div>
                    <div>
                      Phone: <span className="font-mono text-slate-300">{branch.managerPhone}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">
                    {branch.activeAgentsCount} Agents on duty
                  </span>
                  <button
                    onClick={() => {
                      switchUserRole('agent');
                      setActiveView('agent');
                    }}
                    className="text-teal-400 hover:text-teal-300 font-medium"
                  >
                    Open Station &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Regulatory Compliance Banner */}
      <section className="py-12 bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl relative overflow-hidden">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-3">
                <ShieldCheck className="w-4 h-4" />
                <span>Strict Telecom Regulatory Compliance</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Compliant with National SIM Registration Laws
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                FILS strictly enforces identity verification before any SIM card is activated on the
                carrier network. All documents are encrypted in accordance with GDPR and national
                data protection standards. Unverified or duplicate registrations are quarantined
                automatically.
              </p>
              <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-300">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Biometric Facial Liveness Match
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  National ID Duplicate Guard
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  AES-256 Encrypted Storage
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-12 bg-slate-950 text-slate-500 text-xs border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <FilsLogo size="sm" showTagline={true} />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400">
            <a href="tel:0785964635" className="text-emerald-400 font-mono font-bold hover:underline">
              Helpline: 0785964635
            </a>
            <button onClick={() => setActiveView('support')} className="hover:text-white">
              Support Center
            </button>
            <button onClick={() => setActiveView('telecom_api')} className="hover:text-white">
              Carrier APIs
            </button>
            <button onClick={() => setActiveView('security')} className="hover:text-white">
              Security Policy
            </button>
            <button onClick={() => setActiveView('compliance')} className="hover:text-white">
              KYC Regulations
            </button>
          </div>
          <div className="text-center md:text-right font-mono text-[11px]">
            &copy; 2026 FILS Telecommunications Ltd. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
