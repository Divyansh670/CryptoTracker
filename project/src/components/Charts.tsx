import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';
import { useCrypto } from '../context/CryptoContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Charts: React.FC = () => {
  const { portfolio, cryptos } = useCrypto();
  const [selectedCoin, setSelectedCoin] = useState('');

  const portfolioData = portfolio.map(item => ({
    label: item.name,
    value: item.amount * item.currentPrice,
    color: `hsl(${Math.random() * 360}, 70%, 50%)`
  }));

  const pieChartData = {
    labels: portfolioData.map(item => item.label),
    datasets: [
      {
        data: portfolioData.map(item => item.value),
        backgroundColor: portfolioData.map(item => item.color),
        borderColor: portfolioData.map(item => item.color),
        borderWidth: 2,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Portfolio Distribution',
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = context.parsed;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: $${value.toLocaleString()} (${percentage}%)`;
          }
        }
      }
    },
  };

  const selectedCrypto = cryptos.find(crypto => crypto.id === selectedCoin);
  const priceHistory = selectedCrypto?.sparkline_in_7d?.price || [];

  const lineChartData = {
    labels: priceHistory.map((_, index) => `Day ${index + 1}`),
    datasets: [
      {
        label: selectedCrypto?.name || 'Price',
        data: priceHistory,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.1,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `${selectedCrypto?.name || 'Cryptocurrency'} Price History (7 Days)`,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: function(value: any) {
            return '$' + value.toLocaleString();
          }
        }
      }
    }
  };

  return (
    <div className="space-y-8">
      {portfolio.length > 0 && (
        <div className="bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-700">
          <div className="max-w-md mx-auto">
            <Pie data={pieChartData} options={pieChartOptions} />
          </div>
        </div>
      )}

      <div className="bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-700">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Select Cryptocurrency for Price History
          </label>
          <select
            value={selectedCoin}
            onChange={(e) => setSelectedCoin(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          >
            <option value="">Choose a cryptocurrency...</option>
            {cryptos.slice(0, 20).map(crypto => (
              <option key={crypto.id} value={crypto.id}>
                {crypto.name} ({crypto.symbol.toUpperCase()})
              </option>
            ))}
          </select>
        </div>

        {selectedCrypto && priceHistory.length > 0 && (
          <div>
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        )}

        {selectedCoin && (!priceHistory || priceHistory.length === 0) && (
          <div className="text-center py-8 text-gray-400">
            No price history data available for this cryptocurrency.
          </div>
        )}
      </div>
    </div>
  );
};

export default Charts;