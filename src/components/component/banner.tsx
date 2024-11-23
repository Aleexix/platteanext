"use client";
import NextCrypto from 'next-crypto';
import Image from "next/image";
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Settings, Package, NotebookIcon, Notebook, NotebookTabs, NotebookPenIcon } from 'lucide-react';
import {jwtDecode} from 'jwt-decode';

interface Tienda {
  IdPersona: number;
  NombreTienda: string;
  BannerTiendaURL: string;
}

interface DecodedToken {
  IdPersona: string;
}

export function Banner() {
  const params = useParams();
  const encryptedIdTienda = params.IdTienda as string;
  const crypto = new NextCrypto('secret key');
  const [tienda, setTienda] = useState<Tienda | null>(null);
  const [userId, setUserId] = useState<string | null>(null); // Estado para almacenar el userId
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTienda = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        // Decodificar el token y obtener el userId
        const decoded: DecodedToken = jwtDecode(token);
        setUserId(decoded.IdPersona); // Almacena el userId en el estado

        const decryptedId = await crypto.decrypt(decodeURIComponent(encryptedIdTienda));

        // Fetch tienda usando el ID desencriptado
        const response = await fetch(`http://localhost:4000/api/tienda/${decryptedId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: Tienda = await response.json();
        setTienda(data);
        console.log("data",data);
      } catch (error: any) {
        setError(error.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (encryptedIdTienda) {
      fetchTienda();
    }
  }, [encryptedIdTienda]);

  return (
    <section className="w-full">
      <div className="relative w-full h-80"> {/* Ajusta la altura según lo que consideres apropiado */}
        <Image
          src={tienda?.BannerTiendaURL || '/default-banner.jpg'} // Usar una URL por defecto si no se encuentra la imagen
          alt="Banner Image"
          layout="fill" // Ocupar todo el contenedor
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          style={{ aspectRatio: "16/9", objectFit: "cover" }} // Ajusta la proporción según sea necesario
        />
      </div>
      <div className="flex flex-col items-center justify-center py-6 md:py-8 lg:py-10">
        <h1 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl">
          {tienda?.NombreTienda || 'Nombre de Tienda'}
        </h1>
      </div>

      {/* Mostrar los enlaces solo si el IdPersona de la tienda coincide con el userId */}
      {tienda?.IdPersona === Number(userId) && (
        <div className="flex space-x-4 ml-4">
          <Link href={`/editartienda/${encryptedIdTienda}`} className="text-gray-600 hover:text-gray-900 transition-colors">
            <Settings className="w-6 h-6" />
          </Link>
          <Link href={`/administracioncubiculo/${encryptedIdTienda}`} className="text-gray-600 hover:text-gray-900 transition-colors">
            <Package className="w-6 h-6" />
          </Link>
          <Link href={`/administracioncubiculo/${encryptedIdTienda}`} className="text-gray-600 hover:text-gray-900 transition-colors">
            <NotebookPenIcon className="w-6 h-6" />
          </Link>
        </div>
      )}
    </section>
  );
}
