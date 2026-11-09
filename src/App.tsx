/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';
import { SignatureLoader } from './components/SignatureLoader';

// Pages
import { LandingPage } from './pages/LandingPage';
import { CategoryPage } from './pages/CategoryPage';
import { TipDetailPage } from './pages/TipDetailPage';
import { PostTipPage } from './pages/PostTipPage';
import { ProfilePage } from './pages/ProfilePage';
import { AuthPage } from './pages/AuthPage';
import { AdminPage } from './pages/AdminPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

export default function App() {
  // Signature loader shown only on the first visit per browser session
  const [showLoader, setShowLoader] = useState(() => {
    try {
      return !sessionStorage.getItem('tipjar_intro_seen');
    } catch {
      return false;
    }
  });

  const handleLoaderComplete = () => {
    try {
      sessionStorage.setItem('tipjar_intro_seen', 'true');
    } catch {
      // Ignore sessionStorage errors
    }
    setShowLoader(false);
  };

  return (
    <AppProvider>
      {showLoader && <SignatureLoader onComplete={handleLoaderComplete} />}

      <HashRouter>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen bg-[#FAF7F2] text-[#0E1A2B] antialiased selection:bg-[#FF8A3D]/20 selection:text-[#0E1A2B]">
          <Navbar />

          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
              <Route path="/tip/:id" element={<TipDetailPage />} />
              <Route path="/post" element={<PostTipPage />} />
              <Route path="/profile/:id" element={<ProfilePage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>

          <Footer />
          <ToastContainer />
        </div>
      </HashRouter>
    </AppProvider>
  );
}
