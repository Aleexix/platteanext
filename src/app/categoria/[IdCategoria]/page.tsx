"use client"

import { Footer } from '@/components/component/footer'
import { NavbarDefault } from '@/components/component/navbar-default'
import { CategoriaRelleno } from '@/components/component/categoria-relleno'
import React from 'react'
import { useEffect, useState } from 'react';
import { Navbar } from '@/components/component/navbar';



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
      <CategoriaRelleno />
      </main>
      <Footer />
    </div>
  )
}

export default Page