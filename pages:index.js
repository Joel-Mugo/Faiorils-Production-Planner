// pages/index.js
import React, { useState, useMemo, useEffect } from 'react';
import { Calendar, Factory, Droplets, TrendingUp, AlertCircle, CheckCircle, Clock, Zap } from 'lucide-react';
import { getProductionData, getFactories, getCurrentWeek } from '../utils/dataStore';

export default function ProductionDashboard() {
  const [selectedFactory, setSelectedFactory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [productionData, setProductionData] = useState([]);
  const [factories, setFactories] = useState([]);

  useEffect(() => {
    // Load data from store
    setProductionData(getProductionData());
    setFactories(getFactories());
  }, []);

  const currentWeek = getCurrentWeek();

  // Group production data by factory and week
  const groupedData = useMemo(() => {
    const grouped = {};
    
    productionData.forEach(entry => {
      const factoryId = entry.factoryName.toLowerCase().replace(/\s+/g, '-');
      if (!grouped[factoryId]) {
        grouped[factoryId] = {
          factoryId,
          factoryName: entry.factoryName,
          weeks: {}
        };
      }
      
      const weekKey = entry.weekNumber;
      if (!grouped[factoryId].weeks[weekKey]) {
        grouped[factoryId].weeks[weekKey] = {
          week: parseInt(entry.weekNumber),
          entries: [],
          totalRawMaterial: 0,
          totalProjectedOil: 0,
          activeDays: entry.activeDays
        };
      }
      
      grouped[factoryId].weeks[weekKey].entries.push(entry);
      grouped[factoryId].weeks[weekKey].totalRawMaterial += parseFloat(entry.volume);
      grouped[factoryId].weeks[weekKey].totalProjectedOil += parseFloat(entry.projectedOil);
    });

    // Convert to array format and sort weeks
    return Object.values(grouped).map(factory => ({
      ...factory,
      weeks: Object.values(factory.weeks).sort((a, b) => a.week - b.week)
    }));
  }, [productionData]);

  const filteredData = selectedFactory === 'all' 
    ? groupedData 
    : groupedData.filter(d => d.factoryId === selectedFactory);

  const weeklyTotals = useMemo(() => {
    const totals = {};
    groupedData.forEach(factory => {
      factory.weeks.forEach(week => {
        if (!totals[week.week]) {
          totals[week.week] = { rawMaterial: 0, projectedOil: 0, activeFactories: 0 };
        }
        totals[week.week].rawMaterial += week.totalRawMaterial;
        totals[week.week].projectedOil += week.totalProjectedOil;
        totals[week.week].activeFactories += 1;
      });
    });
    return totals;
  }, [groupedData]);

  const calculateEfficiency = (factory, week) => {
    const factoryInfo = factories.find(f => f.name === factory.factoryName);
    if (!factoryInfo) return 0;
    
    const totalCapacity = factoryInfo.dailyCapacity * week.activeDays;
    return (week.totalRawMaterial / totalCapacity) * 100;
  };

  const getStatusColor = (efficiency) => {
    if (efficiency >= 90) return 'bg-red-50 border-red-200';
    if (efficiency >= 70) return 'bg-yellow-50 border-yellow-200';
    if (efficiency >= 40) return 'bg-green-50 border-green-200';
    return 'bg-blue-50 border-blue-200';
  };

  const getStatusIcon = (efficiency) => {
    if (efficiency >= 90) return <AlertCircle className="w-4 h-4 text-red-500" />;
    if (efficiency >= 70) return <Clock className="w-4 h-4 text-yellow-500" />;
    return <CheckCircle className="w-4 h-4 text-green-500" />;
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(Math.round(num));
  };

  if (productionData.length === 0) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <Factory className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Production Data Available</h2>
          <p className="text-gray-600 mb-6">Start by adding production schedules in the Data Entry page.</p>
          <a
            href="/data-entry"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-800 transition-colors"
          >
            <span>Go to Data Entry</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto">
      {/* Page Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Production Planning Dashboard</h1>
              <p className="text-gray-600">Real-time factory capacity utilization and oil recovery projections</p>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <select
              value={selectedFactory}
              onChange={(e) => setSelectedFactory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Factories</option>
              {factories.map(factory => (
                <option key={factory.id} value={factory.name.toLowerCase().replace(/\s+/g, '-')}>{factory.name}</option>
              ))}
            </select>
            
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-gray-900 shadow' : 'text-gray-600'
                }`}
              >
                Grid View
              </button>
              <button
                onClick={() => setViewMode('timeline')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  viewMode === 'timeline' ? 'bg-white text-gray-900 shadow' : 'text-gray-600'
                }`}
              >
                Timeline
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        {Object.entries(weeklyTotals).slice(0, 5).map(([week, data]) => (
          <div key={week} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-700">Week {week}</h3>
              <Calendar className="w-4 h-4 text-gray-400" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Raw Material:</span>
                <span className="font-medium">{formatNumber(data.rawMaterial)} kg</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Projected Oil:</span>
                <span className="font-medium text-green-600">{formatNumber(data.projectedOil)} kg</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Active:</span>
                <span className="font-medium">{data.activeFactories} factories</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Production Grid */}
      {viewMode === 'grid' && (
        <div className="space-y-6">
          {filteredData.map(factory => (
            <div key={factory.factoryId} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Factory className="w-6 h-6" />
                    <div>
                      <h2 className="text-xl font-bold">{factory.factoryName}</h2>
                      <p className="text-blue-100">
                        Daily Capacity: {factories.find(f => f.name === factory.factoryName)?.dailyCapacity || 'N/A'} kg/day
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {formatNumber(factory.weeks.reduce((sum, w) => sum + w.totalProjectedOil, 0))} kg
                    </div>
                    <div className="text-blue-100">Total Projected Oil</div>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {factory.weeks.map(week => {
                    const efficiency = calculateEfficiency(factory, week);
                    return (
                      <div key={week.week} className={`border-2 rounded-lg p-4 ${getStatusColor(efficiency)}`}>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-gray-700">Week {week.week}</h3>
                          {getStatusIcon(efficiency)}
                        </div>
                        
                        <div className="space-y-3">
                          <div className="bg-white rounded p-3">
                            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Raw Materials</div>
                            {week.entries.map((entry, idx) => (
                              <div key={idx} className="mb-2">
                                <div className="text-sm font-medium text-gray-800">{entry.rawMaterial}</div>
                                <div className="text-xs text-gray-600">{formatNumber(entry.volume)} kg</div>
                              </div>
                            ))}
                            <div className="border-t pt-2 mt-2">
                              <div className="text-lg font-bold text-gray-800">Total: {formatNumber(week.totalRawMaterial)} kg</div>
                            </div>
                          </div>
                          
                          <div className="bg-white rounded p-3">
                            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Projected Oil</div>
                            <div className="flex items-center space-x-2">
                              <Droplets className="w-4 h-4 text-green-500" />
                              <span className="text-lg font-bold text-green-600">{formatNumber(week.totalProjectedOil)} kg</span>
                            </div>
                            <div className="text-xs text-gray-600">
                              {((week.totalProjectedOil / week.totalRawMaterial) * 100).toFixed(1)}% overall yield
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div className="text-center">
                              <div className="text-xs text-gray-500">Active Days</div>
                              <div className="text-sm font-medium">{week.activeDays} days</div>
                            </div>
                            
                            <div className="text-right">
                              <div className="text-xs text-gray-500">Capacity Usage</div>
                              <div className={`text-sm font-medium ${
                                efficiency >= 90 ? 'text-red-600' :
                                efficiency >= 70 ? 'text-yellow-600' :
                                'text-green-600'
                              }`}>
                                {efficiency.toFixed(1)}%
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Timeline View */}
      {viewMode === 'timeline' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Factory</th>
                  {Object.keys(weeklyTotals).slice(0, 5).map(week => (
                    <th key={week} className="text-center py-3 px-4 font-semibold text-gray-700">
                      Week {week}
                    </th>
                  ))}
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Total Oil</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map(factory => (
                  <tr key={factory.factoryId} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <Factory className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-900">{factory.factoryName}</div>
                          <div className="text-sm text-gray-500">
                            {factories.find(f => f.name === factory.factoryName)?.dailyCapacity || 'N/A'} kg/day capacity
                          </div>
                        </div>
                      </div>
                    </td>
                    {factory.weeks.map(week => {
                      const efficiency = calculateEfficiency(factory, week);
                      return (
                        <td key={week.week} className="py-4 px-4 text-center">
                          <div className={`inline-block p-2 rounded-lg ${getStatusColor(efficiency)}`}>
                            <div className="text-sm font-medium">{formatNumber(week.totalRawMaterial)} kg</div>
                            <div className="text-xs text-green-600 font-medium">{formatNumber(week.totalProjectedOil)} kg</div>
                            <div className="flex justify-center mt-1">{getStatusIcon(efficiency)}</div>
                          </div>
                        </td>
                      );
                    })}
                    <td className="py-4 px-4 text-right">
                      <div className="text-lg font-bold text-green-600">
                        {formatNumber(factory.weeks.reduce((sum, w) => sum + w.totalProjectedOil, 0))} kg
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Footer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <Factory className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{filteredData.length}</div>
          <div className="text-sm text-gray-600">Active Factories</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">
            {formatNumber(Object.values(weeklyTotals).reduce((sum, week) => sum + week.rawMaterial, 0))}
          </div>
          <div className="text-sm text-gray-600">Total Raw Material (kg)</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <Droplets className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">
            {formatNumber(Object.values(weeklyTotals).reduce((sum, week) => sum + week.projectedOil, 0))}
          </div>
          <div className="text-sm text-gray-600">Projected Oil Output (kg)</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <Zap className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">
            {Object.values(weeklyTotals).length > 0 ?
              (Object.values(weeklyTotals).reduce((sum, week) => sum + week.projectedOil, 0) / 
               Object.values(weeklyTotals).reduce((sum, week) => sum + week.rawMaterial, 0) * 100).toFixed(1)
              : '0.0'
            }%
          </div>
          <div className="text-sm text-gray-600">Overall Recovery Rate</div>
        </div>
      </div>
    </div>
  );
}