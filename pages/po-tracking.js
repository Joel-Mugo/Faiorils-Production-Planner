import React, { useState, useEffect } from "react";
import { Truck, ClipboardList, CheckCircle, Clock } from "lucide-react";
import { getPOData, addPOData } from "../utils/dataStore";

export default function POTracking() {
  const [poData, setPOData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    poNumber: "",
    supplier: "",
    material: "",
    quantity: "",
    eta: "",
    status: "Pending",
  });

  useEffect(() => {
    setPOData(getPOData());
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    addPOData({ ...formData, id: Date.now() });
    setPOData(getPOData());
    setFormData({ poNumber: "", supplier: "", material: "", quantity: "", eta: "", status: "Pending" });
    setShowForm(false);
  };

  return (
    <div className="max-w-full mx-auto space-y-6 fade-in">
      {/* Page Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-between flex-wrap gap-4 card-hover slide-up">
        <div className="flex items-center space-x-3">
          <div className="bg-purple-100 p-3 rounded-lg shadow pulse-slow">
            <Truck className="w-8 h-8 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">PO Tracking</h1>
            <p className="text-gray-600">Track supplier purchase orders and their delivery status</p>
          </div>
        </div>

        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center space-x-2">
          <ClipboardList className="w-5 h-5" />
          <span>Add PO</span>
        </button>
      </div>

      {/* Add PO Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 card-hover slide-up">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Purchase Order</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["poNumber", "supplier", "material", "quantity", "eta"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field === "poNumber" ? "PO Number" : field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type={field === "quantity" ? "number" : field === "eta" ? "date" : "text"}
                  value={formData[field]}
                  onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="form-input"
              >
                <option value="Pending">Pending</option>
                <option value="In Transit">In Transit</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>

            <div className="flex items-end">
              <button type="submit" className="btn-primary flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>Save PO</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* PO Table */}
      <div className="bg-white rounded-xl shadow-lg p-6 card-hover slide-up">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Purchase Orders</h2>
        {poData.length === 0 ? (
          <p className="text-gray-600">No purchase orders found. Add one to begin.</p>
        ) : (
          <div className="table-responsive">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  {["PO Number", "Supplier", "Material", "Quantity", "ETA", "Status"].map((h) => (
                    <th key={h} className="px-4 py-3 text-sm font-semibold text-gray-700">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {poData.map((po, idx) => (
                  <tr
                    key={po.id}
                    className="hover:bg-gray-50 border-b last:border-0 slide-up"
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <td className="px-4 py-3 text-gray-800">{po.poNumber}</td>
                    <td className="px-4 py-3 text-gray-800">{po.supplier}</td>
                    <td className="px-4 py-3 text-gray-800">{po.material}</td>
                    <td className="px-4 py-3 text-gray-800">{po.quantity}</td>
                    <td className="px-4 py-3 text-gray-800">{po.eta}</td>
                    <td className="px-4 py-3 text-gray-800">
                      {po.status === "Delivered" && <CheckCircle className="w-4 h-4 text-green-600 inline mr-1" />}
                      {po.status === "In Transit" && <Clock className="w-4 h-4 text-yellow-600 inline mr-1" />}
                      {po.status}
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
