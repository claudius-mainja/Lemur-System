'use client';

import { useState } from 'react';
import { useDataStore, InventoryItem, Vendor, Order } from '@/stores/data.store';
import { 
  Package, Truck, Plus, Search, MoreHorizontal, Download, AlertTriangle,
  CheckCircle, XCircle, ShoppingCart, Barcode, MapPin, Star, Edit, Trash2,
  X, Clock, Send, Eye, Check, Ban
} from 'lucide-react';
import toast from 'react-hot-toast';

type ViewTab = 'inventory' | 'vendors' | 'orders';

interface OrderItem {
  itemName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export default function SupplyChainDashboard() {
  const { inventory, vendors, addInventoryItem, updateInventoryItem, addVendor, orders, addOrder, updateOrder, deleteOrder } = useDataStore();
  const [activeView, setActiveView] = useState<ViewTab>('inventory');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddItem, setShowAddItem] = useState(false);
  const [showAddVendor, setShowAddVendor] = useState(false);
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [newOrder, setNewOrder] = useState({
    vendorId: '',
    items: [] as OrderItem[],
    notes: '',
  });
  const [newOrderItem, setNewOrderItem] = useState({
    itemName: '',
    quantity: 1,
    unitPrice: 0,
  });

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

  const addItemToOrder = () => {
    if (!newOrderItem.itemName) {
      toast.error('Item name is required');
      return;
    }
    setNewOrder({
      ...newOrder,
      items: [
        ...newOrder.items,
        {
          ...newOrderItem,
          total: newOrderItem.quantity * newOrderItem.unitPrice,
        },
      ],
    });
    setNewOrderItem({ itemName: '', quantity: 1, unitPrice: 0 });
  };

  const removeOrderItem = (index: number) => {
    setNewOrder({
      ...newOrder,
      items: newOrder.items.filter((_, i) => i !== index),
    });
  };

  const handleCreateOrder = () => {
    if (!newOrder.vendorId) {
      toast.error('Please select a vendor');
      return;
    }
    if (newOrder.items.length === 0) {
      toast.error('Please add at least one item');
      return;
    }
    const vendor = vendors.find(v => v.id === newOrder.vendorId);
    const totalAmount = newOrder.items.reduce((sum, item) => sum + item.total, 0);
    addOrder({
      orderNumber: `PO-${Date.now().toString(36).toUpperCase()}`,
      vendorId: newOrder.vendorId,
      vendorName: vendor?.name || '',
      items: newOrder.items,
      totalAmount,
      status: 'pending',
      orderDate: new Date().toISOString().split('T')[0],
      notes: newOrder.notes,
    });
    toast.success('Purchase order created!');
    setShowCreateOrder(false);
    setNewOrder({ vendorId: '', items: [], notes: '' });
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    updateOrder(orderId, { status: newStatus });
    toast.success(`Order marked as ${newStatus}`);
  };

