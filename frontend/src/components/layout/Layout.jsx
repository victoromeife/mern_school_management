import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import Header from './Header';
import Breadcrumbs from './Breadcrumbs';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [routeLoading, setRouteLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const routeName = location.pathname === '/'
      ? 'Dashboard'
      : location.pathname.slice(1).split('/')[0].replace(/-/g, ' ');
    const pageTitle = `${routeName.charAt(0).toUpperCase()}${routeName.slice(1)} | EduFlow`;

    document.title = pageTitle;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setRouteLoading(true);

    const timeout = window.setTimeout(() => {
      setRouteLoading(false);
    }, 320);

    return () => window.clearTimeout(timeout);
  }, [location.pathname]);

  const contentPaddingClass = sidebarOpen
    ? sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'
    : '';

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-3 focus:py-2 focus:bg-surface-100 dark:focus:bg-surface-800 focus:text-surface-900 dark:focus:text-white rounded-md transition-all"
      >
        Skip to main content
      </a>
      <div className={`fixed top-0 left-0 h-1 bg-primary-500 transition-all duration-300 z-30 ${routeLoading ? 'w-full' : 'w-0'}`} />

      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <>
            {/* Mobile overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black lg:hidden z-20"
              onClick={() => setSidebarOpen(false)}
            />
            <Sidebar
              isOpen={sidebarOpen}
              setIsOpen={setSidebarOpen}
              collapsed={sidebarCollapsed}
              setCollapsed={setSidebarCollapsed}
            />
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className={`transition-all duration-300 ${contentPaddingClass}`}>
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main id="main-content" className="p-4 sm:p-6 lg:p-8">
          <Breadcrumbs />
          
          {/* Page content with animation */}
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Layout;