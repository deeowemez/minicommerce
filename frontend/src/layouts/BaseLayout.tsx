/**
 * src/layouts/BaseLayout.tsx
 */

import React, { type ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Toaster } from 'react-hot-toast';

interface BaseLayoutProps {
  children?: ReactNode;
  disablePadding?: boolean;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({ children, disablePadding = false }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main
        className={
          disablePadding
            ? 'flex-grow'
            : 'flex-grow container mx-auto px-4 py-6'
        }
      >
        <Outlet />
        {children}
      </main>

      <Footer />

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default BaseLayout;