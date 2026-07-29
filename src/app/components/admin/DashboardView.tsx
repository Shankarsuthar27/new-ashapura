import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import {
  TrendingUp, Users, ShoppingBag, Globe,
  Tablet, Monitor, Smartphone, ArrowUpRight
} from 'lucide-react';
import { StoneSlab } from '../../data/stoneData';

interface DashboardViewProps {
  slabs: StoneSlab[];
  sampleRequestsCount: number;
}

const REVENUE_DATA = [
  { month: 'Jan', revenue: 420000, visitors: 12000 },
  { month: 'Feb', revenue: 510000, visitors: 15400 },
  { month: 'Mar', revenue: 680000, visitors: 19800 },
  { month: 'Apr', revenue: 620000, visitors: 17500 },
  { month: 'May', revenue: 890000, visitors: 24000 },
  { month: 'Jun', revenue: 1050000, visitors: 29000 },
  { month: 'Jul', revenue: 1250000, visitors: 34000 }
];

const COLORS = ['#C8A96A', '#3b82f6', '#10b981', '#a855f7', '#f59e0b', '#ec4899'];

export const DashboardView: React.FC<DashboardViewProps> = ({ slabs, sampleRequestsCount }) => {
  // Aggregate data for bar chart: slabs count by category
  const categoriesCount = React.useMemo(() => {
    const counts: Record<string, number> = {};
    slabs.forEach(s => {
      counts[s.category] = (counts[s.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [slabs]);

  // Aggregate data for pie chart: origin distribution
  const originData = React.useMemo(() => {
    const counts: Record<string, number> = {};
    slabs.forEach(s => {
      counts[s.origin] = (counts[s.origin] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [slabs]);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* KPI: Products */}
        <div className="bg-white dark:bg-[#131316] border border-gray-200 dark:border-gray-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-md relative overflow-hidden group hover:border-[#C8A96A]/40 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Products</span>
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-3 sm:mt-4 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold font-serif-luxury text-gray-900 dark:text-white">{slabs.length}</span>
            <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +12%
            </span>
          </div>
          <p className="text-[10px] text-gray-400 mt-1">Live atelier slabs</p>
        </div>

        {/* KPI: Active Categories */}
        <div className="bg-white dark:bg-[#131316] border border-gray-200 dark:border-gray-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-md relative overflow-hidden group hover:border-[#C8A96A]/40 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Categories</span>
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-3 sm:mt-4 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold font-serif-luxury text-gray-900 dark:text-white">{categoriesCount.length}</span>
            <span className="text-[10px] text-gray-400 font-bold">Stable</span>
          </div>
          <p className="text-[10px] text-gray-400 mt-1">Stone collection tags</p>
        </div>

        {/* KPI: Booking Boxes */}
        <div className="bg-white dark:bg-[#131316] border border-gray-200 dark:border-gray-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-md relative overflow-hidden group hover:border-[#C8A96A]/40 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Booking Boxes</span>
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-3 sm:mt-4 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold font-serif-luxury text-gray-900 dark:text-white">{sampleRequestsCount}</span>
            <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +24%
            </span>
          </div>
          <p className="text-[10px] text-gray-400 mt-1">Booking boxes requested</p>
        </div>

        {/* KPI: Visitors Analytics */}
        <div className="bg-white dark:bg-[#131316] border border-gray-200 dark:border-gray-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-md relative overflow-hidden group hover:border-[#C8A96A]/40 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Visitors</span>
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Users className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-3 sm:mt-4 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold font-serif-luxury text-gray-900 dark:text-white">34.2K</span>
            <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +18.4%
            </span>
          </div>
          <p className="text-[10px] text-gray-400 mt-1">Monthly active users</p>
        </div>
      </div>

      {/* Revenue & Visitors Charts Block */}
      <div className="bg-white dark:bg-[#131316] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <h3 className="font-serif-luxury text-xl font-bold">Revenue & Traffic Trends</h3>
            <p className="text-xs text-gray-500">Overview of client clicks, sample inquiries, and digital visitors</p>
          </div>
          <div className="flex gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#C8A96A]"/> Revenue (₹)</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"/> Visitors</span>
          </div>
        </div>
        <div className="h-56 sm:h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C8A96A" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#C8A96A" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorVis" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:hidden" />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1F2937" className="hidden dark:block" />
              <XAxis dataKey="month" stroke="#9CA3AF" fontSize={11} tickLine={false} />
              <YAxis yAxisId="left" stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
              <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#121215',
                  borderColor: '#C8A96A',
                  color: '#fff',
                  borderRadius: '12px',
                  fontSize: '12px'
                }}
              />
              <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#C8A96A" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" name="Revenue (₹)" />
              <Area yAxisId="right" type="monotone" dataKey="visitors" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorVis)" name="Visitors" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two-Column Detail Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Category Shares */}
        <div className="bg-white dark:bg-[#131316] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <h4 className="font-serif-luxury text-lg font-bold mb-6">Inventory by Stone Category</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoriesCount}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:hidden" vertical={false} />
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" className="hidden dark:block" vertical={false} />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} tickLine={false} />
                <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#121215',
                    borderColor: '#C8A96A',
                    color: '#fff',
                    borderRadius: '12px'
                  }}
                />
                <Bar dataKey="value" fill="#C8A96A" radius={[6, 6, 0, 0]}>
                  {categoriesCount.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Quarry Origin Distribution */}
        <div className="bg-white dark:bg-[#131316] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <h4 className="font-serif-luxury text-lg font-bold mb-6">Global Quarry Origins</h4>
          <div className="h-64 flex flex-col sm:flex-row items-center justify-between">
            <div className="h-full w-full sm:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={originData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {originData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#121215',
                      borderColor: '#C8A96A',
                      color: '#fff',
                      borderRadius: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2.5 w-full sm:w-1/2 px-4">
              {originData.map((entry, index) => (
                <div key={entry.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-gray-600 dark:text-gray-400 truncate max-w-[120px]">{entry.name}</span>
                  </div>
                  <span className="font-bold text-gray-800 dark:text-gray-200">{entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Visitor Platform & Geolocation Analytics */}
      <div className="bg-white dark:bg-[#131316] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <h4 className="font-serif-luxury text-lg font-bold mb-6">Visitor Analytics & Client Platforms</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-800">
          {/* Devices */}
          <div className="space-y-4 pt-4 md:pt-0 md:pr-4">
            <h5 className="text-xs uppercase tracking-wider text-gray-400 font-semibold flex items-center gap-1.5">
              <Monitor className="w-4 h-4 text-[#C8A96A]" /> Devices
            </h5>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300"><Monitor className="w-3.5 h-3.5" /> Desktop</span>
                <span className="font-semibold text-gray-900 dark:text-white">62.8%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300"><Smartphone className="w-3.5 h-3.5" /> Mobile</span>
                <span className="font-semibold text-gray-900 dark:text-white">31.4%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300"><Tablet className="w-3.5 h-3.5" /> Tablet</span>
                <span className="font-semibold text-gray-900 dark:text-white">5.8%</span>
              </div>
            </div>
          </div>

          {/* Browsers */}
          <div className="space-y-4 pt-4 md:pt-0 md:px-6">
            <h5 className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Browsers</h5>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-300">Google Chrome</span>
                <span className="font-semibold text-gray-900 dark:text-white">54.2%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-300">Apple Safari</span>
                <span className="font-semibold text-gray-900 dark:text-white">28.9%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-300">Mozilla Firefox</span>
                <span className="font-semibold text-gray-900 dark:text-white">9.5%</span>
              </div>
            </div>
          </div>

          {/* Countries */}
          <div className="space-y-4 pt-4 md:pt-0 md:pl-6">
            <h5 className="text-xs uppercase tracking-wider text-gray-400 font-semibold flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-[#C8A96A]" /> Top Countries
            </h5>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-300">🇮🇳 India</span>
                <span className="font-semibold text-gray-900 dark:text-white">68.5%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-300">🇮🇹 Italy</span>
                <span className="font-semibold text-gray-900 dark:text-white">12.1%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-300">🇦🇪 United Arab Emirates</span>
                <span className="font-semibold text-gray-900 dark:text-white">8.4%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
