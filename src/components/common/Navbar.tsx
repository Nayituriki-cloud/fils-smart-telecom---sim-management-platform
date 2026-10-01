import React, { useState } from 'react';
import { useFils, AppView } from '../../context/FilsContext';
import { UserRole } from '../../types';
import { FilsLogo } from './FilsLogo';
import {
  Bell,
  Radio,
  ChevronDown,
  Shield,
  Layers,
  FileCheck2,
  Package,
  DollarSign,
  Building2,
  HelpCircle,
  Code2,
  LayoutDashboard,
  Smartphone,
  UserCircle,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  onOpenNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenNotifications }) => {
  const {
    currentUser,
    currentRole,
    activeView,
    setActiveView,
    switchUserRole,
    unreadNotifsCount,
  } = useFils();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const rolesList: { role: UserRole; label: string; desc: string; icon: any }[] = [
    {
      role: 'customer',
      label: 'Subscriber / Customer',
      desc: 'View SIM, buy airtime/data, check balance',
      icon: Smartphone,
    },
    {
      role: 'agent',
      label: 'Field / Kiosk Agent',
      desc: 'Register customers, sell products, earn commissions',
      icon: UserCircle,
    },
    {
      role: 'super_admin',
      label: 'Super Admin',
      desc: 'Full telecom system management & executive analytics',
      icon: Shield,
    },
    {
      role: 'operations_manager',
      label: 'Operations Manager',
      desc: 'SIM lifecycle, carrier provisioning & branch quotas',
      icon: Layers,
    },
    {
      role: 'compliance_officer',
      label: 'Compliance Officer',
      desc: 'National ID verification & regulatory KYC approval',
      icon: FileCheck2,
    },
    {
      role: 'finance_manager',
      label: 'Finance Manager',
      desc: 'Revenue, billing audit & agent commission payouts',
      icon: DollarSign,
    },
    {
      role: 'branch_manager',
      label: 'Branch Manager',
      desc: 'Regional inventory, agents & sales performance',
      icon: Building2,
    },
  ];

  const navItems: { view: AppView; label: string; icon: any; roles?: UserRole[] }[] = [
    { view: 'home', label: 'Home', icon: Radio },
    { view: 'customer', label: 'Customer App', icon: Smartphone },
    { view: 'agent', label: 'Agent Portal', icon: UserCircle },
    { view: 'admin', label: 'Admin Dashboard', icon: LayoutDashboard },
    { view: 'sims', label: 'SIM Management', icon: Layers },
    { view: 'compliance', label: 'KYC & Compliance', icon: FileCheck2 },
    { view: 'products', label: 'Products', icon: Package },
    { view: 'commissions', label: 'Commissions', icon: DollarSign },
    { view: 'branches', label: 'Branches', icon: Building2 },
    { view: 'security', label: 'Security Center', icon: Shield },
    { view: 'support', label: 'Support & FAQs', icon: HelpCircle },
    { view: 'telecom_api', label: 'Telecom API (MNO)', icon: Code2 },
  ];

  const handleRoleSelect = (role: UserRole) => {
    switchUserRole(role);
    setRoleDropdownOpen(false);
  };

  const handleNavClick = (view: AppView) => {
    setActiveView(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80">
      {/* Top Status Ticker */}
      <div className="bg-slate-900/90 border-b border-slate-800/50 text-[11px] px-4 py-1 text-slate-400 flex items-center justify-between no-print">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
            Carrier Core 5G SA: ONLINE
          </span>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="hidden sm:inline text-slate-400">
            Node: Kigali Central DataCenter (99.98% SLA)
          </span>
        </div>

        <div className="flex items-center gap-3 text-slate-400">
          <span className="hidden md:inline font-mono">
            Toll-Free Customer Care: 100 / +250 78 812 0000
          </span>
          <button
            onClick={() => setActiveView('telecom_api')}
            className="text-emerald-400 hover:underline flex items-center gap-1 font-mono text-[10px]"
          >
            <Code2 className="w-3 h-3" />
            MNO Gateway API
          </button>
        </div>
      </div>

      {/* Primary Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <button
            onClick={() => setActiveView('home')}
            className="flex items-center text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-lg p-1"
          >
            <FilsLogo size="md" showTagline={true} />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 overflow-x-auto py-1">
            {navItems.slice(0, 8).map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => handleNavClick(item.view)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* More Menu for Secondary Tabs */}
            <div className="relative group">
              <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60">
                <span>More</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
              <div className="absolute right-0 top-full mt-1 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-xl py-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all z-50">
                {navItems.slice(8).map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.view}
                      onClick={() => handleNavClick(item.view)}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-xs text-left transition-colors ${
                        activeView === item.view
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-emerald-400" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* Right Controls: Role Switcher & Notifications & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 hover:border-emerald-500/50 text-slate-200 text-xs font-medium transition-all shadow-sm"
                title="Switch platform view role"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <div className="text-left hidden sm:block">
                  <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Role View</div>
                  <div className="font-semibold text-white truncate max-w-[110px]">
                    {rolesList.find((r) => r.role === currentRole)?.label.split(' / ')[0]}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-slate-800">
                    <div className="text-xs font-bold text-white flex items-center justify-between">
                      <span>Switch Operational Role</span>
                      <span className="text-[10px] text-emerald-400 font-mono">Live RBAC</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Explore FILS from any authorized perspective
                    </div>
                  </div>
                  <div className="py-1 max-h-80 overflow-y-auto space-y-1">
                    {rolesList.map((r) => {
                      const Icon = r.icon;
                      const isSelected = currentRole === r.role;
                      return (
                        <button
                          key={r.role}
                          onClick={() => handleRoleSelect(r.role)}
                          className={`w-full flex items-start gap-2.5 p-2 rounded-lg text-left transition-colors ${
                            isSelected
                              ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                              : 'hover:bg-slate-800/80 text-slate-300'
                          }`}
                        >
                          <div
                            className={`p-1.5 rounded-md mt-0.5 ${
                              isSelected
                                ? 'bg-emerald-500 text-slate-950'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold text-white flex items-center justify-between">
                              <span>{r.label}</span>
                              {isSelected && (
                                <span className="text-[10px] text-emerald-400 font-mono">
                                  ACTIVE
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400 leading-tight line-clamp-1">
                              {r.desc}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifsCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-500 text-slate-950 font-black text-[9px] rounded-full flex items-center justify-center animate-pulse">
                  {unreadNotifsCount}
                </span>
              )}
            </button>

            {/* Active User Indicator */}
            <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-slate-800">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover border border-emerald-500/40"
              />
              <div className="text-left text-xs">
                <div className="font-semibold text-slate-200 leading-tight truncate max-w-[120px]">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
                  {currentUser.roleTitle}
                </div>
              </div>
            </div>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Navigation */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-800 bg-slate-950 px-4 py-3 space-y-1 max-h-[75vh] overflow-y-auto">
          <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Navigation Modules
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => handleNavClick(item.view)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold'
                    : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <Icon className="w-4 h-4 text-emerald-400" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
