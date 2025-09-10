// pages/data-entry.js
import React, { useState } from 'react';
import { Plus, Save, Calendar, Factory, Package, Zap, Clock } from 'lucide-react';
import { addProductionData, addPurchaseOrder, getFactories, getWeekDates, getQuarter } from '../utils/dataStore';

export default function DataEntry() {
  const [activeTab, setActiveTab] = useState('production');
  const [productionForm, setProductionForm] = useState({
    factoryName: '',
    weekNumber: '',
    year: new Date().getFullYear(),
    rawMaterial: '',
    volume: '',
    recoveryRate: '',
    activeDays: 7
  });
  
  const [poForm, setPoForm] = useState({
    clientName: '',
    poNumber: '',
    products: '',
    quantity: '',
    dispatchDate: ''
  });

  const [message, setMessage] = useState('');
  const factories = getFactories();

  const handleProductionSubmit = (e) => {
    e.preventDefault();
    
    const weekDates = getWeekDates(productionForm.year, parseInt(productionForm.weekNumber));
    const projectedOil = (parseFloat(productionForm.volume) * parseFloat(productionForm.recoveryRate) / 100);
    const month = Math.ceil(parseInt(productionForm.weekNumber) / 4.33);
    const quarter = getQuarter(month);
    
    const dataEntry = {
      ...productionForm,
      weekDates,
      projectedOil,
      month,
      quarter,
      timestamp: new Date().toISOString()
    };
    
    addProductionData(dataEntry);
    setMessage('Production data added successfully!');
    
    // Reset form
    setProductionForm({
      factoryName: '',
      weekNumber: '',
      year: new Date().getFullYear(),
      rawMaterial: '',
      volume: '',
      recoveryRate: '',
      activeDays: 7
    });
    
    setTimeout(() => setMessage(''), 3000);
  };

  const handlePOSubmit = (e) => {
    e.preventDefault();
    
    const dispatchDate = new Date(poForm.dispatchDate);
    const dispatchWeek = Math.ceil(dispatchDate.getDate() / 7);
    const dispatchMonth = dispatchDate.getMonth() + 1;
    const dispatchQuarter = getQuarter(dispatchMonth);
    
    const poEntry = {
      ...poForm,
      dispatchWeek,
      dispatchMonth,
      dispatchQuarter,
      timestamp: new Date().toISOString()
    };
    
    addPurchaseOrder(poEntry);
    setMessage('Purchase Order added successfully!');
    
    // Reset form
    setPoForm({
      clientName: '',
      poNumber: '',
      products: '',
      quantity: '',
      dispatchDate: ''
    });
    
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-green-100 p-3 rounded-lg">
            <Plus className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Data Entry Center</h1>
            <p className="text-gray-600">Add production schedules and purchase order information</p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {message && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <Save className="w-5 h-5 text-green-600 mr-2" />
            <p className="text-green-800">{message}</p>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-white rounded-t-xl shadow-lg">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('production')}
            className={`flex items-center space-x-2 px-6 py-4 font-medium border-b-2 transition-colors ${
              activeTab === 'production'
                ? 'border-green-500 text-green-600 bg-green-50'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Factory className="w-5 h-5" />
            <span>Production Data Entry</span>
          </button>
          
          <button
            onClick={() => setActiveTab('po')}
            className={`flex items-center space-x-2 px-6 py-4 font-medium border-b-2 transition-colors ${
              activeTab === 'po'
                ? 'border-purple-500 text-purple-600 bg-purple-50'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Package className="w-5 h-5" />
            <span>Purchase Order Entry</span>
          </button>
        </div>

        <div className="p-8">
          {/* Production Data Entry Form */}
          {activeTab === 'production' && (
            <form onSubmit={handleProductionSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Factory Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Factory className="inline w-4 h-4 mr-1" />
                    Factory
                  </label>
                  <select
                    value={productionForm.factoryName}
                    onChange={(e) => setProductionForm({...productionForm, factoryName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Factory</option>
                    {factories.map(factory => (
                      <option key={factory.id} value={factory.name}>{factory.name}</option>
                    ))}
                  </select>
                </div>

                {/* Week Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline w-4 h-4 mr-1" />
                    Week Number
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="53"
                    value={productionForm.weekNumber}
                    onChange={(e) => setProductionForm({...productionForm, weekNumber: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., 25"
                    required
                  />
                  {productionForm.weekNumber && (
                    <p className="text-xs text-gray-500 mt-1">
                      Week dates: {getWeekDates(productionForm.year, parseInt(productionForm.weekNumber)).start} to {getWeekDates(productionForm.year, parseInt(productionForm.weekNumber)).end}
                    </p>
                  )}
                </div>

                {/* Year */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline w-4 h-4 mr-1" />
                    Year
                  </label>
                  <input
                    type="number"
                    min="2024"
                    max="2030"
                    value={productionForm.year}
                    onChange={(e) => setProductionForm({...productionForm, year: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Raw Material */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Raw Material Type
                  </label>
                  <input
                    type="text"
                    value={productionForm.rawMaterial}
                    onChange={(e) => setProductionForm({...productionForm, rawMaterial: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., Premium Hass Avocado"
                    required
                  />
                </div>

                {/* Volume */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Volume to Process (kg)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={productionForm.volume}
                    onChange={(e) => setProductionForm({...productionForm, volume: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., 4500"
                    required
                  />
                </div>

                {/* Recovery Rate */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Zap className="inline w-4 h-4 mr-1" />
                    Recovery Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={productionForm.recoveryRate}
                    onChange={(e) => setProductionForm({...productionForm, recoveryRate: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., 18.5"
                    required
                  />
                </div>

                {/* Active Days */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="inline w-4 h-4 mr-1" />
                    Active Processing Days
                  </label>
                  <select
                    value={productionForm.activeDays}
                    onChange={(e) => setProductionForm({...productionForm, activeDays: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    {[1, 2, 3, 4, 5, 6, 7].map(day => (
                      <option key={day} value={day}>{day} day{day > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>

                {/* Projected Oil (Calculated) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Projected Oil Recovery (kg)
                  </label>
                  <div className="w-full px-4 py-3 bg-green-50 border-2 border-green-200 rounded-lg text-green-700 font-semibold">
                    {productionForm.volume && productionForm.recoveryRate
                      ? (parseFloat(productionForm.volume) * parseFloat(productionForm.recoveryRate) / 100).toFixed(2)
                      : '0.00'
                    } kg
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-800 transition-colors shadow-lg"
                >
                  <Save className="w-5 h-5" />
                  <span>Add Production Data</span>
                </button>
              </div>
            </form>
          )}

          {/* Purchase Order Entry Form */}
          {activeTab === 'po' && (
            <form onSubmit={handlePOSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Client Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client Name
                  </label>
                  <input
                    type="text"
                    value={poForm.clientName}
                    onChange={(e) => setPoForm({...poForm, clientName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Global Foods Ltd."
                    required
                  />
                </div>

                {/* PO Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PO Number
                  </label>
                  <input
                    type="text"
                    value={poForm.poNumber}
                    onChange={(e) => setPoForm({...poForm, poNumber: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., PO-2024-001"
                    required
                  />
                </div>

                {/* Products */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Products
                  </label>
                  <input
                    type="text"
                    value={poForm.products}
                    onChange={(e) => setPoForm({...poForm, products: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Premium Avocado Oil 500ml"
                    required
                  />
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PO Quantity (kg)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={poForm.quantity}
                    onChange={(e) => setPoForm({...poForm, quantity: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., 2500"
                    required
                  />
                </div>

                {/* Dispatch Date */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Projected Dispatch Date
                  </label>
                  <input
                    type="date"
                    value={poForm.dispatchDate}
                    onChange={(e) => setPoForm({...poForm, dispatchDate: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-purple-800 transition-colors shadow-lg"
                >
                  <Save className="w-5 h-5" />
                  <span>Add Purchase Order</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}