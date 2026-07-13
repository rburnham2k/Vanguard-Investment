import { useState } from 'react';

type TopicKey = 'budgeting' | 'saving' | 'investing' | 'debt' | 'retirement' | 'taxes';

interface LearnPageProps {
  onNavigate: (page: string) => void;
  initialTopic?: TopicKey;
}

export function LearnPage({ onNavigate, initialTopic }: LearnPageProps) {
  const [activeTopic, setActiveTopic] = useState<TopicKey>(initialTopic || 'budgeting');

  const topics = {
    budgeting: {
      title: 'Budgeting Basics',
      icon: '💰',
      content: [
        {
          heading: 'What is a Budget?',
          text: 'A budget is a plan for your money. It helps you track income and expenses to ensure you are living within your means and working toward your financial goals.'
        },
        {
          heading: 'The 50/30/20 Rule',
          text: 'A popular budgeting framework: 50% for needs (rent, food, utilities), 30% for wants (entertainment, dining out), and 20% for savings and debt repayment.'
        },
        {
          heading: 'Zero-Based Budgeting',
          text: 'Every dollar has a job. Income minus expenses equals zero. This method ensures you are intentionally allocating every dollar before the month begins.'
        },
        {
          heading: 'Tips for Success',
          text: 'Start simple, track regularly, adjust as needed, and don\'t be too strict. Allow room for flexibility and enjoyment while staying on track.'
        }
      ]
    },
    saving: {
      title: 'Saving Strategies',
      icon: '🏦',
      content: [
        {
          heading: 'Emergency Fund',
          text: 'Save 3-6 months of expenses in an easily accessible account. This safety net protects you from unexpected costs like medical bills or job loss.'
        },
        {
          heading: 'Pay Yourself First',
          text: 'Automate savings immediately after receiving income. Treat savings like a non-negotiable expense to build wealth consistently.'
        },
        {
          heading: 'High-Yield Savings Accounts',
          text: 'Park your emergency fund in a high-yield savings account (HYSA) to earn better interest than traditional savings accounts.'
        },
        {
          heading: 'Saving Goals',
          text: 'Set specific, measurable goals (vacation, down payment, retirement). Break large goals into smaller milestones to stay motivated.'
        }
      ]
    },
    investing: {
      title: 'Investment Fundamentals',
      icon: '📈',
      content: [
        {
          heading: 'Compound Interest',
          text: 'Einstein called it the "eighth wonder of the world." Your money earns returns, and those returns earn returns. Start early to maximize growth.'
        },
        {
          heading: 'Stocks vs. Bonds',
          text: 'Stocks represent ownership in companies (higher risk, higher potential returns). Bonds are loans to governments/corporations (lower risk, steady income).'
        },
        {
          heading: 'Diversification',
          text: 'Don\'t put all eggs in one basket. Spread investments across different asset classes, sectors, and geographies to reduce risk.'
        },
        {
          heading: 'Index Funds & ETFs',
          text: 'Low-cost funds that track market indices. Perfect for beginners - instant diversification with minimal fees and effort.'
        }
      ]
    },
    debt: {
      title: 'Debt Management',
      icon: '💳',
      content: [
        {
          heading: 'Good vs. Bad Debt',
          text: 'Good debt (mortgage, student loans) builds wealth. Bad debt (high-interest credit cards) drains wealth. Focus on eliminating bad debt first.'
        },
        {
          heading: 'Debt Snowball Method',
          text: 'Pay minimums on all debts, then attack the smallest balance first. Quick wins build momentum and motivation.'
        },
        {
          heading: 'Debt Avalanche Method',
          text: 'Pay minimums on all debts, then tackle the highest interest rate first. Mathematically optimal - saves the most money on interest.'
        },
        {
          heading: 'Credit Score Basics',
          text: 'Pay on time, keep credit utilization low (under 30%), maintain old accounts, and limit new credit inquiries. Aim for 750+ for best rates.'
        }
      ]
    },
    retirement: {
      title: 'Retirement Planning',
      icon: '🏖️',
      content: [
        {
          heading: 'Start Early',
          text: 'Time is your greatest asset. Someone starting at 25 needs to save less monthly than someone starting at 35 to reach the same goal.'
        },
        {
          heading: '401(k) & Employer Match',
          text: 'Always contribute enough to get your full employer match - it is free money. This is the easiest return on investment you will ever get.'
        },
        {
          heading: 'IRA Options',
          text: 'Traditional IRA (tax-deductible contributions, taxed on withdrawal) versus Roth IRA (after-tax contributions, tax-free growth). Choose based on current versus expected future tax bracket.'
        },
        {
          heading: 'The 4% Rule',
          text: 'Withdraw 4% of your portfolio annually in retirement. This strategy aims to make your money last 30+ years without running out.'
        }
      ]
    },
    taxes: {
      title: 'Tax Essentials',
      icon: '📋',
      content: [
        {
          heading: 'Diversification',
          text: 'Do not put all eggs in one basket. Spread investments across different asset classes, sectors, and geographies to reduce risk.'
        },
        {
          heading: 'Tax-Advantaged Accounts',
          text: 'Utilize 401(k), IRA, HSA, and 529 plans. These accounts offer tax benefits that can save you thousands over your lifetime.'
        },
        {
          heading: 'Deductions & Credits',
          text: 'Deductions lower taxable income. Credits directly reduce tax owed. Keep records of eligible expenses (mortgage interest, charitable donations, etc.).'
        },
        {
          heading: 'Tax-Loss Harvesting',
          text: 'Sell investments at a loss to offset capital gains taxes. A sophisticated strategy for taxable investment accounts.'
        }
      ]
    }
  };

  return (
    <div className="learn-page">
      <div className="learn-header">
        <h1>Financial Education Center</h1>
        <p>Master essential money skills with our comprehensive guides</p>
      </div>

      <div className="learn-container">
        <div className="topic-selector">
          {Object.entries(topics).map(([key, topic]) => (
            <button
              key={key}
              className={`topic-btn ${activeTopic === key ? 'topic-btn-active' : ''}`}
              onClick={() => setActiveTopic(key as TopicKey)}
            >
              <span className="topic-icon">{topic.icon}</span>
              <span className="topic-label">{topic.title}</span>
            </button>
          ))}
        </div>

        <div className="topic-content">
          <div className="topic-header">
            <span className="topic-icon-large">{topics[activeTopic].icon}</span>
            <h2>{topics[activeTopic].title}</h2>
          </div>

          <div className="content-cards">
            {topics[activeTopic].content.map((item, index) => (
              <div key={index} className="content-card">
                <h3>{item.heading}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>

          <div className="topic-cta">
            <h3>Ready to Apply What You Learned?</h3>
            <p>Use our interactive tools to put these concepts into practice</p>
            <button className="btn btn-primary" onClick={() => onNavigate('tools')}>
              Try Our Tools
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}