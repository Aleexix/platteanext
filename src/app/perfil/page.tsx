"use client";

import { BannerPerfil } from '@/components/component/banner-perfil';
import { Footer } from '@/components/component/footer';
import { ProductosPerfil } from '@/components/component/productos-perfil';
import React from 'react';
import { useEffect, useState } from 'react';
import { Navbar } from '@/components/component/navbar';
import { NavbarDefault } from '@/components/component/navbar-default';
import { LoadingAnimation } from '@/components/component/loading-animation';

function Page() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // Estado de carga

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
    <div className="flex flex-col min-h-screen">
      {isLoggedIn ? <Navbar cartUpdated={false} /> : <NavbarDefault />}
      <BannerPerfil />
      <main className="flex-grow">
        <ProductosPerfil />
      </main>
      <Footer />
    </div>
  );
}

export default Page;
