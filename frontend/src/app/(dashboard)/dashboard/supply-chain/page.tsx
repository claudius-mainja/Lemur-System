'use client';

import { useState } from 'react';
import { useDataStore, InventoryItem, Vendor } from '@/stores/data.store';
import { 
  Package, Truck, Plus, Search, MoreHorizontal, Download, AlertTriangle,
  CheckCircle, XCircle, ShoppingCart, Barcode, MapPin, Star, Edit, Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';

type ViewTab = 'inventory' | 'vendors' | 'orders';

export default function SupplyChainDashboard() {
  const { inventory, vendors, addInventoryItem, updateInventoryItem, addVendor } = useDataStore();
  const [activeView, setActiveView] = useState<ViewTab>('inventory');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddItem, setShowAddItem] = useState(false);
  const [showAddVendor, setShowAddVendor] = useState(false);

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredVendors = vendors.filter(v => 
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    totalItems: inventory.length,
    totalValue: inventory.reduce((sum, i) => sum + i.totalValue, 0),
    lowStock: inventory.filter(i => i.status === 'low_stock').length,
    outOfStock: inventory.filter(i => i.status === 'out_of_stock').length,
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'in_stock': return 'bg-green-100 text-green-700';
      case 'low_stock': return 'bg-amber-100 text-amber-700';
      case 'out_of_stock': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const handleAddItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const vendor = vendors.find(v => v.id === formData.get('vendorId'));
    const quantity = parseInt(formData.get('quantity') as string);
    const unitPrice = parseFloat(formData.get('unitPrice') as string);
    
    addInventoryItem({
      name: formData.get('name') as string,
      sku: formData.get('sku') as string,
      category: formData.get('category') as string,
      quantity,
      minQuantity: parseInt(formData.get('minQuantity') as string),
      unitPrice,
      totalValue: quantity * unitPrice,
      vendorId: formData.get('vendorId') as string,
      vendorName: vendor?.name || '',
      location: formData.get('location') as string,
      lastUpdated: new Date().toISOString().split('T')[0],
      status: quantity > parseInt(formData.get('minQuantity') as string) ? 'in_stock' : 
              quantity > 0 ? 'low_stock' : 'out_of_stock',
    });
    setShowAddItem(false);
    toast.success('Inventory item added!');
  };

  const handleAddVendor = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    addVendor({
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
      city: formData.get('city') as string,
      country: formData.get('country') as string,
      category: formData.get('category') as string,
      rating: 0,
      totalOrders: 0,
      totalSpent: 0,
      status: 'active',
    });
    setShowAddVendor(false);
    toast.success('Vendor added!');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Supply Chain</h1>
          <p className="text-slate-500">Manage inventory, vendors, and procurement</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setActiveView('inventory')} className={`px-4 py-2 rounded-lg font-medium ${activeView === 'inventory' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>
            Inventory
          </button>
          <button onClick={() => setActiveView('vendors')} className={`px-4 py-2 rounded-lg font-medium ${activeView === 'vendors' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>
            Vendors
          </button>
          <button onClick={() => setActiveView('orders')} className={`px-4 py-2 rounded-lg font-medium ${activeView === 'orders' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>
            Orders
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.totalItems}</p>
              <p className="text-sm text-slate-500">Total Items</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">${stats.totalValue.toLocaleString()}</p>
              <p className="text-sm text-slate-500">Total Value</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.lowStock}</p>
              <p className="text-sm text-slate-500">Low Stock</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.outOfStock}</p>
              <p className="text-sm text-slate-500">Out of Stock</p>
            </div>
          </div>
        </div>
      </div>

      {activeView === 'inventory' && (
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search inventory..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button onClick={() => setShowAddItem(true)} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Item
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Item</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">SKU</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Qty</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Unit Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredInventory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{item.name}</p>
                          <p className="text-xs text-slate-500">{item.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{item.sku}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{item.category}</td>
                    <td className="px-4 py-3">
                      <span className={item.quantity <= item.minQuantity ? 'text-red-600 font-medium' : ''}>
                        {item.quantity}
                      </span>
                      <span className="text-slate-400 text-xs"> / {item.minQuantity}</span>
                    </td>
                    <td className="px-4 py-3 text-sm">${item.unitPrice.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(item.status)}`}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="p-1 hover:bg-slate-100 rounded">
                        <MoreHorizontal className="w-4 h-4 text-slate-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeView === 'vendors' && (
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search vendors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button onClick={() => setShowAddVendor(true)} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Vendor
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {filteredVendors.map((vendor) => (
              <div key={vendor.id} className="border border-slate-200 rounded-xl p-4 hover:shadow-lg transition">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                    <Truck className="w-5 h-5 text-white" />
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                    {vendor.status}
                  </span>
                </div>
                <h3 className="font-semibold text-slate-900">{vendor.name}</h3>
                <p className="text-sm text-slate-500">{vendor.category}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-sm text-slate-600">{vendor.rating}</span>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <p className="text-sm text-slate-500">{vendor.city}, {vendor.country}</p>
                  <p className="text-sm text-slate-500">{vendor.totalOrders} orders • ${vendor.totalSpent.toLocaleString()} spent</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeView === 'orders' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Purchase Orders</h3>
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Purchase Orders Yet</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">Create your first purchase order to start managing your suppliers and orders.</p>
            <button className="mt-3 px-6 py-3 bg-primary text-white rounded-lg inline-flex items-center gap-2 hover:bg-primary/90">
              <Plus className="w-5 h-5" /> Create Purchase Order
            </button>
          </div>
        </div>
      )}

      {showAddItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold">Add Inventory Item</h2>
            </div>
            <form onSubmit={handleAddItem} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Item Name</label>
                  <input name="name" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">SKU</label>
                  <input name="sku" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <select name="category" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none">
                    <option value="Technology">Technology</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Office Supplies">Office Supplies</option>
                    <option value="Equipment">Equipment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Vendor</label>
                  <select name="vendorId" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none">
                    {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
                  <input name="quantity" type="number" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Min Qty</label>
                  <input name="minQuantity" type="number" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Unit Price</label>
                  <input name="unitPrice" type="number" step="0.01" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                <input name="location" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowAddItem(false)} className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700">Add Item</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddVendor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold">Add Vendor</h2>
            </div>
            <form onSubmit={handleAddVendor} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Vendor Name</label>
                <input name="name" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input name="email" type="email" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <input name="phone" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                  <input name="city" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
                  <input name="country" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select name="category" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none">
                  <option value="Technology">Technology</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Office Supplies">Office Supplies</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Software">Software</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                <input name="address" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowAddVendor(false)} className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700">Add Vendor</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function DollarSign(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="2" x2="12" y2="22"></line>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
  );
}
