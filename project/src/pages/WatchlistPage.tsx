import React from 'react';
import { Eye } from 'lucide-react';
import { useCrypto } from '../context/CryptoContext';
import CryptoTable from '../components/CryptoTable';

const WatchlistPage: React.FC = () => {
  const { cryptos, watchlist } = useCrypto();

  const watchlistCryptos = cryptos.filter(crypto => watchlist.includes(crypto.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">My Watchlist</h1>
        <p className="mt-2 text-gray-400">Keep track of your favorite cryptocurrencies</p>
      </div>

      {watchlistCryptos.length === 0 ? (
        <div className="bg-gray-800 rounded-lg shadow-sm p-8 text-center border border-gray-700">
          <Eye className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Your Watchlist is Empty</h3>
          <p className="text-gray-400 mb-4">
            Start building your watchlist by adding cryptocurrencies from the market page.
          </p>
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
          >
            Browse Market
          </a>
        </div>
      ) : (
        <CryptoTable cryptos={watchlistCryptos} showWatchlistButton={true} />
      )}
    </div>
  );
};

export default WatchlistPage;