import React from 'react';
import { Download, FileText } from 'lucide-react';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useCrypto } from '../context/CryptoContext';

const ExportPortfolio: React.FC = () => {
  const { portfolio } = useCrypto();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const csvData = portfolio.map(item => {
    const totalInvestment = item.amount * item.buyPrice;
    const currentValue = item.amount * item.currentPrice;
    const profitLoss = currentValue - totalInvestment;
    const profitLossPercentage = totalInvestment > 0 ? (profitLoss / totalInvestment) * 100 : 0;

    return {
      'Asset': item.name,
      'Symbol': item.symbol.toUpperCase(),
      'Holdings': item.amount,
      'Buy Price': item.buyPrice,
      'Current Price': item.currentPrice,
      'Investment': totalInvestment,
      'Current Value': currentValue,
      'Profit/Loss': profitLoss,
      'P&L %': `${profitLossPercentage.toFixed(2)}%`
    };
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('CryptoTrack Portfolio Report', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35);

    const tableData = portfolio.map(item => {
      const totalInvestment = item.amount * item.buyPrice;
      const currentValue = item.amount * item.currentPrice;
      const profitLoss = currentValue - totalInvestment;
      const profitLossPercentage = totalInvestment > 0 ? (profitLoss / totalInvestment) * 100 : 0;

      return [
        item.name,
        item.symbol.toUpperCase(),
        item.amount.toString(),
        formatCurrency(item.buyPrice),
        formatCurrency(item.currentPrice),
        formatCurrency(currentValue),
        `${profitLossPercentage.toFixed(2)}%`
      ];
    });

    const totalInvestment = portfolio.reduce((sum, item) => sum + (item.amount * item.buyPrice), 0);
    const currentValue = portfolio.reduce((sum, item) => sum + (item.amount * item.currentPrice), 0);
    const totalProfitLoss = currentValue - totalInvestment;

    (doc as any).autoTable({
      head: [['Asset', 'Symbol', 'Holdings', 'Buy Price', 'Current Price', 'Value', 'P&L %']],
      body: tableData,
      startY: 50,
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] }
    });

    const finalY = (doc as any).lastAutoTable.finalY + 20;
    
    doc.setFontSize(14);
    doc.text('Portfolio Summary', 20, finalY);
    doc.setFontSize(12);
    doc.text(`Total Investment: ${formatCurrency(totalInvestment)}`, 20, finalY + 15);
    doc.text(`Current Value: ${formatCurrency(currentValue)}`, 20, finalY + 25);
    doc.text(`Total P&L: ${formatCurrency(totalProfitLoss)}`, 20, finalY + 35);

    doc.save('cryptotrack-portfolio.pdf');
  };

  if (portfolio.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-700">
      <h3 className="text-lg font-medium text-white mb-4">Export Portfolio</h3>
      <div className="flex flex-col sm:flex-row gap-4">
        <CSVLink
          data={csvData}
          filename="cryptotrack-portfolio.csv"
          className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 transition-colors duration-200"
        >
          <FileText className="h-4 w-4 mr-2" />
          Export CSV
        </CSVLink>
        
        <button
          onClick={exportToPDF}
          className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
        >
          <Download className="h-4 w-4 mr-2" />
          Export PDF
        </button>
      </div>
    </div>
  );
};

export default ExportPortfolio;