/**
 * src/components/Footer.tsx
 */

import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t mt-12 py-6 text-center text-sm text-gray-500">
      © {new Date().getFullYear()} KulturaKart. All rights reserved.
    </footer>
  );
};

export default Footer;
