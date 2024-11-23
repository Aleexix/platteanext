"use client"

import { BannerWork } from '@/components/component/banner-work'
import { ComprarTienda } from '@/components/component/comprar-tienda'
import { Footer } from '@/components/component/footer'
import { NavbarDefault } from '@/components/component/navbar-default'
import React from 'react'
import { Navbar} from '@/components/component/navbar'
import { useEffect, useState } from 'react';



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
        <BannerWork />
        <main className="flex-grow">
        </main>
        <Footer />
    </div>
  )
}

export default Page


