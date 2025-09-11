import React, { useState, useEffect } from "react";
import { Plus, Save, Database } from "lucide-react";
import { getProductionData, addProductionData, getFactories } from "../utils/dataStore";

export default function DataEntry() {
  const [productionData, setProductionData] = useState([]);
  const [factories, setFactories] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    factoryId: "",
    week: "",
    year: new Date().getFullYear(),
    plannedVolume: "",
    actualVolume: "",
  });

  useEffect(() => {
    setProductionData(getProductionData());
    setFactories(getFactories());
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    addProductionData({
      ...formData,
      id: Date.now(),
    });
    setProductionData(getProductionData());
    setFormData({
      factoryId: "",
      week: "",
      year: new Date().getFullYear(),
      plannedVolume: "",
      actualVolume: "",
    });
    setShowForm(false);
  };

  const formatNumber = (num) =>
    new Intl.NumberFormat().format(Math.round(num));

  return (
    <div className="max-w-full mx-auto space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-between flex-wrap gap-4 card-hover">
        <div className="flex items-center space-x-3">
          <div className="bg-green-100 p-3 rounded-lg shadow">
            <Database className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Production Data Entry
            </h1>
            <p className="text-gray-600">
              Log planned and actual production volumes for each factory
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Entry</span>
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 card-hover">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Add New Production Record
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Factory
              </label>
              <select
                value={formData.factoryId}
                onChange={(e) =>
                  setFormData({ ...formData, factoryId: e.target.value })
                }
                className="form-input"
                required
              >
                <option value="">Select factory</option>
                {factories.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Week Number
              </label>
              <input
                type="number"
                value={formData.week}
                onChange={(e) =>
                  setFormData({ ...formData, week: e.target.value })
                }
                className="form-input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year
              </label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) =>
                  setFormData({ ...formData, year: e.target.value })
                }
                className="form-input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Planned Volume (kg)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.plannedVolume}
                onChange={(e) =>
                  setFormData({ ...formData, plannedVolume: e.target.value })
                }
                className="form-input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Actual Volume (kg)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.actualVolume}
                onChange={(e) =>
                  setFormData({ ...formData, actualVolume: e.target.value })
                }
                className="form-input"
                required
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="btn-primary flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Entry</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Production Data Table */}
      <div className="bg-white rounded-xl shadow-lg p-6 card-hover">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Production Records
        </h2>

        {productionData.length === 0 ? (
          <p className="text-gray-600">No records found. Add one to begin.</p>
        ) : (
          <div className="table-responsive">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                    Factory
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                    Week
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                    Year
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                    Planned (kg)
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                    Actual (kg)
                  </th>
                </tr>
              </thead>
              <tbody>
                {productionData.map((d) => (
                  <tr
                    key={d.id}
                    className="hover:bg-gray-50 border-b last:border-0"
                  >
                    <td className="px-4 py-3 text-gray-800">
                      {factories.find((f) => f.id === d.factoryId)?.name}
                    </td>
                    <td className="px-4 py-3 text-gray-800">{d.week}</td>
                    <td className="px-4 py-3 text-gray-800">{d.year}</td>
                    <td className="px-4 py-3 text-gray-800">
                      {formatNumber(d.plannedVolume)}
                    </td>
                    <td className="px-4 py-3 text-gray-800">
                      {formatNumber(d.actualVolume)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
