export function HomePage({ onNavigate }: { onNavigate: (page: string, topic?: string) => void }) {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Master Your Money</h1>
          <p className="hero-subtitle">
            Your comprehensive guide to financial literacy, smart budgeting, and building wealth
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={() => onNavigate('learn')}>
              Start Learning
            </button>
            <button className="btn btn-secondary" onClick={() => onNavigate('tools')}>
              Explore Tools
            </button>
          </div>
        </div>
        <div className="hero-stats">
          <div className="stat-card" onClick={() => onNavigate('tools')}>
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <h3>Track Expenses</h3>
              <p>Monitor every dollar</p>
            </div>
          </div>
          <div className="stat-card" onClick={() => onNavigate('learn')}>
            <div className="stat-icon">🎯</div>
            <div className="stat-info">
              <h3>Set Goals</h3>
              <p>Achieve financial freedom</p>
            </div>
          </div>
          <div className="stat-card" onClick={() => onNavigate('learn', 'investing')}>
            <div className="stat-icon">📈</div>
            <div className="stat-info">
              <h3>Grow Wealth</h3>
              <p>Invest wisely</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2 className="section-title">What You'll Learn</h2>
        <div className="features-grid">
          <div className="feature-card" onClick={() => onNavigate('learn', 'budgeting')}>
            <div className="feature-icon">💰</div>
            <h3>Budgeting Basics</h3>
            <p>Learn how to create and maintain a budget that works for your lifestyle</p>
          </div>
          <div className="feature-card" onClick={() => onNavigate('learn', 'saving')}>
            <div className="feature-icon">🏦</div>
            <h3>Saving Strategies</h3>
            <p>Discover effective ways to save money and build an emergency fund</p>
          </div>
          <div className="feature-card" onClick={() => onNavigate('learn', 'investing')}>
            <div className="feature-icon">📈</div>
            <h3>Investment Fundamentals</h3>
            <p>Understand stocks, bonds, and how to make your money work for you</p>
          </div>
          <div className="feature-card" onClick={() => onNavigate('learn', 'debt')}>
            <div className="feature-icon">💳</div>
            <h3>Debt Management</h3>
            <p>Learn strategies to pay off debt and improve your credit score</p>
          </div>
          <div className="feature-card" onClick={() => onNavigate('learn', 'taxes')}>
            <div className="feature-icon">🛡️</div>
            <h3>Financial Protection</h3>
            <p>Understand insurance, taxes, and protecting your financial future</p>
          </div>
          <div className="feature-card" onClick={() => onNavigate('learn')}>
            <div className="feature-icon">🎓</div>
            <h3>Financial Literacy</h3>
            <p>Build the knowledge base for making informed financial decisions</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Take Control of Your Finances?</h2>
          <p>Start your journey to financial freedom today with our comprehensive tools and resources</p>
          <button className="btn btn-primary btn-large" onClick={() => onNavigate('tools')}>
            Get Started Now
          </button>
        </div>
      </section>
    </div>
  );
}