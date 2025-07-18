import React from 'react';
import { Star, Plus, TrendingUp, TrendingDown } from 'lucide-react';
import { useCrypto, Crypto } from '../context/CryptoContext';

interface CryptoTableProps {
  cryptos: Crypto[];
  showWatchlistButton?: boolean;
  showAddToPortfolio?: boolean;
}

const CryptoTable: React.FC<CryptoTableProps> = ({ 
  cryptos, 
  showWatchlistButton = true, 
  showAddToPortfolio = false 
}) => {
  const { watchlist, addToWatchlist, removeFromWatchlist } = useCrypto();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 6 : 2
    }).format(price);
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`;
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`;
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`;
    }
    return `$${marketCap.toLocaleString()}`;
  };

  const handleWatchlistToggle = (coinId: string) => {
    if (watchlist.includes(coinId)) {
      removeFromWatchlist(coinId);
    } else {
      addToWatchlist(coinId);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-gray-800 rounded-lg shadow-sm">
        <thead className="bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Coin
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              24h Change
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Market Cap
            </th>
            {showWatchlistButton && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Watchlist
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {cryptos.map((crypto, index) => (
            <tr key={crypto.id} className="hover:bg-gray-700 transition-colors duration-150">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-8 w-8">
                    <img className="h-8 w-8 rounded-full" src={crypto.image} alt={crypto.name} />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-white">
                      {crypto.name}
                    </div>
                    <div className="text-sm text-gray-400 uppercase">
                      {crypto.symbol}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-white">
                  {formatPrice(crypto.current_price)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className={`flex items-center text-sm font-medium ${
                  crypto.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {crypto.price_change_percentage_24h >= 0 ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                {formatMarketCap(crypto.market_cap)}
              </td>
              {showWatchlistButton && (
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleWatchlistToggle(crypto.id)}
                    className={`p-2 rounded-full transition-colors duration-200 ${
                      watchlist.includes(crypto.id)
                        ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                        : 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-gray-300'
                    }`}
                  >
                    <Star className={`h-4 w-4 ${watchlist.includes(crypto.id) ? 'fill-current' : ''}`} />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CryptoTable;