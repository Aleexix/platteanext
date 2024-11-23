"use client";


import { Footer } from '@/components/component/footer';
import React, { useEffect, useState } from 'react';
import { Administrador } from '@/components/component/administrador'
import { Navbar } from '@/components/component/navbar';
import { LoadingAnimation } from '@/components/component/loading-animation';
import { useRouter } from 'next/navigation'; // Asegúrate de usar el router correcto

function Page() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  // Verificar si el usuario está logueado y si es administrador
  useEffect(() => {
    const token = localStorage.getItem('token');
    const idRolFK = localStorage.getItem('idRolFK'); // Asegúrate de almacenar el rol en localStorage después del login

    console.log('Rol almacenado:', idRolFK); // Debug para verificar qué valor tiene idRolFK
    if (token) {
      setIsLoggedIn(true);
      if (idRolFK === '2') {
        setIsAdmin(true); // El usuario es administrador
        console.log('Usuario administrador');
      } else {
        setIsAdmin(false); // El usuario está logueado pero no es administrador
        console.log('Usuario NO administrador');
      }
    } else {
      setIsLoggedIn(false); // No está logueado
      console.log('Usuario no logueado');
    }

    setLoading(false); // Cambiar el estado de carga a false después de la verificación
  }, []);

  // Redirigir si el usuario no es administrador una vez que el estado de carga se haya completado
  useEffect(() => {
    if (!loading && !isAdmin) {
      console.log('Redirigiendo a la página de inicio...');
      router.push('/'); // Redirige al usuario no administrador a la página de inicio
    }
  }, [loading, isAdmin, router]);

  // Mostrar animación de carga mientras verifica el estado del usuario
  if (loading) {
    return <div><LoadingAnimation /></div>;
  }

  // Si el usuario no está logueado o no es administrador, redirige automáticamente, por lo que este contenido se muestra solo si es administrador
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar cartUpdated={false} />
      <main className="flex-grow">
        <Administrador />
      </main>
      <Footer />
    </div>
  );
}

export default Page;
