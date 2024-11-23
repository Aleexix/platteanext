"use client";

import { Navbar } from '@/components/component/navbar';
import { Footer } from '@/components/component/footer';
import React, { useEffect, useState } from 'react';
import { NavbarDefault } from '@/components/component/navbar-default';
import { ResumenCompra } from '@/components/component/resumen-compra';


function Page() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {isLoggedIn ? <Navbar cartUpdated={false} /> : <NavbarDefault />}
      <main className="flex-grow">
        <ResumenCompra/>
      </main>
      <Footer /> {/* Asegúrate de que el footer esté aquí */}
    </div>
  );
}

export default Page;
