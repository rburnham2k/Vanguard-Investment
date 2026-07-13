// Simple interactive elements for the investing website
document.addEventListener('DOMContentLoaded', function() {
  // Add active class to current page in navigation
  const currentPage = window.location.href.split('/').pop();
  const navLinks = document.querySelectorAll('.navbar a');
  
  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPage || 
        (currentPage === 'index.html' && link.getAttribute('href') === 'index.html')) {
      link.classList.add('active');
    }
  });
  
  // Add simple ETF card generation on ETF page
  const etfListContainer = document.getElementById('etf-list-container');
  if (etfListContainer) {
    const sampleETFs = [
      {
        name: 'SPDR S&P 500 ETF Trust',
        symbol: 'SPY',
        description: 'Tracks the S&P 500 index, representing 500 large-cap US stocks',
        expenseRatio: '0.094%'
      },
      {
        name: 'Invesco QQQ Trust',
        symbol: 'QQQ',
        description: 'Tracks the NASDAQ-100 index, representing 100 largest non-financial NASDAQ-listed companies',
        expenseRatio: '0.20%'
      },
      {
        name: 'Vanguard Total Stock Market ETF',
        symbol: 'VTI',
        description: 'Provides exposure to the entire US stock market',
        expenseRatio: '0.03%'
      },
      {
        name: 'iShares Core MSCI Emerging Markets ETF',
        symbol: 'IEMG',
        description: 'Offers diversified exposure to emerging market stocks',
        expenseRatio: '0.06%'
      }
    ];
    
    // Create ETF cards
    sampleETFs.forEach(etf => {
      const card = document.createElement('div');
      card.className = 'etf-card';
      card.innerHTML = `
        <div class="etf-name">${etf.name}</div>
        <div class="etf-symbol">(${etf.symbol})</div>
        <div class="etf-description">${etf.description}</div>
        <div class="etf-expense">Expense Ratio: ${etf.expenseRatio}</div>
      `;
      card.style.border = 'none';
      card.style.backgroundColor = '#2D2D2D';
      card.style.borderLeft = '4px solid #FFD700';
      card.style.padding = '12px';
      card.style.margin = '10px 0';
      card.style.borderRadius = '0 4px 4px 0';
      
      etfListContainer.appendChild(card);
    });
  }
});