import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Briefcase } from 'lucide-react';
import { useCrypto } from '../context/CryptoContext';

const PortfolioSummary: React.FC = () => {
  const { portfolio } = useCrypto();

  const totalInvestment = portfolio.reduce((sum, item) => sum + (item.amount * item.buyPrice), 0);
  const currentValue = portfolio.reduce((sum, item) => sum + (item.amount * item.currentPrice), 0);
  const totalProfitLoss = currentValue - totalInvestment;
  const profitLossPercentage = totalInvestment > 0 ? (totalProfitLoss / totalInvestment) * 100 : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const isProfit = totalProfitLoss >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-700">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Briefcase className="h-8 w-8 text-blue-400" />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-400">Total Investment</div>
            <div className="text-xl font-semibold text-white">
              {formatCurrency(totalInvestment)}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-700">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <DollarSign className="h-8 w-8 text-green-400" />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-400">Current Value</div>
            <div className="text-xl font-semibold text-white">
              {formatCurrency(currentValue)}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-700">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {isProfit ? (
              <TrendingUp className="h-8 w-8 text-green-400" />
            ) : (
              <TrendingDown className="h-8 w-8 text-red-400" />
            )}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-400">Profit/Loss</div>
            <div className={`text-xl font-semibold ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
              {formatCurrency(totalProfitLoss)}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-700">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {isProfit ? (
              <TrendingUp className="h-8 w-8 text-green-400" />
            ) : (
              <TrendingDown className="h-8 w-8 text-red-400" />
            )}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-400">Percentage</div>
            <div className={`text-xl font-semibold ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
              {isProfit ? '+' : ''}{profitLossPercentage.toFixed(2)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioSummary;