import { useState } from 'react';

interface Tip {
  category: string;
  icon: string;
  title: string;
  description: string;
  items: string[];
}

export function TipsPage() {
  const [activeCategory, setActiveCategory] = useState('daily');

  const tips: Tip[] = [
    {
      category: 'daily',
      icon: '📅',
      title: 'Daily Money Habits',
      description: 'Small daily actions that lead to big financial results',
      items: [
        'Track every expense, no matter how small - awareness is the first step to change',
        'Pack lunch instead of eating out - save $10-15 per day, $300-450 per month',
        'Use cash for discretionary spending - physically seeing money leave helps control spending',
        'Review subscriptions monthly - cancel unused services to save $50-100 monthly',
        'Wait 24 hours before making non-essential purchases - avoid impulse buying',
        'Check bank accounts daily - catch fraud early and stay aware of balances'
      ]
    },
    {
      category: 'monthly',
      icon: '📊',
      title: 'Monthly Financial Checkups',
      description: 'Regular reviews to keep your finances on track',
      items: [
        'Review budget vs actual spending - adjust categories as needed',
        'Pay credit cards in full - avoid 15-25% interest charges',
        'Transfer to savings immediately - pay yourself first',
        'Check credit score monthly - monitor for errors and track improvement',
        'Review automatic payments - ensure bills are paid on time',
        'Update net worth statement - track progress toward financial goals'
      ]
    },
    {
      category: 'saving',
      icon: '💵',
      title: 'Smart Saving Strategies',
      description: 'Maximize your savings with these proven techniques',
      items: [
        'Use high-yield savings accounts - earn 10-20x more interest than traditional accounts',
        'Automate savings transfers - remove willpower from the equation',
        'Save windfalls (tax refunds, bonuses) - do not upgrade lifestyle with extra income',
        'Round up purchases and save the difference - painless way to build savings',
        'Set up separate savings accounts for different goals - visual progress motivates',
        'Negotiate bills annually - call providers and ask for better rates'
      ]
    },
    {
      category: 'investing',
      icon: '📈',
      title: 'Investment Best Practices',
      description: 'Build wealth with smart investment strategies',
      items: [
        'Start with employer 401(k) match - free money, guaranteed 100% return',
        'Keep fees under 0.5% annually - every 1% in fees costs you 25% of portfolio over 40 years',
        'Diversify across asset classes - stocks, bonds, real estate, international',
        'Rebalance annually - maintain target allocation, buy low sell high automatically',
        'Ignore market noise - stay invested through volatility, time in market beats timing market',
        'Maximize tax-advantaged accounts - 401(k), IRA, HSA before taxable accounts'
      ]
    },
    {
      category: 'debt',
      icon: '💳',
      title: 'Debt Elimination Tactics',
      description: 'Free yourself from debt with these strategies',
      items: [
        'List all debts with balances, minimums, and interest rates - know your enemy',
        'Choose snowball or avalanche method - pick what keeps you motivated',
        'Stop taking on new debt - cut up credit cards, use cash/debit only',
        'Consider balance transfer cards - 0% APR buys time to pay down principal',
        'Call creditors to negotiate lower rates - worst they can say is no',
        'Make bi-weekly payments - 26 payments per year instead of 24, accelerate payoff'
      ]
    },
    {
      category: 'mindset',
      icon: '🧠',
      title: 'Financial Mindset',
      description: 'Develop the right psychology for financial success',
      items: [
        'Focus on progress, not perfection - small steps compound over time',
        'Celebrate financial wins - reinforce positive behavior',
        'Learn from mistakes - every financial error is a lesson',
        'Avoid lifestyle inflation - increase savings rate with income, not spending',
        'Surround yourself with financially-minded people - mindset is contagious',
        'Read personal finance books - knowledge compounds like money'
      ]
    }
  ];

  return (
    <div className="tips-page">
      <div className="tips-header">
        <h1>Financial Tips & Strategies</h1>
        <p>Actionable advice to improve your financial health</p>
      </div>

      <div className="tips-container">
        <div className="tips-categories">
          {tips.map(tip => (
            <button
              key={tip.category}
              className={`tip-category-btn ${activeCategory === tip.category ? 'tip-category-active' : ''}`}
              onClick={() => setActiveCategory(tip.category)}
            >
              <span className="tip-category-icon">{tip.icon}</span>
              <span className="tip-category-label">{tip.title}</span>
            </button>
          ))}
        </div>

        <div className="tips-content">
          {tips
            .filter(tip => tip.category === activeCategory)
            .map(tip => (
              <div key={tip.category} className="tip-section">
                <div className="tip-section-header">
                  <span className="tip-section-icon">{tip.icon}</span>
                  <div>
                    <h2>{tip.title}</h2>
                    <p>{tip.description}</p>
                  </div>
                </div>

                <div className="tip-items">
                  {tip.items.map((item, index) => (
                    <div key={index} className="tip-item">
                      <div className="tip-item-number">{index + 1}</div>
                      <p>{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}