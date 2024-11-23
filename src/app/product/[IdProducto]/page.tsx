"use client";
import React, { useEffect, useState } from 'react';
import { Footer } from '@/components/component/footer';
import { NavbarDefault } from '@/components/component/navbar-default';
import { Producto } from '@/components/component/producto';
import { ProductosProducto } from '@/components/component/productos-producto';
import { Comentariodos } from '@/components/component/comentariodos';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/component/navbar';
import { LoadingAnimation } from '@/components/component/loading-animation';

function Page() {
  const { IdProducto } = useParams(); // Obtiene el ID del producto de la URL
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cartUpdated, setCartUpdated] = useState(false); // Estado para forzar recarga de la navbar
  const [alert, setAlert] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); // Establece el estado según la existencia del token
    setLoading(false); // Establece loading en false después de verificar el token
  }, []);

  const handleCartUpdate = () => {
    setCartUpdated(prev => !prev); // Alterna el valor para forzar actualización
  };

  // Convierte IdProducto a un string si es un array
  const idProducto = Array.isArray(IdProducto) ? IdProducto[0] : IdProducto;

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {isLoggedIn ? <Navbar cartUpdated={cartUpdated} /> : <NavbarDefault />}
      <Producto onAddToCart={handleCartUpdate} /> {/* Cambié handleAddToCart a onAddToCart */}
      <div className="w-full h-full flex-grow">
        <ProductosProducto encryptedIdProducto={idProducto || ''} />
      </div>
      <main className="flex-grow w-full h-full flex m-auto">
        <Comentariodos idProducto={idProducto || ''} />
      </main>
      <Footer />
    </div>
  );
}

export default Page;
