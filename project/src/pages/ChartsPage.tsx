import React from 'react';
import { BarChart3 } from 'lucide-react';
import { useCrypto } from '../context/CryptoContext';
import Charts from '../components/Charts';

const ChartsPage: React.FC = () => {
  const { portfolio } = useCrypto();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Charts & Analytics</h1>
        <p className="mt-2 text-gray-400">Visualize your portfolio and market data</p>
      </div>

      {portfolio.length === 0 ? (
        <div className="bg-gray-800 rounded-lg shadow-sm p-8 text-center border border-gray-700">
          <BarChart3 className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No Portfolio Data</h3>
          <p className="text-gray-400 mb-4">
            Add some holdings to your portfolio to see charts and analytics.
          </p>
          <a
            href="/portfolio"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
          >
            Add Holdings
          </a>
        </div>
      ) : (
        <Charts />
      )}
    </div>
  );
};

export default ChartsPage;