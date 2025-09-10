// README.md
# Fairoils Manufacturing Business Intelligence Platform

A comprehensive production planning, capacity management, and purchase order tracking system designed for oil manufacturing operations.

## 🌟 Features

### 📊 Production Planning Dashboard
- Real-time factory capacity utilization tracking
- Multi-week production scheduling visualization
- Oil recovery projections and yield analysis
- Efficiency monitoring with color-coded indicators
- Support for multiple raw materials per factory per week

### 📝 Data Entry System
- Intuitive forms for production schedule input
- Week-based planning with automatic date calculations
- Raw material and recovery rate tracking
- Active processing days configuration
- Real-time oil projection calculations

### 🚚 Purchase Order Tracking
- Client order management and tracking
- Quarterly dispatch planning
- Urgency-based color coding
- Advanced filtering and search capabilities
- Timeline and volume analytics

### 🎨 Design Features
- **Landscape-optimized layout** for large screens (TVs, monitors, laptops)
- **Dual company logos** in header
- **Professional dashboard design** with gradients and modern UI
- **Responsive components** that work across devices
- **Print-friendly** layouts for reports

## 🚀 Technology Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React State + Local Storage simulation
- **Deployment**: Optimized for Vercel

## 📱 Pages Overview

### 1. Data Entry Page (`/data-entry`)
- Production data input forms
- Purchase order entry
- Tab-based interface for different data types
- Form validation and success notifications

### 2. Production Dashboard (`/`)
- Main analytics dashboard
- Grid and timeline view modes
- Factory filtering and sorting
- Capacity utilization metrics
- Weekly summaries and projections

### 3. PO Tracking Page (`/po-tracking`)
- Purchase order management
- Client delivery tracking
- Quarterly analytics
- Search and filter functionality
- Dispatch timeline visualization

## 🏗️ Project Structure

```
oil-production-planner/
├── components/
│   └── Layout.js              # Main layout with header and navigation
├── pages/
│   ├── _app.js               # App wrapper with layout
│   ├── index.js              # Production dashboard
│   ├── data-entry.js         # Data input forms
│   └── po-tracking.js        # Purchase order tracking
├── utils/
│   └── dataStore.js          # In-memory data management
├── styles/
│   └── globals.css           # Global styles and utilities
├── package.json              # Dependencies and scripts
├── next.config.js            # Next.js configuration
└── tailwind.config.js        # Tailwind CSS configuration
```

## 📊 Data Models

### Production Data
```javascript
{
  factoryName: string,
  weekNumber: number,
  year: number,
  rawMaterial: string,
  volume: number,
  recoveryRate: number,
  activeDays: number,
  projectedOil: number (calculated),
  weekDates: { start: date, end: date },
  month: number,
  quarter: number
}
```

### Purchase Order Data
```javascript
{
  clientName: string,
  poNumber: string,
  products: string,
  quantity: number,
  dispatchDate: date,
  dispatchWeek: number,
  dispatchMonth: number,
  dispatchQuarter: number
}
```

### Factory Configuration
```javascript
{
  id: string,
  name: string,
  dailyCapacity: number (kg/day)
}
```

## 🎯 Business Intelligence Features

### Capacity Management
- **Daily capacity tracking** per factory
- **Efficiency calculations** based on active days
- **Color-coded alerts** for capacity utilization:
  - 🔴 Red (90%+): Over-utilized
  - 🟡 Yellow (70-89%): High utilization
  - 🟢 Green (40-69%): Optimal
  - 🔵 Blue (<40%): Under-utilized

### Production Analytics
- **Recovery rate monitoring** across materials
- **Weekly/monthly/quarterly** aggregations
- **Multi-product scheduling** per factory per week
- **Yield optimization** insights

### Order Management
- **Dispatch timeline** visualization
- **Client relationship** tracking
- **Quarterly planning** capabilities
- **Volume analytics** and trends

## 🚀 Deployment Instructions

### Quick Deploy to Vercel

1. **Create GitHub Repository**
   ```bash
   # Create new repo on GitHub
   # Upload all project files
   ```

2. **Deploy to Vercel**
   - Connect GitHub account to Vercel
   - Import the repository
   - Automatic deployment on every push

3. **Environment Setup**
   - No environment variables required for basic functionality
   - Ready to use immediately after deployment

### Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🔮 Future Enhancements

### Database Integration
- Replace in-memory storage with PostgreSQL/MySQL
- Add data persistence and user authentication
- Implement real-time data synchronization

### Advanced Features
- **Cost analysis** and profitability tracking
- **Inventory management** integration
- **Quality control** metrics
- **Supplier management** system
- **Export capabilities** (PDF, Excel, CSV)

### API Integration
- **ERP system** connectivity
- **IoT sensor** data integration
- **Third-party logistics** APIs
- **Financial system** integration

## 📈 Scalability Considerations

- **Modular architecture** for easy feature additions
- **Component-based design** for reusability
- **State management** ready for Redux/Context API
- **API-ready** structure for backend integration

## 🛡️ Security Features (Planned)

- User authentication and authorization
- Role-based access control
- Data encryption and secure APIs
- Audit logging and compliance reporting

## 📞 Support and Maintenance

This platform is designed for:
- **Manufacturing executives** requiring production insights
- **Operations managers** planning capacity and schedules
- **Sales teams** tracking client orders and deliveries
- **Business intelligence** analysts monitoring KPIs

## 📄 License

MIT License - Feel free to modify and extend for your business needs.

---

**Joel Built this with ❤️: For Fairoils manufacturing intelligence**
