import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export interface Crypto {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  image: string;
  sparkline_in_7d?: {
    price: number[];
  };
}

export interface PortfolioItem {
  id: string;
  coinId: string;
  name: string;
  symbol: string;
  amount: number;
  buyPrice: number;
  currentPrice: number;
  image: string;
}

interface CryptoContextType {
  cryptos: Crypto[];
  watchlist: string[];
  portfolio: PortfolioItem[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  addToWatchlist: (coinId: string) => void;
  removeFromWatchlist: (coinId: string) => void;
  addToPortfolio: (item: Omit<PortfolioItem, 'id' | 'currentPrice'>) => void;
  removeFromPortfolio: (id: string) => void;
  updatePortfolioPrices: () => void;
  fetchCryptos: () => void;
  getCryptoById: (id: string) => Promise<Crypto | null>;
}

const CryptoContext = createContext<CryptoContextType | undefined>(undefined);

export const useCrypto = () => {
  const context = useContext(CryptoContext);
  if (!context) {
    throw new Error('useCrypto must be used within a CryptoProvider');
  }
  return context;
};

interface CryptoProviderProps {
  children: ReactNode;
}

export const CryptoProvider: React.FC<CryptoProviderProps> = ({ children }) => {
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const savedWatchlist = localStorage.getItem('cryptoWatchlist');
    const savedPortfolio = localStorage.getItem('cryptoPortfolio');
    
    if (savedWatchlist) {
      setWatchlist(JSON.parse(savedWatchlist));
    }
    
    if (savedPortfolio) {
      setPortfolio(JSON.parse(savedPortfolio));
    }
    
    fetchCryptos();
  }, []);

  useEffect(() => {
    localStorage.setItem('cryptoWatchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem('cryptoPortfolio', JSON.stringify(portfolio));
  }, [portfolio]);

  const fetchCryptos = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/coins/markets',
        {
          params: {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 100,
            page: 1,
            sparkline: true,
            price_change_percentage: '24h'
          }
        }
      );
      
      setCryptos(response.data);
      updatePortfolioPricesWithData(response.data);
    } catch (err) {
      setError('Failed to fetch cryptocurrency data');
      toast.error('Failed to fetch cryptocurrency data');
    } finally {
      setLoading(false);
    }
  };

  const getCryptoById = async (id: string): Promise<Crypto | null> => {
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${id}`,
        {
          params: {
            localization: false,
            tickers: false,
            market_data: true,
            community_data: false,
            developer_data: false,
            sparkline: true
          }
        }
      );
      
      return {
        id: response.data.id,
        name: response.data.name,
        symbol: response.data.symbol,
        current_price: response.data.market_data.current_price.usd,
        price_change_percentage_24h: response.data.market_data.price_change_percentage_24h,
        market_cap: response.data.market_data.market_cap.usd,
        image: response.data.image.small,
        sparkline_in_7d: response.data.market_data.sparkline_7d
      };
    } catch (err) {
      toast.error('Failed to fetch coin data');
      return null;
    }
  };

  const updatePortfolioPricesWithData = (cryptoData: Crypto[]) => {
    setPortfolio(prevPortfolio => 
      prevPortfolio.map(item => {
        const crypto = cryptoData.find(c => c.id === item.coinId);
        if (crypto) {
          return { ...item, currentPrice: crypto.current_price };
        }
        return item;
      })
    );
  };

  const updatePortfolioPrices = async () => {
    if (portfolio.length === 0) return;
    
    const coinIds = portfolio.map(item => item.coinId).join(',');
    
    try {
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price',
        {
          params: {
            ids: coinIds,
            vs_currencies: 'usd'
          }
        }
      );
      
      setPortfolio(prevPortfolio => 
        prevPortfolio.map(item => ({
          ...item,
          currentPrice: response.data[item.coinId]?.usd || item.currentPrice
        }))
      );
    } catch (err) {
      toast.error('Failed to update portfolio prices');
    }
  };

  const addToWatchlist = (coinId: string) => {
    if (!watchlist.includes(coinId)) {
      setWatchlist(prev => [...prev, coinId]);
      toast.success('Added to watchlist');
    }
  };

  const removeFromWatchlist = (coinId: string) => {
    setWatchlist(prev => prev.filter(id => id !== coinId));
    toast.success('Removed from watchlist');
  };

  const addToPortfolio = (item: Omit<PortfolioItem, 'id' | 'currentPrice'>) => {
    const crypto = cryptos.find(c => c.id === item.coinId);
    const newItem: PortfolioItem = {
      ...item,
      id: Date.now().toString(),
      currentPrice: crypto?.current_price || 0
    };
    
    setPortfolio(prev => [...prev, newItem]);
    toast.success('Added to portfolio');
  };

  const removeFromPortfolio = (id: string) => {
    setPortfolio(prev => prev.filter(item => item.id !== id));
    toast.success('Removed from portfolio');
  };

  const value: CryptoContextType = {
    cryptos,
    watchlist,
    portfolio,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    addToWatchlist,
    removeFromWatchlist,
    addToPortfolio,
    removeFromPortfolio,
    updatePortfolioPrices,
    fetchCryptos,
    getCryptoById
  };

  return (
    <CryptoContext.Provider value={value}>
      {children}
    </CryptoContext.Provider>
  );
};