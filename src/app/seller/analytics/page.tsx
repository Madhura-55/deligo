'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Package,
  Download,
  ArrowUp,
  ArrowDown,
  Activity,
  AlertTriangle,
  BarChart3,
  Calendar,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  ComposedChart,
} from 'recharts';

interface DashboardMetrics {
  totalOrders: number;
  totalRevenue: number;
  activeListings: number;
  pendingOrders: number;
  averageRating: number;
}

interface TopProduct {
  _id: string;
  name: string;
  totalSales: number;
  revenue: number;
  orderCount: number;
  price: number;
}

interface StockAlert {
  product_id: string;
  name: string;
  current_stock: number;
  predicted_demand_7d: number;
  shortfall: number;
}

interface ForecastProduct {
  product_id: string;
  name: string;
  current_stock: number;
  price: number;
  history: { date: string; historical_demand: number }[];
  forecasts: { date: string; predicted_demand: number }[];
  total_predicted_demand: number;
}

interface RevenueTrendItem {
  date: string;
  revenue: number;
  orders: number;
}

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [stockAlerts, setStockAlerts] = useState<StockAlert[]>([]);
  const [forecastProducts, setForecastProducts] = useState<ForecastProduct[]>([]);
  const [revenueTrend, setRevenueTrend] = useState<RevenueTrendItem[]>([]);
  const [selectedForecastProduct, setSelectedForecastProduct] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [forecastLoading, setForecastLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30');

  // Helper: fetch with timeout
  const fetchWithTimeout = (url: string, timeoutMs = 30000) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    return fetch(url, { signal: controller.signal }).finally(() => clearTimeout(timer));
  };

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);

      // Fast endpoints first — these should never hang
      const [metricsRes, productsRes, trendRes] = await Promise.all([
        fetch('/api/seller/dashboard'),
        fetch(`/api/seller/analytics?type=top-products&limit=10`),
        fetch(`/api/seller/analytics?type=revenue-trend&days=${dateRange}`),
      ]);

      const parseJSON = async (response: Response, defaultValue: unknown = null) => {
        if (!response.ok) return { success: false, data: defaultValue };
        try {
          return await response.json();
        } catch {
          return { success: false, data: defaultValue };
        }
      };

      const [metricsData, productsData, trendData] = await Promise.all([
        parseJSON(metricsRes, null),
        parseJSON(productsRes, []),
        parseJSON(trendRes, []),
      ]);

      if (metricsData.success) {
        const data = metricsData.data?.metrics || metricsData.data;
        setMetrics({
          totalOrders: data?.totalOrders || 0,
          totalRevenue: data?.totalRevenue || 0,
          activeListings: data?.activeListings || 0,
          pendingOrders: data?.pendingOrders || 0,
          averageRating: data?.averageRating || 0,
        });
      }

      if (productsData.success) {
        setTopProducts(productsData.data || []);
      }

      if (trendData.success && trendData.data) {
        setRevenueTrend(trendData.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }

    // Slow demand server calls — fire separately so they don't block the page
    try {
      const alertsRes = await fetchWithTimeout('/api/seller/demand?action=alerts&days=7', 30000);
      if (alertsRes.ok) {
        const alertsData = await alertsRes.json();
        if (alertsData.alerts) {
          setStockAlerts(alertsData.alerts);
        }
      }
    } catch {
      console.warn('Alerts fetch timed out or failed');
    }
  }, [dateRange]);

  // Fetch demand forecasts separately (slower)
  const fetchForecasts = useCallback(async () => {
    try {
      setForecastLoading(true);
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 60000); // 60s for forecasts
      const res = await fetch('/api/seller/demand?action=all-forecasts&days=14&limit=100', { signal: controller.signal });
      clearTimeout(timer);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setForecastProducts(data.data);
        }
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.warn('Forecast fetch timed out');
      } else {
        console.error('Error fetching forecasts:', error);
      }
    } finally {
      setForecastLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
    fetchForecasts();
  }, [fetchAnalytics, fetchForecasts]);

  // Build chart data for selected forecast product
  const buildForecastChartData = (product: ForecastProduct) => {
    const combined = new Map<string, any>();

    product.history.forEach((h) => {
      combined.set(h.date, { date: h.date, actual: h.historical_demand });
    });

    product.forecasts.forEach((f) => {
      if (combined.has(f.date)) {
        combined.get(f.date).predicted = f.predicted_demand;
      } else {
        combined.set(f.date, { date: f.date, predicted: f.predicted_demand });
      }
    });

    const sorted = Array.from(combined.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Connect the actual line to predicted line at the junction point
    const lastActualIdx = sorted.findLastIndex((d: any) => d.actual !== undefined);
    if (lastActualIdx >= 0 && lastActualIdx < sorted.length - 1) {
      sorted[lastActualIdx].predicted = sorted[lastActualIdx].actual;
    }

    return sorted;
  };

  // Find peak demand days
  const getPeakDemandInsights = (product: ForecastProduct) => {
    if (!product.forecasts.length) return [];

    const sorted = [...product.forecasts].sort((a, b) => b.predicted_demand - a.predicted_demand);
    return sorted.slice(0, 3).map((f) => {
      const date = new Date(f.date);
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return {
        date: f.date,
        dayName: dayNames[date.getDay()],
        demand: f.predicted_demand,
      };
    });
  };

  // Get day-of-week pattern from history
  const getDayOfWeekPattern = (product: ForecastProduct) => {
    const dayTotals: Record<string, { total: number; count: number }> = {};
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    product.history.forEach((h) => {
      const day = dayNames[new Date(h.date).getDay()];
      if (!dayTotals[day]) dayTotals[day] = { total: 0, count: 0 };
      dayTotals[day].total += h.historical_demand;
      dayTotals[day].count += 1;
    });

    return dayNames.map((d) => ({
      day: d,
      avgDemand: dayTotals[d] ? parseFloat((dayTotals[d].total / dayTotals[d].count).toFixed(1)) : 0,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const selectedProduct = forecastProducts[selectedForecastProduct];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics & Demand Forecasting</h1>
              <p className="text-gray-600 mt-1">Track performance, trends & AI-powered demand predictions</p>
            </div>
            <div className="flex gap-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </select>
              <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex items-center text-green-600 text-sm font-semibold">
                <ArrowUp className="w-4 h-4 mr-1" />
                12%
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Total Revenue</h3>
            <p className="text-3xl font-bold text-gray-900">
              ₹{(metrics?.totalRevenue || 0).toLocaleString()}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex items-center text-green-600 text-sm font-semibold">
                <ArrowUp className="w-4 h-4 mr-1" />
                8%
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Total Orders</h3>
            <p className="text-3xl font-bold text-gray-900">{metrics?.totalOrders || 0}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Active Products</h3>
            <p className="text-3xl font-bold text-gray-900">{metrics?.activeListings || 0}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Pending Orders</h3>
            <p className="text-3xl font-bold text-gray-900">{metrics?.pendingOrders || 0}</p>
          </div>
        </div>

        {/* Revenue Trend Chart */}
        {revenueTrend.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <BarChart3 className="w-5 h-5 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Revenue & Orders Trend</h2>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={revenueTrend} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: '#6b7280' }}
                    tickFormatter={(val) => {
                      const d = new Date(val);
                      return `${d.getMonth() + 1}/${d.getDate()}`;
                    }}
                  />
                  <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#6b7280' }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#6b7280' }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '10px',
                      border: 'none',
                      boxShadow: '0 4px 12px rgb(0 0 0 / 0.1)',
                    }}
                    formatter={(value: any, name: string) => [
                      name === 'revenue' ? `₹${value.toLocaleString()}` : value,
                      name === 'revenue' ? 'Revenue' : 'Orders',
                    ]}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="revenue" name="Revenue (₹)" fill="#3b82f6" radius={[4, 4, 0, 0]} opacity={0.8} />
                  <Line yAxisId="right" type="monotone" dataKey="orders" name="Orders" stroke="#f59e0b" strokeWidth={2} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ============== DEMAND FORECASTING SECTION ============== */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-lg p-6 mb-8 text-white">
          <div className="mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <Activity className="w-6 h-6 text-green-400 mr-3" />
              AI Demand Forecasting
            </h2>
            <p className="text-slate-400 mt-1">XGBoost ML model — 90-day history vs 14-day prediction</p>
          </div>

          {forecastLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-10 h-10 border-4 border-green-400 border-t-transparent rounded-full animate-spin mr-4"></div>
              <p className="text-slate-400">Running AI predictions on your products...</p>
            </div>
          ) : selectedProduct ? (
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Product Navigation Sidebar */}
              <div className="lg:w-1/4 bg-slate-800/50 rounded-xl border border-slate-700 p-4 flex flex-col h-[600px]">
                <h3 className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">Top Forecasted Items</h3>
                <div className="overflow-y-auto pr-2 space-y-2 flex-1 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
                  {[...forecastProducts]
                    .sort((a, b) => b.total_predicted_demand - a.total_predicted_demand)
                    .map((p) => {
                      const idx = forecastProducts.findIndex((x) => x.product_id === p.product_id);
                      const isSelected = selectedForecastProduct === idx;
                      return (
                        <button
                          key={p.product_id}
                          onClick={() => setSelectedForecastProduct(idx)}
                          className={`w-full text-left p-3 rounded-xl transition-all border ${
                            isSelected
                              ? 'bg-slate-700 border-green-500/50 shadow-md'
                              : 'bg-transparent border-transparent hover:bg-slate-700/50 hover:border-slate-600'
                          }`}
                        >
                          <div className="text-sm font-medium text-white truncate">{p.name}</div>
                          <div className="flex justify-between items-center mt-1.5">
                            <span className="text-xs text-slate-400">
                              Demand: <span className="text-green-400 font-bold">{Math.round(p.total_predicted_demand)}</span>
                            </span>
                            {p.total_predicted_demand > p.current_stock && (
                              <span title="Expected Shortfall">
                                <AlertTriangle className="w-4 h-4 text-red-400" />
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* Main Content Area */}
              <div className="lg:w-3/4 flex flex-col">
                {/* Forecast Chart */}
                <div className="bg-slate-800/50 rounded-xl p-4 mb-6 border border-slate-700 flex-1 min-h-[350px]">
                <h3 className="text-sm font-medium text-slate-400 mb-3">
                  Demand Trend — <span className="text-white font-semibold">{selectedProduct.name}</span>
                </h3>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={buildForecastChartData(selectedProduct)}
                      margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                    >
                      <defs>
                        <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="predictedGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 11, fill: '#94a3b8' }}
                        tickFormatter={(val) => {
                          const d = new Date(val);
                          return `${d.getMonth() + 1}/${d.getDate()}`;
                        }}
                      />
                      <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1e293b',
                          borderRadius: '10px',
                          border: '1px solid #334155',
                          color: '#fff',
                        }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="actual"
                        name="Actual Sales (History)"
                        stroke="#3b82f6"
                        strokeWidth={2.5}
                        fill="url(#actualGrad)"
                        dot={false}
                        activeDot={{ r: 5, fill: '#3b82f6' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="predicted"
                        name="AI Predicted Demand"
                        stroke="#22c55e"
                        strokeWidth={2.5}
                        strokeDasharray="6 3"
                        fill="url(#predictedGrad)"
                        dot={false}
                        activeDot={{ r: 5, fill: '#22c55e' }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Insights Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Peak Demand Days */}
                <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
                  <h4 className="text-sm font-medium text-slate-400 mb-3 flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-orange-400" />
                    Peak Demand Days (Next 14 Days)
                  </h4>
                  <div className="space-y-2">
                    {getPeakDemandInsights(selectedProduct).map((insight, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div>
                          <p className="text-white text-sm font-medium">{insight.dayName}</p>
                          <p className="text-slate-500 text-xs">{insight.date}</p>
                        </div>
                        <span className="text-orange-400 font-bold text-lg">
                          {Math.round(insight.demand)} <span className="text-xs text-slate-500">units</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Weekly Pattern */}
                <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
                  <h4 className="text-sm font-medium text-slate-400 mb-3 flex items-center">
                    <BarChart3 className="w-4 h-4 mr-2 text-purple-400" />
                    Day-of-Week Buying Pattern
                  </h4>
                  <div className="h-36">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getDayOfWeekPattern(selectedProduct)}>
                        <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                        <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1e293b',
                            border: '1px solid #334155',
                            borderRadius: '8px',
                            color: '#fff',
                          }}
                        />
                        <Bar dataKey="avgDemand" name="Avg Daily Demand" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Stock Status */}
                <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
                  <h4 className="text-sm font-medium text-slate-400 mb-3 flex items-center">
                    <Package className="w-4 h-4 mr-2 text-cyan-400" />
                    Stock vs Predicted Demand
                  </h4>
                  <div className="space-y-4 mt-2">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">Current Stock</span>
                        <span className="text-white font-bold">{selectedProduct.current_stock} units</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-3">
                        <div
                          className="bg-cyan-400 h-3 rounded-full transition-all"
                          style={{
                            width: `${Math.min(100, (selectedProduct.current_stock / Math.max(selectedProduct.current_stock, selectedProduct.total_predicted_demand)) * 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">14-Day Predicted Demand</span>
                        <span className="text-white font-bold">{Math.round(selectedProduct.total_predicted_demand)} units</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all ${
                            selectedProduct.total_predicted_demand > selectedProduct.current_stock
                              ? 'bg-red-500'
                              : 'bg-green-500'
                          }`}
                          style={{
                            width: `${Math.min(100, (selectedProduct.total_predicted_demand / Math.max(selectedProduct.current_stock, selectedProduct.total_predicted_demand)) * 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    {selectedProduct.total_predicted_demand > selectedProduct.current_stock && (
                      <div className="bg-red-500/20 text-red-300 rounded-lg p-3 text-sm border border-red-500/30">
                        <AlertTriangle className="w-4 h-4 inline mr-1" />
                        Shortfall of <strong>{Math.round(selectedProduct.total_predicted_demand - selectedProduct.current_stock)}</strong> units expected!
                      </div>
                    )}
                    {selectedProduct.total_predicted_demand <= selectedProduct.current_stock && (
                      <div className="bg-green-500/20 text-green-300 rounded-lg p-3 text-sm border border-green-500/30">
                        ✅ Stock is sufficient for the next 14 days.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Detailed Forecast Table */}
              <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
                <div className="p-4 border-b border-slate-700">
                  <h4 className="text-sm font-medium text-slate-300">Daily Forecast Breakdown</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Date</th>
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Day</th>
                        <th className="text-right py-3 px-4 text-slate-400 font-medium">Predicted Demand</th>
                        <th className="text-right py-3 px-4 text-slate-400 font-medium">Demand Level</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedProduct.forecasts.map((f, i) => {
                        const date = new Date(f.date);
                        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                        const avgDemand =
                          selectedProduct.forecasts.reduce((sum, x) => sum + x.predicted_demand, 0) /
                          selectedProduct.forecasts.length;
                        const isHigh = f.predicted_demand > avgDemand * 1.2;
                        const isLow = f.predicted_demand < avgDemand * 0.8;

                        return (
                          <tr key={i} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                            <td className="py-3 px-4 text-white">{f.date}</td>
                            <td className="py-3 px-4 text-slate-300">{dayNames[date.getDay()]}</td>
                            <td className="py-3 px-4 text-right text-white font-medium">
                              {Math.round(f.predicted_demand)} units
                            </td>
                            <td className="py-3 px-4 text-right">
                              {isHigh && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-500/20 text-orange-300">
                                  <ArrowUp className="w-3 h-3 mr-1" />
                                  High
                                </span>
                              )}
                              {isLow && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300">
                                  <ArrowDown className="w-3 h-3 mr-1" />
                                  Low
                                </span>
                              )}
                              {!isHigh && !isLow && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-600/50 text-slate-300">
                                  Normal
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          ) : (
            <div className="text-center py-16 text-slate-400">
              <Activity className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>No forecast data available. Ensure the demand prediction server is running.</p>
            </div>
          )}
        </div>

        {/* AI Inventory Alerts */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-red-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <span className="bg-red-100 text-red-600 p-1.5 rounded-lg mr-2">
                  <AlertTriangle className="w-5 h-5" />
                </span>
                AI Inventory Alerts
              </h2>
              <p className="text-sm text-gray-500 mt-1">Products where predicted 7-day demand exceeds current stock</p>
            </div>
          </div>

          {(stockAlerts || []).length === 0 ? (
            <div className="text-center py-8 text-gray-500 bg-green-50 rounded-lg border border-green-100">
              <Package className="w-10 h-10 mx-auto mb-2 text-green-400" />
              <p className="text-green-700 font-medium">Inventory levels look healthy!</p>
              <p className="text-green-600 text-sm">No expected shortfalls in the next 7 days.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Product</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Current Stock</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">7-Day Predicted Demand</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-red-600">Expected Shortfall</th>
                  </tr>
                </thead>
                <tbody>
                  {(stockAlerts || []).map((alert) => (
                    <tr key={alert.product_id} className="border-b border-gray-100 hover:bg-red-50 transition-colors">
                      <td className="py-4 px-4">
                        <p className="font-medium text-gray-900">{alert.name}</p>
                      </td>
                      <td className="py-4 px-4 text-right text-gray-700 font-medium">{alert.current_stock}</td>
                      <td className="py-4 px-4 text-right text-gray-700">{Math.round(alert.predicted_demand_7d)}</td>
                      <td className="py-4 px-4 text-right">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          -{Math.round(alert.shortfall)} units
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Selling Products</h2>
          {(topProducts || []).length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No sales data available yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Rank</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Product</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Orders</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Units Sold</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {(topProducts || []).map((product, index) => (
                    <tr key={product._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                            index === 0
                              ? 'bg-yellow-500'
                              : index === 1
                                ? 'bg-gray-400'
                                : index === 2
                                  ? 'bg-amber-600'
                                  : 'bg-gray-300'
                          }`}
                        >
                          {index + 1}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-medium text-gray-900">{product.name}</p>
                      </td>
                      <td className="py-4 px-4 text-right text-gray-700">{product.orderCount || 0}</td>
                      <td className="py-4 px-4 text-right text-gray-700">{product.totalSales || 0}</td>
                      <td className="py-4 px-4 text-right">
                        <span className="font-semibold text-green-600">
                          ₹{(product.revenue || 0).toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
