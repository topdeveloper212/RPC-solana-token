import React, { useEffect, useRef, useState } from 'react';
import { createChart, IChartApi, ISeriesApi, CandlestickData, ColorType } from 'lightweight-charts';
import { Connection, PublicKey } from '@solana/web3.js';

function App() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [rpcUrl, setRpcUrl] = useState<string>('');
  const [tokenAddress, setTokenAddress] = useState<string>('');
  const [chart, setChart] = useState<IChartApi | null>(null);
  const [series, setSeries] = useState<ISeriesApi<"Candlestick"> | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (chartContainerRef.current) {
      const chartInstance = createChart(chartContainerRef.current, {
        layout: {
          textColor: '#d1d4dc',
          background: { type: ColorType.Solid, color: '#1e222d' },
        },
        grid: {
          vertLines: { color: '#2B2B43' },
          horzLines: { color: '#2B2B43' },
        },
        height: 500,
        width: chartContainerRef.current.clientWidth,
      });

      const candlestickSeries = chartInstance.addCandlestickSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderVisible: false,
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
      });

      setChart(chartInstance);
      setSeries(candlestickSeries);

      const handleResize = () => {
        if (chartContainerRef.current) {
          chartInstance.applyOptions({
            width: chartContainerRef.current.clientWidth,
          });
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        chartInstance.remove();
      };
    }
  }, []);

  const fetchTokenData = async () => {
    if (!rpcUrl || !tokenAddress) {
      setError('Please provide both RPC URL and token address');
      return;
    }

    try {
      const connection = new Connection(rpcUrl);
      const tokenPublicKey = new PublicKey(tokenAddress);

      // Here we would implement the logic to fetch historical price data
      // This is a placeholder for the actual implementation
      const mockData: CandlestickData[] = [];
      const now = new Date();
      
      // Generate data for the last 100 days
      for (let i = 0; i < 100; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - (99 - i)); // Start from 99 days ago and move forward
        
        // Ensure we're using UTC to avoid timezone issues
        const year = date.getUTCFullYear();
        const month = date.getUTCMonth() + 1;
        const day = date.getUTCDate();

        // Generate random price data
        const basePrice = 100;
        const randomFactor = Math.random() * 10 - 5; // Random value between -5 and 5
        const open = basePrice + randomFactor;
        const close = basePrice + randomFactor + (Math.random() * 10 - 5);
        const high = Math.max(open, close) + Math.random() * 5;
        const low = Math.min(open, close) - Math.random() * 5;

        mockData.push({
          time: { year, month, day },
          open,
          high,
          low,
          close,
        });
      }
      console.log(mockData);

      if (series) {
        series.setData(mockData);
        chart?.timeScale().fitContent();
      }
      
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-100">Solana Token Chart</h1>
        
        <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                RPC URL
              </label>
              <input
                type="text"
                value={rpcUrl}
                onChange={(e) => setRpcUrl(e.target.value)}
                placeholder="Enter Solana RPC URL (e.g., https://api.devnet.solana.com)"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 placeholder-gray-400"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Token Address
              </label>
              <input
                type="text"
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value)}
                placeholder="Enter token address"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 placeholder-gray-400"
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm mt-2">{error}</div>
            )}

            <button
              onClick={fetchTokenData}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors duration-200"
            >
              Load Chart
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-md p-6">
          <div ref={chartContainerRef} className="w-full h-[500px]" />
        </div>
      </div>
    </div>
  );
}

export default App; 