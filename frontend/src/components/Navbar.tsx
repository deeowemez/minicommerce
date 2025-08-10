/**
 * src/components/Navbar.tsx
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useLibrary } from '../contexts/LibraryContext';
import { ShoppingCartIcon, BookOpenIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { items: cartItems } = useCart();
  const { items: libraryItems } = useLibrary();
  const location = useLocation();

  const navLinkClass = (path: string) =>
    clsx(
      'px-3 py-2 rounded hover:bg-indigo-100 transition',
      location.pathname === path && 'bg-indigo-200 font-semibold'
    );

  return (
    <header className="bg-white shadow">
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-indigo-600">AlmostSteam</Link>
        <div className="flex items-center gap-4">
          <Link to="/products" className={navLinkClass('/products')}>Games</Link>

          <Link to="/cart" className={navLinkClass('/cart')}>
            <ShoppingCartIcon className="h-5 w-5 inline-block" />
            <span className="ml-1">{cartItems.length}</span>
          </Link>

          <Link to="/library" className={navLinkClass('/library')}>
            <BookOpenIcon className="h-5 w-5 inline-block" />
            <span className="ml-1">{libraryItems.length}</span>
          </Link>

          {user ? (
            <>
              <span className="text-sm text-gray-700">{user.email}</span>
              <button onClick={logout} className="text-sm text-red-500">Logout</button>
            </>
          ) : (
            <Link to="/login" className={navLinkClass('/login')}>
              <UserCircleIcon className="h-5 w-5 inline-block" />
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
