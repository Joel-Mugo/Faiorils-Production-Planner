// utils/dataStore.js
// Simple in-memory data store (in production, this would be replaced with a database)
let productionData = [];
let purchaseOrders = [];
let factories = [
  { id: 'factory-a', name: 'Athi River Factory - Kenya', dailyCapacity: 1000 },
  { id: 'factory-b', name: 'Lunga Lunga Factory - Kenya', dailyCapacity: 800 },
  { id: 'factory-c', name: 'Mt Kenya Factory - Kenya', dailyCapacity: 950 },
  { id: 'factory-d', name: 'Mara Factory - Kenya', dailyCapacity: 950 },
  { id: 'factory-e', name: 'Amani Factory - Tanzania', dailyCapacity: 950 },
  { id: 'factory-f', name: 'La Cite Factory - Madagascar', dailyCapacity: 950 },
  { id: 'factory-g', name: 'Fangato Factory - Madagascar', dailyCapacity: 650 }
];

export const getProductionData = () => productionData;
export const addProductionData = (data) => {
  productionData.push({ ...data, id: Date.now() });
  return productionData;
};

export const getPurchaseOrders = () => purchaseOrders;
export const addPurchaseOrder = (data) => {
  purchaseOrders.push({ ...data, id: Date.now() });
  return purchaseOrders;
};

export const getFactories = () => factories;

export const getWeekDates = (year, weekNumber) => {
  const firstDayOfYear = new Date(year, 0, 1);
  const daysOffset = (weekNumber - 1) * 7;
  const firstDayOfWeek = new Date(firstDayOfYear.getTime() + daysOffset * 24 * 60 * 60 * 1000);
  
  // Adjust to Monday as start of week
  const monday = new Date(firstDayOfWeek);
  monday.setDate(firstDayOfWeek.getDate() - firstDayOfWeek.getDay() + 1);
  
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  
  return {
    start: monday.toISOString().split('T')[0],
    end: sunday.toISOString().split('T')[0]
  };
};

export const getQuarter = (month) => {
  return Math.ceil(month / 3);
};

export const getCurrentWeek = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now - start;
  return Math.ceil(diff / (7 * 24 * 60 * 60 * 1000));
};