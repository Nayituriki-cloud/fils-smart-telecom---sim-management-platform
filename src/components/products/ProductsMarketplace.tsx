import React, { useState } from 'react';
import { useFils } from '../../context/FilsContext';
import { Product, ProductCategory } from '../../types';
import {
  Package,
  PlusCircle,
  Edit2,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Zap,
  Wifi,
  PhoneCall,
  MessageSquare,
  Building,
  Sparkles,
} from 'lucide-react';

export const ProductsMarketplace: React.FC = () => {
  const { products, createProduct, updateProduct, currentUser, purchaseProduct } = useFils();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [newProductForm, setNewProductForm] = useState({
    name: '',
    category: 'Data Bundle' as ProductCategory,
    price: 5000,
    currency: 'RWF',
    validity: '30 Days',
    quota: '15 GB High Speed',
    description: '',
    agentCommissionRate: 7.0,
    active: true,
    popular: false,
    features: ['Instant activation', 'Carryover data'],
  });

  const categories: ProductCategory[] = [
    'Airtime',
    'Data Bundle',
    'Voice Package',
    'SMS Package',
    'Business Bundle',
    'Promotional',
  ];

  const canManageProducts =
    currentUser.role === 'super_admin' ||
    currentUser.role === 'operations_manager' ||
    currentUser.role === 'finance_manager';

  const filteredProducts = products.filter((p) =>
    selectedCategory === 'All' ? true : p.category === selectedCategory
  );

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProduct({
      ...newProductForm,
      features: newProductForm.features.filter((f) => f.trim().length > 0),
    });
    setShowAddModal(false);
    setNewProductForm({
      name: '',
      category: 'Data Bundle',
      price: 5000,
      currency: 'RWF',
      validity: '30 Days',
      quota: '15 GB High Speed',
      description: '',
      agentCommissionRate: 7.0,
      active: true,
      popular: false,
      features: ['Instant activation', 'Carryover data'],
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    updateProduct(editingProduct.id, editingProduct);
    setEditingProduct(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            Commercial Catalog & Tariffs
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
            <span>FILS Products Marketplace</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono font-medium">
              {products.length} Approved Services
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Official telecommunication packages, data bundles, airtime recharge tariffs, and agent commission schedules.
          </p>
        </div>

        {canManageProducts && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-md shadow-emerald-500/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Product</span>
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
            selectedCategory === 'All'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
          }`}
        >
          All Categories ({products.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            {cat} ({products.filter((p) => p.category === cat).length})
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredProducts.map((prod) => (
          <div
            key={prod.id}
            className={`p-6 bg-slate-900 border rounded-3xl flex flex-col justify-between transition-all relative ${
              prod.active
                ? 'border-slate-800 hover:border-slate-700'
                : 'border-slate-800/40 opacity-60'
            }`}
          >
            {prod.popular && (
              <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold font-mono text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                Popular
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold mb-2">
                {prod.category === 'Data Bundle' ? (
                  <Wifi className="w-3.5 h-3.5" />
                ) : prod.category === 'Voice Package' ? (
                  <PhoneCall className="w-3.5 h-3.5" />
                ) : prod.category === 'Airtime' ? (
                  <Zap className="w-3.5 h-3.5" />
                ) : prod.category === 'Business Bundle' ? (
                  <Building className="w-3.5 h-3.5" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span>{prod.category}</span>
                <span className="text-slate-500">·</span>
                <span className="text-slate-400">{prod.validity}</span>
              </div>

              <h3 className="font-bold text-white text-lg mb-1">{prod.name}</h3>
              <div className="text-sm font-bold text-cyan-300 font-mono mb-2">{prod.quota}</div>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">{prod.description}</p>

              <div className="space-y-1.5 mb-6">
                {prod.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-2xl font-bold font-mono text-white">
                    {prod.price.toLocaleString()}
                  </span>{' '}
                  <span className="text-xs text-slate-400">{prod.currency}</span>
                </div>
                <div className="text-right text-[11px] text-teal-400 font-mono">
                  Agent Comm: {prod.agentCommissionRate}%
                </div>
              </div>

              {canManageProducts && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingProduct(prod)}
                    className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Tariff</span>
                  </button>
                  <button
                    onClick={() => updateProduct(prod.id, { active: !prod.active })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                      prod.active
                        ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                    }`}
                  >
                    {prod.active ? 'Disable' : 'Enable'}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl">
            <h3 className="font-bold text-white text-lg mb-1">Create Telecom Product</h3>
            <p className="text-xs text-slate-400 mb-4">
              Add a new commercial bundle to the live catalog.
            </p>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ultra 5G Midnight Booster"
                  value={newProductForm.name}
                  onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={newProductForm.category}
                    onChange={(e) =>
                      setNewProductForm({
                        ...newProductForm,
                        category: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Price (RWF)
                  </label>
                  <input
                    type="number"
                    value={newProductForm.price}
                    onChange={(e) =>
                      setNewProductForm({ ...newProductForm, price: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Quota / Allowance
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 50 GB + 200 Mins"
                    value={newProductForm.quota}
                    onChange={(e) =>
                      setNewProductForm({ ...newProductForm, quota: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Validity</label>
                  <input
                    type="text"
                    placeholder="e.g. 30 Days"
                    value={newProductForm.validity}
                    onChange={(e) =>
                      setNewProductForm({ ...newProductForm, validity: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Agent Commission Rate (%)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={newProductForm.agentCommissionRate}
                  onChange={(e) =>
                    setNewProductForm({
                      ...newProductForm,
                      agentCommissionRate: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newProductForm.description}
                  onChange={(e) =>
                    setNewProductForm({ ...newProductForm, description: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors"
                >
                  Save & Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl">
            <h3 className="font-bold text-white text-lg mb-1">Edit {editingProduct.name}</h3>
            <p className="text-xs text-slate-400 mb-4">
              Update pricing, quotas, and field agent commission.
            </p>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, name: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Price ({editingProduct.currency})
                  </label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, price: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Commission Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={editingProduct.agentCommissionRate}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        agentCommissionRate: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Quota</label>
                <input
                  type="text"
                  value={editingProduct.quota}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, quota: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
