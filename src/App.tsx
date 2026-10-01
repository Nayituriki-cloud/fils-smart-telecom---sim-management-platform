/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FilsProvider, useFils } from './context/FilsContext';
import { Navbar } from './components/common/Navbar';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { ReceiptModal } from './components/common/ReceiptModal';

import { LandingPage } from './components/landing/LandingPage';
import { CustomerPortal } from './components/customer/CustomerPortal';
import { AgentPortal } from './components/agent/AgentPortal';
import { SimManagement } from './components/sim/SimManagement';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { KycComplianceCenter } from './components/compliance/KycComplianceCenter';
import { ProductsMarketplace } from './components/products/ProductsMarketplace';
import { CommissionCenter } from './components/commissions/CommissionCenter';
import { BranchManagement } from './components/branches/BranchManagement';
import { SecurityCenter } from './components/security/SecurityCenter';
import { SupportCenter } from './components/support/SupportCenter';
import { TelecomApiPlayground } from './components/telecom/TelecomApiPlayground';

const MainLayout: React.FC = () => {
  const { activeView } = useFils();
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Navigation Header */}
      <Navbar onOpenNotifications={() => setNotificationDrawerOpen(true)} />

      {/* Main Content View Switcher */}
      <main className="flex-1">
        {activeView === 'home' && <LandingPage />}
        {activeView === 'customer' && <CustomerPortal />}
        {activeView === 'agent' && <AgentPortal />}
        {activeView === 'sims' && <SimManagement />}
        {activeView === 'admin' && <AdminDashboard />}
        {activeView === 'compliance' && <KycComplianceCenter />}
        {activeView === 'products' && <ProductsMarketplace />}
        {activeView === 'commissions' && <CommissionCenter />}
        {activeView === 'branches' && <BranchManagement />}
        {activeView === 'security' && <SecurityCenter />}
        {activeView === 'support' && <SupportCenter />}
        {activeView === 'telecom_api' && <TelecomApiPlayground />}
      </main>

      {/* Slide-over Notifications Drawer */}
      <NotificationDrawer
        isOpen={notificationDrawerOpen}
        onClose={() => setNotificationDrawerOpen(false)}
      />

      {/* Modal for official printable receipts */}
      <ReceiptModal />
    </div>
  );
};

export default function App() {
  return (
    <FilsProvider>
      <MainLayout />
    </FilsProvider>
  );
}
