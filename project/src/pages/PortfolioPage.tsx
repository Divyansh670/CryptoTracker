import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useCrypto } from '../context/CryptoContext';
import PortfolioSummary from '../components/PortfolioSummary';
import PortfolioTable from '../components/PortfolioTable';
import AddToPortfolio from '../components/AddToPortfolio';
import ExportPortfolio from '../components/ExportPortfolio';

const PortfolioPage: React.FC = () => {
  const { portfolio, updatePortfolioPrices } = useCrypto();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      updatePortfolioPrices();
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [updatePortfolioPrices]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">My Portfolio</h1>
          <p className="mt-2 text-gray-400">Track your cryptocurrency investments and performance</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Holding
        </button>
      </div>

      {portfolio.length > 0 && <PortfolioSummary />}
      
      <div className="space-y-8">
        <PortfolioTable />
        {portfolio.length > 0 && <ExportPortfolio />}
      </div>

      <AddToPortfolio 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </div>
  );
};

export default PortfolioPage;