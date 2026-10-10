import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Legend } from 'recharts';

const generateMockData = () => {
  const data = [];
  const basePrice = 64200;
  for (let priceOffset = -500; priceOffset <= 500; priceOffset += 50) {
    const price = basePrice + priceOffset;
    const isHotZone = Math.abs(priceOffset) === 200 || Math.abs(priceOffset) === 400;
    const density = isHotZone ? Math.floor(Math.random() * 50) + 50 : Math.floor(Math.random() * 20);
    data.push({
      price: price,
      leverage: Math.floor(Math.random() * 2) === 1 ? 'High (50x)' : 'Mid (20x)',
      volume: density * 100000,
      density: density
    });
  }
  return data;
};

export default function LiquidityDensityMVP() {
  const [data, setData] = useState(generateMockData());
  const [currentPrice, setCurrentPrice] = useState(64200);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateMockData());
      setCurrentPrice(prev => prev + (Math.random() > 0.5 ? 10 : -10));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans p-6">
      <header className="flex justify-between items-center border-b border-slate-800 pb-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-wider text-cyan-400">LIQUIDITY DENSITY PROTOCOL</h1>
          <p className="text-xs text-slate-400">Arbitrum L2 Liquidation Risk Infrastructure</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg">
          <span className="text-xs text-slate-500 uppercase block">Live BTC Price</span>
          <span className="text-xl font-mono text-emerald-400 font-bold">${currentPrice.toLocaleString()}</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between h-[450px]">
          <div>
            <h2 className="text-sm font-semibold uppercase text-slate-400 mb-4">Risk Parameters</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-500 block mb-1">Target Chain</label>
                <div className="bg-slate-950 px-3 py-2 rounded border border-cyan-500/30 text-cyan-400 font-mono text-sm">Arbitrum (One)</div>
              </div>
              <div>
                <label className="text-xs text-slate-500 block mb-1">Total Monitored Vol.</label>
                <div className="font-mono text-lg font-bold text-slate-200">$1,420,500,000</div>
              </div>
              <div className="p-3 bg-red-950/20 border border-red-500/30 rounded">
                <span className="text-xs font-bold text-red-400 block mb-1">⚠️ CRITICAL DENSITY ALERT</span>
                <p className="text-xs text-slate-300">Heavy 50x liquidations clustered at $64,000. Cascade risk: HIGH.</p>
              </div>
            </div>
          </div>
          <button className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold py-3 rounded-lg transition text-sm">
            Connect Institutional API
          </button>
        </div>

        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 p-4 rounded-xl h-[450px]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold uppercase text-slate-300">Liquidation Density Heatmap</h3>
            <div className="flex gap-2 items-center text-xs">
              <span className="w-3 h-3 bg-cyan-500 rounded-full inline-block animate-pulse"></span>
              <span className="text-slate-400">Live Pool Streaming</span>
            </div>
          </div>
          
          <div className="w-full h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <XAxis type="number" dataKey="price" name="Price" unit="$" domain={['dataMin', 'dataMax']} stroke="#475569" tickLine={false} />
                <YAxis type="category" dataKey="leverage" name="Leverage" stroke="#475569" tickLine={false} />
                <ZAxis type="number" dataKey="density" range={[20, 400]} /> {/* Исправлено: добавлены пиксельные радиусы */}
                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                <Legend />
                <Scatter name="Liquidation Pools (Density Size)" data={data} fill="#06b6d4" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
