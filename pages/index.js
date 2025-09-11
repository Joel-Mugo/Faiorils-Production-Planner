import React, { useState, useMemo, useEffect } from "react";
import {
  Calendar,
  Factory,
  Droplets,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  BarChart3,
} from "lucide-react";
import {
  getProductionData,
  getFactories,
  getCurrentWeek,
} from "../utils/dataStore";

export default function ProductionDashboard() {
  const [selectedFactory, setSelectedFactory] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [productionData, setProductionData] = useState([]);
  const [factories, setFactories] = useState([]);

  useEffect(() => {
    setProductionData(getProductionData());
    setFactories(getFactories());
  }, []);

  const currentWeek = getCurrentWeek();

  // Group data
  const groupedData = useMemo(() => {
    const grouped = {};
    productionData.forEach((entry) => {
      const factoryId = entry.factoryName.toLowerCase().replace(/\s+/g, "-");
      if (!grouped[factoryId]) {
        grouped[factoryId] = {
          factoryId,
          factoryName: entry.factoryName,
          weeks: {},
        };
      }
      const weekKey = entry.weekNumber;
      if (!grouped[factoryId].weeks[weekKey]) {
        grouped[factoryId].weeks[weekKey] = {
          week: parseInt(entry.weekNumber),
          entries: [],
          totalRawMaterial: 0,
          totalProjectedOil: 0,
          activeDays: entry.activeDays,
        };
      }
      grouped[factoryId].weeks[weekKey].entries.push(entry);
      grouped[factoryId].weeks[weekKey].totalRawMaterial += parseFloat(
        entry.volume
      );
      grouped[factoryId].weeks[weekKey].totalProjectedOil += parseFloat(
        entry.projectedOil
      );
    });
    return Object.values(grouped).map((factory) => ({
      ...factory,
      weeks: Object.values(factory.weeks).sort((a, b) => a.week - b.week),
    }));
  }, [productionData]);

  const filteredData =
    selectedFactory === "all"
      ? groupedData
      : groupedData.filter((d) => d.factoryId === selectedFactory);

  const weeklyTotals = useMemo(() => {
    const totals = {};
    groupedData.forEach((factory) => {
      factory.weeks.forEach((week) => {
        if (!totals[week.week]) {
          totals[week.week] = {
            rawMaterial: 0,
            projectedOil: 0,
            activeFactories: 0,
          };
        }
        totals[week.week].rawMaterial += week.totalRawMaterial;
        totals[week.week].projectedOil += week.totalProjectedOil;
        totals[week.week].activeFactories += 1;
      });
    });
    return totals;
  }, [groupedData]);

  const calculateEfficiency = (factory, week) => {
    const factoryInfo = factories.find((f) => f.name === factory.factoryName);
    if (!factoryInfo) return 0;
    const totalCapacity = factoryInfo.dailyCapacity * week.activeDays;
    return (week.totalRawMaterial / totalCapacity) * 100;
  };

  const getStatusColor = (efficiency) => {
    if (efficiency >= 90) return "bg-red-50 border-red-200";
    if (efficiency >= 70) return "bg-yellow-50 border-yellow-200";
    if (efficiency >= 40) return "bg-green-50 border-green-200";
    return "bg-blue-50 border-blue-200";
  };

  const getStatusIcon = (efficiency) => {
    if (efficiency >= 90) return <AlertCircle className="w-4 h-4 text-red-500" />;
    if (efficiency >= 70) return <Clock className="w-4 h-4 text-yellow-500" />;
    return <CheckCircle className="w-4 h-4 text-green-500" />;
  };

  const formatNumber = (num) =>
    new Intl.NumberFormat().format(Math.round(num));

  if (productionData.length === 0) {
    return (
      <div className="max-w-6xl mx-auto fade-in">
        <div className="bg-white rounded-xl shadow-lg p-12 text-center card-hover">
          <Factory className="w-16 h-16 text-gray-400 mx-auto mb-4 pulse-slow" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            No Production Data Available
          </h2>
          <p className="text-gray-600 mb-6">
            Start by adding production schedules in the Data Entry page.
          </p>
          <a
            href="/data-entry"
            className="btn-primary inline-flex items-center space-x-2"
          >
            <span>Add Data</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto space-y-6 fade-in">
      {/* Page Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-between flex-wrap gap-4 card-hover slide-up">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-3 rounded-lg shadow pulse-slow">
            <BarChart3 className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Production Planning Dashboard
            </h1>
            <p className="text-gray-600">
              Real-time capacity utilization and oil recovery projections
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <select
            value={selectedFactory}
            onChange={(e) => setSelectedFactory(e.target.value)}
            className="form-input"
          >
            <option value="all">All Factories</option>
            {factories.map((factory) => (
              <option
                key={factory.id}
                value={factory.name.toLowerCase().replace(/\s+/g, "-")}
              >
                {factory.name}
              </option>
            ))}
          </select>

          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === "grid"
                  ? "bg-white text-gray-900 shadow"
                  : "text-gray-600"
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode("timeline")}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === "timeline"
                  ? "bg-white text-gray-900 shadow"
                  : "text-gray-600"
              }`}
            >
              Timeline
            </button>
          </div>
        </div>
      </div>

      {/* Weekly Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(weeklyTotals)
          .slice(0, 4)
          .map(([week, data], idx) => (
            <div
              key={week}
              className="bg-white rounded-lg shadow-md p-6 text-center card-hover fade-in"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <h3 className="font-semibold text-gray-700 mb-2">
                Week {week}
              </h3>
              <div className="text-lg text-gray-800">
                {formatNumber(data.rawMaterial)} kg raw
              </div>
              <div className="text-lg text-green-600 font-bold">
                {formatNumber(data.projectedOil)} kg oil
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {data.activeFactories} active factories
              </div>
            </div>
          ))}
      </div>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="space-y-6">
          {filteredData.map((factory, idx) => (
            <div
              key={factory.factoryId}
              className="bg-white rounded-xl shadow-lg overflow-hidden card-hover slide-up"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Factory className="w-6 h-6" />
                    <div>
                      <h2 className="text-xl font-bold">
                        {factory.factoryName}
                      </h2>
                      <p className="text-blue-100 text-sm">
                        Daily Capacity:{" "}
                        {
                          factories.find(
                            (f) => f.name === factory.factoryName
                          )?.dailyCapacity
                        }{" "}
                        kg/day
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {formatNumber(
                        factory.weeks.reduce(
                          (sum, w) => sum + w.totalProjectedOil,
                          0
                        )
                      )}{" "}
                      kg
                    </div>
                    <div className="text-blue-100 text-sm">
                      Total Projected Oil
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                {factory.weeks.map((week, wIdx) => {
                  const efficiency = calculateEfficiency(factory, week);
                  return (
                    <div
                      key={week.week}
                      className={`border-2 rounded-lg p-4 card-hover fade-in ${getStatusColor(
                        efficiency
                      )}`}
                      style={{ animationDelay: `${wIdx * 0.1}s` }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-700">
                          Week {week.week}
                        </h3>
                        {getStatusIcon(efficiency)}
                      </div>
                      <div className="text-sm text-gray-600">
                        Raw: {formatNumber(week.totalRawMaterial)} kg
                      </div>
                      <div className="text-sm text-green-600 font-bold">
                        Oil: {formatNumber(week.totalProjectedOil)} kg
                      </div>
                      <div className="text-sm text-gray-500">
                        {week.activeDays} days active
                      </div>
                      <div
                        className={`text-sm font-medium ${
                          efficiency >= 90
                            ? "text-red-600"
                            : efficiency >= 70
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                      >
                        {efficiency.toFixed(1)}% capacity
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Timeline View */}
      {viewMode === "timeline" && (
        <div className="bg-white rounded-xl shadow-lg p-6 card-hover slide-up">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                    Factory
                  </th>
                  {Object.keys(weeklyTotals)
                    .slice(0, 5)
                    .map((week) => (
                      <th
                        key={week}
                        className="py-3 px-4 text-center text-sm font-semibold text-gray-700"
                      >
                        Week {week}
                      </th>
                    ))}
                  <th className="py-3 px-4 text-right text-sm font-semibold text-gray-700">
                    Total Oil
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((factory, fIdx) => (
                  <tr
                    key={factory.factoryId}
                    className="hover:bg-gray-50 border-b last:border-0 slide-up"
                    style={{ animationDelay: `${fIdx * 0.1}s` }}
                  >
                    <td className="py-4 px-4 font-medium text-gray-800">
                      {factory.factoryName}
                    </td>
                    {factory.weeks.map((week) => {
                      const efficiency = calculateEfficiency(factory, week);
                      return (
                        <td
                          key={week.week}
                          className="py-4 px-4 text-center text-gray-700"
                        >
                          <div className="inline-block p-2 rounded-lg border card-hover fade-in">
                            <div className="text-sm">
                              {formatNumber(week.totalRawMaterial)} kg
                            </div>
                            <div className="text-sm text-green-600 font-semibold">
                              {formatNumber(week.totalProjectedOil)} kg
                            </div>
                            <div className="flex justify-center mt-1">
                              {getStatusIcon(efficiency)}
                            </div>
                          </div>
                        </td>
                      );
                    })}
                    <td className="py-4 px-4 text-right font-bold text-green-600">
                      {formatNumber(
                        factory.weeks.reduce(
                          (sum, w) => sum + w.totalProjectedOil,
                          0
                        )
                      )}{" "}
                      kg
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Footer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6 text-center card-hover fade-in">
          <Factory className="w-8 h-8 text-blue-500 mx-auto mb-2 pulse-slow" />
          <div className="text-2xl font-bold text-gray-800">
            {filteredData.length}
          </div>
          <div className="text-sm text-gray-600">Active Factories</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center card-hover fade-in">
          <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2 pulse-slow" />
          <div className="text-2xl font-bold text-gray-800">
            {formatNumber(
              Object.values(weeklyTotals).reduce(
                (sum, week) => sum + week.rawMaterial,
                0
              )
            )}
          </div>
          <div className="text-sm text-gray-600">Total Raw Material (kg)</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center card-hover fade-in">
          <Droplets className="w-8 h-8 text-blue-500 mx-auto mb-2 pulse-slow" />
          <div className="text-2xl font-bold text-gray-800">
            {formatNumber(
              Object.values(weeklyTotals).reduce(
                (sum, week) => sum + week.projectedOil,
                0
              )
            )}
          </div>
          <div className="text-sm text-gray-600">
            Projected Oil Output (kg)
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center card-hover fade-in">
          <Zap className="w-8 h-8 text-green-500 mx-auto mb-2 pulse-slow" />
          <div className="text-2xl font-bold text-gray-800">
            {Object.values(weeklyTotals).length > 0
              ? (
                  (Object.values(weeklyTotals).reduce(
                    (sum, week) => sum + week.projectedOil,
                    0
                  ) /
                    Object.values(weeklyTotals).reduce(
                      (sum, week) => sum + week.rawMaterial,
                      0
                    )) *
                  100
                ).toFixed(1)
              : "0.0"}
            %
          </div>
          <div className="text-sm text-gray-600">Overall Recovery Rate</div>
        </div>
      </div>
    </div>
  );
}
