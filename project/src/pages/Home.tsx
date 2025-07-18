import React, { useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { useCrypto } from '../context/CryptoContext';
import CryptoTable from '../components/CryptoTable';
import SearchBar from '../components/SearchBar';

const Home: React.FC = () => {
  const { 
    cryptos, 
    loading, 
    error, 
    searchTerm, 
    setSearchTerm, 
    fetchCryptos 
  } = useCrypto();

  useEffect(() => {
    const interval = setInterval(() => {
      fetchCryptos();
    }, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, [fetchCryptos]);

  const filteredCryptos = cryptos.filter(crypto =>
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const topCryptos = searchTerm ? filteredCryptos : cryptos.slice(0, 20);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Cryptocurrency Market</h1>
          <p className="mt-2 text-gray-400">Track the latest cryptocurrency prices and market data</p>
        </div>
        <button
          onClick={fetchCryptos}
          disabled={loading}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-500 transition-colors duration-200"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="mb-8">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          placeholder="Search cryptocurrencies..."
        />
      </div>

      {error && (
        <div className="bg-red-900 border border-red-700 rounded-md p-4 mb-6">
          <div className="text-red-300">{error}</div>
        </div>
      )}

      {loading && cryptos.length === 0 ? (
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-400" />
        </div>
      ) : (
        <CryptoTable cryptos={topCryptos} showWatchlistButton={true} />
      )}

      {!loading && topCryptos.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <p className="text-gray-400">No cryptocurrencies found matching "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
};

export default Home;