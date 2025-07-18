import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useCrypto } from '../context/CryptoContext';

interface AddToPortfolioProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddToPortfolio: React.FC<AddToPortfolioProps> = ({ isOpen, onClose }) => {
  const { cryptos, addToPortfolio } = useCrypto();
  const [selectedCoin, setSelectedCoin] = useState('');
  const [amount, setAmount] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCryptos = cryptos.filter(crypto =>
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCoin || !amount || !buyPrice) {
      return;
    }

    const crypto = cryptos.find(c => c.id === selectedCoin);
    if (!crypto) return;

    addToPortfolio({
      coinId: crypto.id,
      name: crypto.name,
      symbol: crypto.symbol,
      amount: parseFloat(amount),
      buyPrice: parseFloat(buyPrice),
      image: crypto.image
    });

    setSelectedCoin('');
    setAmount('');
    setBuyPrice('');
    setSearchTerm('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h3 className="text-lg font-medium text-white">Add to Portfolio</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300 transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Search Cryptocurrency
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for a coin..."
              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            />
          </div>

          {searchTerm && (
            <div className="max-h-40 overflow-y-auto border border-gray-600 rounded-md bg-gray-700">
              {filteredCryptos.slice(0, 10).map(crypto => (
                <button
                  key={crypto.id}
                  type="button"
                  onClick={() => {
                    setSelectedCoin(crypto.id);
                    setSearchTerm('');
                    setBuyPrice(crypto.current_price.toString());
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-600 flex items-center space-x-3 text-white"
                >
                  <img src={crypto.image} alt={crypto.name} className="h-6 w-6" />
                  <div>
                    <div className="font-medium">{crypto.name}</div>
                    <div className="text-sm text-gray-400">{crypto.symbol.toUpperCase()}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {selectedCoin && (
            <div className="p-3 bg-blue-900 rounded-md">
              <div className="flex items-center space-x-3">
                {(() => {
                  const crypto = cryptos.find(c => c.id === selectedCoin);
                  return crypto ? (
                    <>
                      <img src={crypto.image} alt={crypto.name} className="h-8 w-8" />
                      <div>
                        <div className="font-medium text-white">{crypto.name}</div>
                        <div className="text-sm text-blue-300">{crypto.symbol.toUpperCase()}</div>
                      </div>
                    </>
                  ) : null;
                })()}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Amount Owned
            </label>
            <input
              type="number"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Buy Price (USD)
            </label>
            <input
              type="number"
              step="any"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
              placeholder="0.00"
              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              required
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedCoin || !amount || !buyPrice}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Add to Portfolio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddToPortfolio;