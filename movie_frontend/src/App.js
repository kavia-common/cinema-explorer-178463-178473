import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import SectionCard from './components/SectionCard';

/**
 * PUBLIC_INTERFACE
 * App - main application shell.
 * Renders Header, a welcome hero, Featured and Trending placeholders, and Footer.
 */
function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-royal-start to-royal-end">
      <Header />
      <main className="flex-1">
        {/* Hero / Welcome Section */}
        <section className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-text">Welcome to MovieAI</h2>
            <p className="mt-3 text-secondary">
              Discover featured picks and explore trending movies powered by an elegant Royal Purple theme.
            </p>
          </div>

          {/* Featured / Trending Cards */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <SectionCard
              title="Featured"
              description="Curated highlights and staff picks."
              actionText="View Featured"
            />
            <SectionCard
              title="Trending Movies"
              description="See what's popular right now."
              actionText="View Trending"
            />
          </div>
        </section>

        {/* Trending Movies Placeholder Section */}
        <section className="bg-surface">
          <div className="max-w-6xl mx-auto px-4 py-10">
            <h3 className="text-2xl font-semibold text-text">Trending Movies</h3>
            <p className="text-secondary mt-1">Coming soon: real data from TMDB.</p>

            {/* Placeholder grid */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div key={idx} className="card-surface h-32 sm:h-40 md:h-48 flex items-center justify-center">
                  <span className="text-secondary text-sm">Movie {idx + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default App;
