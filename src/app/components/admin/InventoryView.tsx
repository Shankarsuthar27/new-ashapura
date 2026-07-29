import React, { useMemo, useState } from 'react';
import {
  TrendingUp, DollarSign, Archive, AlertTriangle, ShieldCheck,
  RefreshCw, ClipboardList, CheckCircle
} from 'lucide-react';
import { StoneSlab } from '../../data/stoneData';

interface InventoryViewProps {
  slabs: StoneSlab[];
  onUpdateSlab: (slab: StoneSlab) => Promise<void>;
}

export const InventoryView: React.FC<InventoryViewProps> = ({ slabs, onUpdateSlab }) => {
  // Let's assume a default cost price of 55% of selling price if not configured.
  // We can track individual purchase costs locally or simulate them.
  const costPrices = useMemo<Record<string, number>>(() => {
    const prices: Record<string, number> = {};
    slabs.forEach(s => {
      const priceVal = s.price !== undefined ? Number(s.price) : 120;
      prices[s.id] = Math.round(priceVal * 0.55); // Cost is 55% of sell price
    });
    return prices;
  }, [slabs]);

  // Stock update state
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [newStockVal, setNewStockVal] = useState<number | ''>(0);

  // Stock movement audit logs
  const [stockLogs, setStockLogs] = useState<Array<{ id: string; date: string; name: string; oldStock: number; newStock: number; type: 'in' | 'out' }>>([]);

  // Aggregate stats
  const totalValue = useMemo(() => {
    return slabs.reduce((acc, s) => {
      const priceVal = s.price !== undefined ? Number(s.price) : 120;
      return acc + (priceVal * (s.inStockSlabs || 0) * 100); // 100 sqft average per slab/box
    }, 0);
  }, [slabs]);

  const totalCost = useMemo(() => {
    return slabs.reduce((acc, s) => {
      const cost = costPrices[s.id] || 60;
      return acc + (cost * (s.inStockSlabs || 0) * 100);
    }, 0);
  }, [slabs, costPrices]);

  const netProfit = totalValue - totalCost;

  // Filter out low stock
  const lowStockSlabs = useMemo(() => {
    return slabs.filter(s => s.inStockSlabs < 5);
  }, [slabs]);

  const handleUpdateStock = async (slab: StoneSlab) => {
    const oldStock = slab.inStockSlabs;
    const updated = { ...slab, inStockSlabs: newStockVal };
    await onUpdateSlab(updated);
    
    // Add movement log
    const logType = newStockVal > oldStock ? 'in' : 'out';
    setStockLogs(prev => [
      {
        id: Math.random().toString(36).substring(2, 9),
        date: new Date().toLocaleString(),
        name: slab.name,
        oldStock,
        newStock: newStockVal,
        type: logType
      },
      ...prev
    ]);

    setUpdatingId(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Financials overview card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total asset valuation */}
        <div className="bg-white dark:bg-[#131316] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-md">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Estimated Catalog Valuation</span>
          <span className="text-2xl font-bold font-serif-luxury text-[#C8A96A] block mt-2">
            ₹{totalValue.toLocaleString()}
          </span>
          <p className="text-[10px] text-gray-400 mt-1">Based on current stock levels & prices</p>
        </div>

        {/* Total Cost valuation */}
        <div className="bg-white dark:bg-[#131316] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-md">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Estimated Purchase Cost</span>
          <span className="text-2xl font-bold font-serif-luxury text-gray-700 dark:text-gray-300 block mt-2">
            ₹{totalCost.toLocaleString()}
          </span>
          <p className="text-[10px] text-gray-400 mt-1">Simulated at 55% average product margin</p>
        </div>

        {/* Estimated Profit */}
        <div className="bg-white dark:bg-[#131316] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-md">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Projected Profit Margin</span>
          <span className="text-2xl font-bold font-serif-luxury text-emerald-500 block mt-2">
            ₹{netProfit.toLocaleString()}
          </span>
          <p className="text-[10px] text-gray-400 mt-1">Projected average net margin 45%</p>
        </div>
      </div>

      {/* Alerts & Stock list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Slabs Table & Stock Editor */}
        <div className="lg:col-span-2 bg-white dark:bg-[#131316] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <h3 className="font-serif-luxury text-xl font-bold">Warehouse Stock Ledger</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-[#17171C] text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="py-3 px-4">Material</th>
                  <th className="py-3 px-4">Buy Price</th>
                  <th className="py-3 px-4">Sell Price</th>
                  <th className="py-3 px-4 text-center">In Stock</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {slabs.map(slab => {
                  const buy = costPrices[slab.id] || 60;
                  const sell = slab.price !== undefined ? Number(slab.price) : 120;
                  const isUpdating = updatingId === slab.id;

                  return (
                    <tr key={slab.id} className="hover:bg-gray-50/50 dark:hover:bg-[#1A1A20] transition-colors">
                      <td className="py-4 px-4 font-bold text-gray-900 dark:text-white">
                        {slab.name}
                        <span className="block text-[10px] font-normal text-gray-400">{slab.category}</span>
                      </td>
                      <td className="py-4 px-4 font-mono text-gray-500">₹{buy}</td>
                      <td className="py-4 px-4 font-mono font-bold text-gray-800 dark:text-gray-200">₹{sell}</td>
                      <td className="py-4 px-4 text-center font-mono">
                        {isUpdating ? (
                          <input
                            type="number"
                            value={newStockVal}
                            onChange={e => {
                              const val = e.target.value;
                              setNewStockVal(val === '' ? '' : parseInt(val) || 0);
                            }}
                            className="w-16 bg-gray-100 dark:bg-[#1E1E22] border border-[#C8A96A] text-center rounded px-1.5 py-0.5 text-xs focus:outline-none"
                          />
                        ) : (
                          <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                            slab.inStockSlabs < 5
                              ? 'bg-red-500/10 text-red-500'
                              : 'bg-green-500/10 text-green-500'
                          }`}>
                            {slab.inStockSlabs} Slabs
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right">
                        {isUpdating ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleUpdateStock(slab)}
                              className="p-1 rounded bg-emerald-500/10 text-emerald-500"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setUpdatingId(null)}
                              className="p-1 rounded bg-red-500/10 text-red-500"
                            >
                              <RefreshCw className="w-4 h-4 rotate-45" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setUpdatingId(slab.id);
                              setNewStockVal(slab.inStockSlabs);
                            }}
                            className="px-2.5 py-1 rounded bg-gray-100 dark:bg-[#202026] text-xs font-semibold hover:border-[#C8A96A] border border-transparent"
                          >
                            Update
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Alerts & Logs */}
        <div className="space-y-6">
          {/* Low Stock Alerts */}
          <div className="bg-white dark:bg-[#131316] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-xl">
            <h4 className="font-serif-luxury text-base font-bold text-red-500 flex items-center gap-1.5 mb-4">
              <AlertTriangle className="w-4 h-4" /> Low Stock Alerts
            </h4>

            {lowStockSlabs.length === 0 ? (
              <div className="text-center py-6 text-gray-400 space-y-2 text-xs">
                <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto" />
                <p>All items above warning threshold.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {lowStockSlabs.map(s => (
                  <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-red-500/5 border border-red-500/10 text-xs">
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white truncate max-w-[150px]">{s.name}</p>
                      <p className="text-[9px] text-gray-400">{s.category}</p>
                    </div>
                    <span className="font-mono font-bold text-red-500">{s.inStockSlabs} left</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Stock Log Ledger */}
          <div className="bg-white dark:bg-[#131316] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-xl">
            <h4 className="font-serif-luxury text-base font-bold flex items-center gap-1.5 mb-4">
              <ClipboardList className="w-4 h-4 text-[#C8A96A]" /> Stock Movements Ledger
            </h4>
            <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
              {stockLogs.map(log => (
                <div key={log.id} className="text-xs p-3 rounded-xl bg-gray-50 dark:bg-[#1A1A1F] border border-gray-200 dark:border-gray-800 space-y-1.5">
                  <div className="flex items-center justify-between text-[9px] text-gray-400">
                    <span>{log.date}</span>
                    <span className={`px-1.5 py-0.5 rounded font-bold uppercase ${
                      log.type === 'in' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                    }`}>{log.type === 'in' ? 'Stock Added' : 'Stock Shipped'}</span>
                  </div>
                  <p className="font-bold text-gray-800 dark:text-gray-200 truncate">{log.name}</p>
                  <p className="text-[10px] text-gray-500">
                    Updated count: <span className="font-mono">{log.oldStock}</span> → <span className="font-mono font-bold">{log.newStock}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
