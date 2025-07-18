import React from 'react';
import { Trash2, TrendingUp, TrendingDown, Briefcase } from 'lucide-react';
import { useCrypto } from '../context/CryptoContext';

const PortfolioTable: React.FC = () => {
  const { portfolio, removeFromPortfolio } = useCrypto();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  if (portfolio.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-sm p-8 text-center border border-gray-700">
        <Briefcase className="h-12 w-12 text-gray-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">No Holdings Yet</h3>
        <p className="text-gray-400">Add your first cryptocurrency holding to get started.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-700">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Asset
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Holdings
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Buy Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Current Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Value
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                P&L
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {portfolio.map((item) => {
              const totalInvestment = item.amount * item.buyPrice;
              const currentValue = item.amount * item.currentPrice;
              const profitLoss = currentValue - totalInvestment;
              const profitLossPercentage = totalInvestment > 0 ? (profitLoss / totalInvestment) * 100 : 0;
              const isProfit = profitLoss >= 0;

              return (
                <tr key={item.id} className="hover:bg-gray-700 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img className="h-8 w-8 rounded-full" src={item.image} alt={item.name} />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">{item.name}</div>
                        <div className="text-sm text-gray-400 uppercase">{item.symbol}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">
                      {item.amount.toLocaleString()} {item.symbol.toUpperCase()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">{formatCurrency(item.buyPrice)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">{formatCurrency(item.currentPrice)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{formatCurrency(currentValue)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`flex items-center text-sm font-medium ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
                      {isProfit ? (
                        <TrendingUp className="h-4 w-4 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1" />
                      )}
                      <div>
                        <div>{formatCurrency(profitLoss)}</div>
                        <div className="text-xs">
                          {isProfit ? '+' : ''}{profitLossPercentage.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => removeFromPortfolio(item.id)}
                      className="text-red-400 hover:text-red-300 transition-colors duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PortfolioTable;