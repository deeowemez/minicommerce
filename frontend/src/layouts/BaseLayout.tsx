/**
 * src/layouts/BaseLayout.tsx
 */


import React, { type ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
// import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';

interface BaseLayoutProps {
  children: ReactNode;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* <Navbar /> */}

      <main className="flex-grow container mx-auto px-4 py-6">
        <Outlet />
      </main>
      {children}

      {/* <Footer /> */}
    </div>
  );
};

export default BaseLayout;
