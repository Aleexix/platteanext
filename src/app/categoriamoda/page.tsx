"use client";

import React, { useState, useEffect } from 'react';
import { Footer } from '@/components/component/footer';
import { NavbarDefault } from '@/components/component/navbar-default';
import { Navbar } from '@/components/component/navbar';
import { CategoriaModa } from '@/components/component/categoria-moda';
import { LoadingAnimation } from '@/components/component/loading-animation';

function Page() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
    setLoading(false); // Cambia el estado de carga a false después de la verificación
  }, []);

  if (loading) {
    return <div><LoadingAnimation /></div>; // Mostrar animación de carga
  }

  return (
    <div className='flex flex-col min-h-screen'>
      {isLoggedIn ? <Navbar cartUpdated={false} /> : <NavbarDefault />}
      <main className='flex-grow'>
        <CategoriaModa />
      </main>
      <Footer />
    </div>
  );
}

export default Page;
