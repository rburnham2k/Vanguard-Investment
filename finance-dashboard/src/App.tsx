import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Navigation } from './components/Navigation';
import { HomePage } from './components/HomePage';
import { LearnPage } from './components/LearnPage';
import { TipsPage } from './components/TipsPage';
import { ResourcesPage } from './components/ResourcesPage';
import { Dashboard } from './components/Dashboard';

type Page = 'home' | 'learn' | 'tools' | 'tips' | 'resources';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [learnTopic, setLearnTopic] = useState<string | undefined>();

  const handleNavigate = (page: string, topic?: string) => {
    setCurrentPage(page as Page);
    if (topic) {
      setLearnTopic(topic);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'learn':
        return <LearnPage onNavigate={handleNavigate} initialTopic={learnTopic as 'investing' | 'budgeting' | 'saving' | 'debt' | 'retirement' | 'taxes'} />;
      case 'tools':
        return <Dashboard />;
      case 'tips':
        return <TipsPage />;
      case 'resources':
        return <ResourcesPage />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <ThemeProvider>
      <div className="app">
        <Navigation currentPage={currentPage} onNavigate={handleNavigate} />
        <main className="main-content">
          {renderPage()}
        </main>
      </div>
    </ThemeProvider>
  );
}