  const filteredOrders = orders.filter(o => {
    if (orderFilter === 'all') return true;
    return o.status === orderFilter;
  });

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-500/20 text-amber-400';
      case 'approved': return 'bg-blue-500/20 text-blue-400';
      case 'ordered': return 'bg-purple-500/20 text-purple-400';
      case 'shipped': return 'bg-cyan-500/20 text-cyan-400';
      case 'received': return 'bg-green-500/20 text-green-400';
      case 'rejected': return 'bg-red-500/20 text-red-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1520] via-[#0b2535] to-[#061520]">
      {/* Header */}
      <header className="bg-[#0b2535]/50 backdrop-blur-xl border-b border-white/10 sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white uppercase tracking-wider">Supply Chain</h1>
              <p className="text-sm text-white/50">Manage inventory & vendors</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-[#0b2535]/80 backdrop-blur-xl border-r border-white/10 min-h-screen">
          <nav className="p-4 space-y-1">
            <button
              onClick={() => setActiveView('inventory')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition ${
                activeView === 'inventory'
                  ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <Package className="w-5 h-5" />
              Inventory
            </button>
            <button
              onClick={() => setActiveView('vendors')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition ${
                activeView === 'vendors'
                  ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <Truck className="w-5 h-5" />
              Vendors
            </button>
            <button
              onClick={() => setActiveView('orders')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition ${
                activeView === 'orders'
                  ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              Orders
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.totalItems}</p>
                  <p className="text-sm text-white/50">Total Items</p>
                </div>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">${stats.totalValue.toLocaleString()}</p>
                  <p className="text-sm text-white/50">Total Value</p>
                </div>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.lowStock}</p>
                  <p className="text-sm text-white/50">Low Stock</p>
                </div>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.outOfStock}</p>
                  <p className="text-sm text-white/50">Out of Stock</p>
                </div>
              </div>
            </div>
          </div>

          {activeView === 'inventory' && (
            <div className="bg-white/5 border border-white/10 rounded-xl">
              <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    placeholder="Search inventory..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-white/10 rounded-lg text-sm bg-white/5 text-white"
                  />
                </div>
                <button onClick={() => setShowAddItem(true)} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Item
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-white/50 uppercase">Item</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-white/50 uppercase">SKU</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-white/50 uppercase">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-white/50 uppercase">Qty</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-white/50 uppercase">Unit Price</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-white/50 uppercase">Status</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-white/50 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredInventory.map((item) => (
                      <tr key={item.id} className="hover:bg-white/5">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                              <Package className="w-5 h-5 text-orange-500" />
                            </div>
                            <div>
                              <p className="font-medium text-white">{item.name}</p>
                              <p className="text-xs text-white/50">{item.location}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-white/70">{item.sku}</td>
                        <td className="px-4 py-3 text-sm text-white/70">{item.category}</td>
                        <td className="px-4 py-3">
                          <span className={item.quantity <= item.minQuantity ? 'text-red-500 font-medium' : 'text-white'}>
                            {item.quantity}
                          </span>
                          <span className="text-white/30 text-xs"> / {item.minQuantity}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-white">${item.unitPrice.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(item.status)}`}>
                            {item.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button className="p-1 hover:bg-white/10 rounded">
                            <MoreHorizontal className="w-4 h-4 text-white/50" />
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
            <div className="bg-white/5 border border-white/10 rounded-xl">
              <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    placeholder="Search vendors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-white/10 rounded-lg text-sm bg-white/5 text-white"
                  />
                </div>
                <button onClick={() => setShowAddVendor(true)} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Vendor
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {filteredVendors.map((vendor) => (
                  <div key={vendor.id} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                        <Truck className="w-5 h-5 text-white" />
                      </div>
                      <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400">
                        {vendor.status}
                      </span>
                    </div>
                    <h3 className="font-semibold text-white">{vendor.name}</h3>
                    <p className="text-sm text-white/50">{vendor.category}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="text-sm text-white/70">{vendor.rating}</span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <p className="text-sm text-white/50">{vendor.city}, {vendor.country}</p>
                      <p className="text-sm text-white/50">{vendor.totalOrders} orders • ${vendor.totalSpent.toLocaleString()} spent</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeView === 'orders' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  {['all', 'pending', 'approved', 'ordered', 'shipped', 'received', 'rejected'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setOrderFilter(status)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                        orderFilter === status
                          ? 'bg-primary text-white'
                          : 'bg-white/5 text-white/50 hover:bg-white/10'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShowCreateOrder(true)}
                  className="px-4 py-2 bg-primary text-white rounded-lg flex items-center gap-2 hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4" /> Create Order
                </button>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl">
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShoppingCart className="w-8 h-8 text-white/30" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">No Purchase Orders</h3>
                    <p className="text-white/50 mb-6">Create your first order to start managing suppliers.</p>
                    <button
                      onClick={() => setShowCreateOrder(true)}
                      className="px-6 py-3 bg-primary text-white rounded-lg inline-flex items-center gap-2 hover:bg-primary/90"
                    >
                      <Plus className="w-5 h-5" /> Create Purchase Order
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {filteredOrders.map((order) => (
                      <div key={order.id} className="p-4 hover:bg-white/5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                              <Package className="w-6 h-6 text-orange-500" />
                            </div>
                            <div>
                              <p className="font-medium text-white">{order.orderNumber}</p>
                              <p className="text-sm text-white/50">{order.vendorName}</p>
                              <p className="text-xs text-white/30">{order.orderDate}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-white">${order.totalAmount.toLocaleString()}</p>
                            <p className="text-xs text-white/50">{order.items.length} items</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${getOrderStatusColor(order.status)}`}>
                              {order.status.toUpperCase()}
                            </span>
                            <div className="flex gap-1">
                              {order.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleUpdateOrderStatus(order.id, 'approved')}
                                    className="p-2 hover:bg-white/10 rounded text-blue-400"
                                    title="Approve"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleUpdateOrderStatus(order.id, 'rejected')}
                                    className="p-2 hover:bg-white/10 rounded text-red-400"
                                    title="Reject"
                                  >
                                    <Ban className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                              {order.status === 'approved' && (
                                <button
                                  onClick={() => handleUpdateOrderStatus(order.id, 'ordered')}
                                  className="p-2 hover:bg-white/10 rounded text-purple-400"
                                  title="Mark as Ordered"
                                >
                                  <Send className="w-4 h-4" />
                                </button>
                              )}
                              {order.status === 'ordered' && (
                                <button
                                  onClick={() => handleUpdateOrderStatus(order.id, 'shipped')}
                                  className="p-2 hover:bg-white/10 rounded text-cyan-400"
                                  title="Mark as Shipped"
                                >
                                  <Truck className="w-4 h-4" />
                                </button>
                              )}
                              {order.status === 'shipped' && (
                                <button
                                  onClick={() => handleUpdateOrderStatus(order.id, 'received')}
                                  className="p-2 hover:bg-white/10 rounded text-green-400"
                                  title="Mark as Received"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => deleteOrder(order.id)}
                                className="p-2 hover:bg-white/10 rounded text-red-400"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                        {order.notes && (
                          <p className="text-xs text-white/50 mt-2 ml-16">{order.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {showAddItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0b2535] rounded-xl w-full max-w-lg border border-white/10">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">Add Inventory Item</h2>
            </div>
            <form onSubmit={handleAddItem} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1 uppercase tracking-wider">Item Name</label>
                  <input name="name" required className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1 uppercase tracking-wider">SKU</label>
                  <input name="sku" required className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1 uppercase tracking-wider">Category</label>
                  <select name="category" required className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white">
                    <option value="Technology">Technology</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Office Supplies">Office Supplies</option>
                    <option value="Equipment">Equipment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1 uppercase tracking-wider">Vendor</label>
                  <select name="vendorId" required className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white">
                    {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1 uppercase tracking-wider">Quantity</label>
                  <input name="quantity" type="number" required className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1 uppercase tracking-wider">Min Qty</label>
                  <input name="minQuantity" type="number" required className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1 uppercase tracking-wider">Unit Price</label>
                  <input name="unitPrice" type="number" step="0.01" required className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1 uppercase tracking-wider">Location</label>
                <input name="location" required className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowAddItem(false)} className="px-4 py-2 border border-white/10 rounded-lg text-white/70 hover:bg-white/5">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">Add Item</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddVendor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0b2535] rounded-xl w-full max-w-lg border border-white/10">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">Add Vendor</h2>
            </div>
            <form onSubmit={handleAddVendor} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1 uppercase tracking-wider">Vendor Name</label>
                <input name="name" required className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1 uppercase tracking-wider">Email</label>
                  <input name="email" type="email" required className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1 uppercase tracking-wider">Phone</label>
                  <input name="phone" required className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1 uppercase tracking-wider">City</label>
                  <input name="city" required className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1 uppercase tracking-wider">Country</label>
                  <input name="country" required className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1 uppercase tracking-wider">Category</label>
                <select name="category" required className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white">
                  <option value="Technology">Technology</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Office Supplies">Office Supplies</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Software">Software</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1 uppercase tracking-wider">Address</label>
                <input name="address" required className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowAddVendor(false)} className="px-4 py-2 border border-white/10 rounded-lg text-white/70 hover:bg-white/5">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">Add Vendor</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Order Modal */}
      {showCreateOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0b2535] rounded-xl w-full max-w-2xl border border-white/10 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-[#0b2535] z-10">
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">Create Purchase Order</h2>
              <button onClick={() => setShowCreateOrder(false)} className="text-white/50 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-1 uppercase tracking-wider">Vendor</label>
                <select
                  value={newOrder.vendorId}
                  onChange={(e) => setNewOrder({ ...newOrder, vendorId: e.target.value })}
                  className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white"
                  required
                >
                  <option value="">Select Vendor</option>
                  {vendors.map(v => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-sm text-white/60 mb-3 uppercase tracking-wider">Order Items</h4>
                <div className="space-y-2">
                  {newOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                      <div>
                        <p className="text-white">{item.itemName}</p>
                        <p className="text-xs text-white/50">{item.quantity} x ${item.unitPrice}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-white font-medium">${item.total.toLocaleString()}</span>
                        <button
                          onClick={() => removeOrderItem(index)}
                          className="p-1 hover:bg-white/10 rounded text-red-400"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2 mt-3">
                  <input
                    type="text"
                    placeholder="Item name"
                    value={newOrderItem.itemName}
                    onChange={(e) => setNewOrderItem({ ...newOrderItem, itemName: e.target.value })}
                    className="px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Qty"
                    min="1"
                    value={newOrderItem.quantity}
                    onChange={(e) => setNewOrderItem({ ...newOrderItem, quantity: parseInt(e.target.value) || 1 })}
                    className="px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    step="0.01"
                    value={newOrderItem.unitPrice}
                    onChange={(e) => setNewOrderItem({ ...newOrderItem, unitPrice: parseFloat(e.target.value) || 0 })}
                    className="px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white text-sm"
                  />
                </div>
                <button
                  onClick={addItemToOrder}
                  className="mt-2 w-full py-2 border border-dashed border-white/20 rounded-lg text-white/50 text-sm hover:bg-white/5"
                >
                  + Add Item
                </button>
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-1 uppercase tracking-wider">Notes</label>
                <textarea
                  value={newOrder.notes}
                  onChange={(e) => setNewOrder({ ...newOrder, notes: e.target.value })}
                  placeholder="Additional notes for this order..."
                  rows={3}
                  className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white resize-none"
                />
              </div>

              {newOrder.items.length > 0 && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Total Amount</span>
                    <span className="text-2xl font-bold text-green-400">
                      ${newOrder.items.reduce((sum, item) => sum + item.total, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowCreateOrder(false)}
                  className="px-4 py-2 border border-white/10 rounded-lg text-white/70 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateOrder}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  Create Order
                </button>
              </div>
            </div>
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
