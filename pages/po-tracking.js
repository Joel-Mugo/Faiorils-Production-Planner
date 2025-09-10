// pages/po-tracking.js
import React, { useState, useEffect, useMemo } from 'react';
import { Truck, Package, Calendar, User, Plus, Save, Search, Filter } from 'lucide-react';
import { getPurchaseOrders, addPurchaseOrder } from '../utils/dataStore';

export default function POTracking() {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterQuarter, setFilterQuarter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('dispatchDate');

  const [poForm, setPoForm] = useState({
    clientName: '',
    poNumber: '',
    products: '',
    quantity: '',
    dispatchDate: ''
  });

  useEffect(() => {
    setPurchaseOrders(getPurchaseOrders());
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const dispatchDate = new Date(poForm.dispatchDate);
    const dispatchWeek = Math.ceil(dispatchDate.getDate() / 7);
    const dispatchMonth = dispatchDate.getMonth() + 1;
    const dispatchQuarter = Math.ceil(dispatchMonth / 3);
    
    const newPO = {
      ...poForm,
      dispatchWeek,
      dispatchMonth,
      dispatchQuarter,
      dispatchYear: dispatchDate.getFullYear(),
      timestamp: new Date().toISOString()
    };
    
    addPurchaseOrder(newPO);
    setPurchaseOrders(getPurchaseOrders());
    
    // Reset form
    setPoForm({
      clientName: '',
      poNumber: '',
      products: '',
      quantity: '',
      dispatchDate: ''
    });
    setShowAddForm(false);
  };

  const filteredAndSortedPOs = useMemo(() => {
    let filtered = purchaseOrders;

    // Filter by quarter
    if (filterQuarter !== 'all') {
      filtered = filtered.filter(po => po.dispatchQuarter === parseInt(filterQuarter));
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(po =>
        po.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        po.products.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'dispatchDate') {
        return new Date(a.dispatchDate) - new Date(b.dispatchDate);
      }
      if (sortBy === 'quantity') {
        return parseFloat(b.quantity) - parseFloat(a.quantity);
      }
      if (sortBy === 'client') {
        return a.clientName.localeCompare(b.clientName);
      }
      return 0;
    });

    return filtered;
  }, [purchaseOrders, filterQuarter, searchTerm, sortBy]);

  const quarterStats = useMemo(() => {
    const stats = { 1: { count: 0, volume: 0 }, 2: { count: 0, volume: 0 }, 3: { count: 0, volume: 0 }, 4: { count: 0, volume: 0 } };
    
    purchaseOrders.forEach(po => {
      stats[po.dispatchQuarter].count += 1;
      stats[po.dispatchQuarter].volume += parseFloat(po.quantity);
    });
    
    return stats;
  }, [purchaseOrders]);

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(Math.round(num));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getQuarterName = (quarter) => {
    const names = { 1: 'Q1', 2: 'Q2', 3: 'Q3', 4: 'Q4' };
    return names[quarter];
  };

  const getUrgencyColor = (dispatchDate) => {
    const dispatch = new Date(dispatchDate);
    const today = new Date();
    const daysUntil = Math.ceil((dispatch - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntil < 7) return 'bg-red-50 border-red-200 text-red-800';
    if (daysUntil < 30) return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    return 'bg-green-50 border-green-200 text-green-800';
  };

  return (
    <div className="max-w-full mx-auto">
      {/* Page Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Truck className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Purchase Order Tracking</h1>
              <p className="text-gray-600">Monitor client orders, dispatch schedules and delivery planning</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-purple-800 transition-colors shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Add New PO</span>
          </button>
        </div>
      </div>

      {/* Quarterly Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {Object.entries(quarterStats).map(([quarter, stats]) => (
          <div key={quarter} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-700">{getQuarterName(parseInt(quarter))} 2024</h3>
              <Package className="w-4 h-4 text-gray-400" />
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-purple-600">{stats.count}</div>
              <div className="text-sm text-gray-600">Orders</div>
              <div className="text-sm font-medium text-gray-800">{formatNumber(stats.volume)} kg</div>
            </div>
          </div>
        ))}
      </div>

      {/* Add PO Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Purchase Order</h2>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
              <input
                type="text"
                value={poForm.clientName}
                onChange={(e) => setPoForm({...poForm, clientName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">PO Number</label>
              <input
                type="text"
                value={poForm.poNumber}
                onChange={(e) => setPoForm({...poForm, poNumber: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Products</label>
              <input
                type="text"
                value={poForm.products}
                onChange={(e) => setPoForm({...poForm, products: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (kg)</label>
              <input
                type="number"
                step="0.01"
                value={poForm.quantity}
                onChange={(e) => setPoForm({...poForm, quantity: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dispatch Date</label>
              <input
                type="date"
                value={poForm.dispatchDate}
                onChange={(e) => setPoForm({...poForm, dispatchDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Add PO</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search POs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterQuarter}
              onChange={(e) => setFilterQuarter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Quarters</option>
              <option value="1">Q1</option>
              <option value="2">Q2</option>
              <option value="3">Q3</option>
              <option value="4">Q4</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="dispatchDate">Dispatch Date</option>
              <option value="quantity">Quantity</option>
              <option value="client">Client Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* PO List */}
      {filteredAndSortedPOs.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Purchase Orders Found</h2>
          <p className="text-gray-600 mb-6">Start by adding purchase orders to track client deliveries.</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-purple-800 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add First PO</span>
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredAndSortedPOs.map(po => (
            <div key={po.id} className={`bg-white rounded-xl shadow-lg border-2 overflow-hidden ${getUrgencyColor(po.dispatchDate)}`}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <User className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{po.clientName}</h3>
                      <p className="text-sm text-gray-600">PO: {po.poNumber}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600">{formatNumber(po.quantity)} kg</div>
                    <div className="text-sm text-gray-600">{getQuarterName(po.dispatchQuarter)} {po.dispatchYear}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Products</div>
                    <div className="font-medium text-gray-800">{po.products}</div>
                  </div>
                  
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Dispatch Date</div>
                    <div className="font-medium text-gray-800">{formatDate(po.dispatchDate)}</div>
                    <div className="text-xs text-gray-600">Week {po.dispatchWeek}</div>
                  </div>
                  
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Quantity</div>
                    <div className="font-medium text-gray-800">{formatNumber(po.quantity)} kg</div>
                  </div>
                  
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Timeline</div>
                    <div className="font-medium text-gray-800">
                      Month {po.dispatchMonth} | {getQuarterName(po.dispatchQuarter)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
