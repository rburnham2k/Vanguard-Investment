export function ResourcesPage() {
  const resources = [
    {
      category: 'Books',
      icon: '📚',
      items: [
        { title: 'The Total Money Makeover', author: 'Dave Ramsey', description: 'A proven plan for financial fitness', url: 'https://www.amazon.com/Total-Money-Makeover-Financial-Fitness/dp/159555078X' },
        { title: 'Rich Dad Poor Dad', author: 'Robert Kiyosaki', description: 'What the rich teach their kids about money', url: 'https://www.amazon.com/Rich-Dad-Poor-Teach-Middle/dp/1612680011' },
        { title: 'The Psychology of Money', author: 'Morgan Housel', description: 'Timeless lessons on wealth and happiness', url: 'https://www.amazon.com/Psychology-Money-Timeless-lessons-happiness/dp/0857197681' },
        { title: 'I Will Teach You to Be Rich', author: 'Ramit Sethi', description: 'A 6-week program for financial success', url: 'https://www.amazon.com/Will-Teach-You-Be-Rich/dp/1523505749' },
        { title: 'Your Money or Your Life', author: 'Vicki Robin', description: '9 steps to transforming your relationship with money', url: 'https://www.amazon.com/Your-Money-or-Life-Transforming/dp/0143115766' }
      ]
    },
    {
      category: 'Websites & Tools',
      icon: '🌐',
      items: [
        { title: 'Mint', author: 'mint.intuit.com', description: 'Free budgeting and expense tracking', url: 'https://mint.intuit.com' },
        { title: 'Yahoo Finance', author: 'finance.yahoo.com', description: 'Real-time market data and news', url: 'https://finance.yahoo.com' },
        { title: 'Investopedia', author: 'investopedia.com', description: 'Financial dictionary and education', url: 'https://www.investopedia.com' },
        { title: 'Personal Capital', author: 'personalcapital.com', description: 'Investment tracking and planning', url: 'https://www.personalcapital.com' },
        { title: 'NerdWallet', author: 'nerdwallet.com', description: 'Financial product comparisons and advice', url: 'https://www.nerdwallet.com' }
      ]
    },
    {
      category: 'Podcasts',
      icon: '🎙️',
      items: [
        { title: 'The Dave Ramsey Show', author: 'Dave Ramsey', description: 'Debt-free living and wealth building', url: 'https://www.ramseysolutions.com/shows/the-dave-ramsey-show' },
        { title: 'How to Money', author: 'Jesse & Emily', description: 'Personal finance for everyday people', url: 'https://howtomoney.com' },
        { title: 'The Mad Fientist', author: 'Brandon', description: 'Financial independence strategies', url: 'https://www.madfientist.com/podcast' },
        { title: 'BiggerPockets Podcast', author: 'Josh & Brandon', description: 'Real estate investing insights', url: 'https://www.biggerpockets.com/podcast' },
        { title: 'So Money', author: 'Farnoosh Torabi', description: 'Conversations about money and life', url: 'https://www.farnoosh.tv/podcast' }
      ]
    },
    {
      category: 'YouTube Channels',
      icon: '📺',
      items: [
        { title: 'Two Cents', author: 'PBS', description: 'Financial literacy made simple', url: 'https://www.youtube.com/c/twocents' },
        { title: 'Graham Stephan', author: 'Graham Stephan', description: 'Real estate and investing tips', url: 'https://www.youtube.com/c/GrahamStephan' },
        { title: 'The Financial Diet', author: 'Chelsea Fagan', description: 'Personal finance for millennials', url: 'https://www.youtube.com/c/TheFinancialDiet' },
        { title: 'Andrei Jikh', author: 'Andrei Jikh', description: 'Stock market and passive income', url: 'https://www.youtube.com/c/AndreiJikh' },
        { title: 'Minority Mindset', author: 'Jaspreet Singh', description: 'Financial education and mindset', url: 'https://www.youtube.com/c/MinorityMindset' }
      ]
    },
    {
      category: 'Government Resources',
      icon: '🏛️',
      items: [
        { title: 'MyMoney.gov', author: 'U.S. Government', description: 'Official financial literacy resource', url: 'https://www.mymoney.gov' },
        { title: 'Investor.gov', author: 'SEC', description: 'Investor education and protection', url: 'https://www.investor.gov' },
        { title: 'AnnualCreditReport.com', author: 'Federal Government', description: 'Free credit reports (weekly)', url: 'https://www.annualcreditreport.com' },
        { title: 'IRS.gov', author: 'Internal Revenue Service', description: 'Tax information and forms', url: 'https://www.irs.gov' },
        { title: 'ConsumerFinance.gov', author: 'CFPB', description: 'Consumer financial protection', url: 'https://www.consumerfinance.gov' }
      ]
    },
    {
      category: 'Mobile Apps',
      icon: '📱',
      items: [
        { title: 'Acorns', author: 'Acorns', description: 'Micro-investing and spare change savings', url: 'https://www.acorns.com' },
        { title: 'Robinhood', author: 'Robinhood', description: 'Commission-free stock trading', url: 'https://www.robinhood.com' },
        { title: 'YNAB', author: 'You Need A Budget', description: 'Zero-based budgeting software', url: 'https://www.ynab.com' },
        { title: 'Coinbase', author: 'Coinbase', description: 'Cryptocurrency trading platform', url: 'https://www.coinbase.com' },
        { title: 'Credit Karma', author: 'Credit Karma', description: 'Free credit score monitoring', url: 'https://www.creditkarma.com' }
      ]
    }
  ];

  return (
    <div className="resources-page">
      <div className="resources-header">
        <h1>Financial Resources</h1>
        <p>Curated tools, books, and resources to accelerate your financial journey</p>
      </div>

      <div className="resources-container">
        {resources.map(category => (
          <div key={category.category} className="resource-category">
            <div className="resource-category-header">
              <span className="resource-category-icon">{category.icon}</span>
              <h2>{category.category}</h2>
            </div>

            <div className="resource-items">
              {category.items.map((item, index) => (
                <a 
                  key={index} 
                  className="resource-card" 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <div className="resource-card-content">
                    <h3>{item.title}</h3>
                    <p className="resource-author">{item.author}</p>
                    <p className="resource-description">{item.description}</p>
                    <span className="resource-link">🔗 Visit Resource</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="resources-cta">
        <h2>Start Your Financial Journey Today</h2>
        <p>Remember: the best time to start was yesterday. The second best time is now.</p>
        <p className="resources-quote">"Financial freedom is available to those who learn about it and work for it." - Robert Kiyosaki</p>
      </div>
    </div>
  );
}