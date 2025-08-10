/**
 * src/pages/LoginPage.tsx
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const LoginPage: React.FC = () => {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(email, password);
      toast.success('Logged in successfully');
      navigate('/products');
    } catch (error) {
      toast.error('Login failed');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      toast.success('Logged in with Google');
      navigate('/products');
    } catch (error) {
      toast.error('Google login failed');
    }
  };

  return (
    <section className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded shadow">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          Log In
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500 mb-2">or</p>
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center py-2 px-4 bg-white border rounded shadow hover:bg-gray-100 transition"
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google logo"
            className="w-5 h-5 mr-2"
          />
          <span className="text-sm text-gray-700 font-medium">Sign in with Google</span>
        </button>
      </div>
    </section>
  );
};

export default LoginPage;
