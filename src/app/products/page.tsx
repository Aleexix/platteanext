"use client";

import { Footer } from '@/components/component/footer';
import { NavbarDefault } from '@/components/component/navbar-default';
import { Navbar } from '@/components/component/navbar';
import { Productos } from '@/components/component/productos';
import React, { useEffect, useState } from 'react';
import { LoadingAnimation } from '@/components/component/loading-animation'; // Asegúrate de importar tu animación de carga

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
      <main className="flex-grow">
        <Productos />
      </main>
      <Footer />
    </div>
  );
}

export default Page;
