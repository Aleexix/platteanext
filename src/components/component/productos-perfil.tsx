"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { jwtDecode } from 'jwt-decode';
import NextCrypto from 'next-crypto';

interface DecodedToken {
  IdPersona: string;
}

interface Tienda {
  IdTienda: string;
  NombreTienda: string;
  DescripcionTienda: string;
  DireccionTienda: string;
  MiniaturaTiendaURL: string;
}

export function ProductosPerfil() {
  const [tiendas, setTiendas] = useState<Tienda[]>([]);
  const [encryptedTiendas, setEncryptedTiendas] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const crypto = new NextCrypto('secret key'); // Instancia de NextCrypto

  useEffect(() => {
    const fetchTiendas = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const decoded: DecodedToken = jwtDecode(token);
        const userId = decoded.IdPersona;

        const response = await fetch(`http://localhost:4000/api/persona/tienda/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data: Tienda[] = await response.json();
          setTiendas(data);
          await encryptTiendas(data); // Encriptar IDs después de obtener las tiendas
        } else {
          throw new Error("Error fetching tiendas");
        }
      } catch (error) {
        console.error(error);
        setError("Failed to fetch tiendas data.");
      }
    };

    fetchTiendas();
  }, []);

  const encryptTiendas = async (tiendas: Tienda[]) => {
    const encryptedIds = await Promise.all(tiendas.map(async (tienda) => {
      const encryptedId = await crypto.encrypt(tienda.IdTienda);
      return encryptedId.replace(/\//g, '_').replace(/\+/g, '-'); // Reemplazar caracteres problemáticos
    }));
    setEncryptedTiendas(encryptedIds);
  };

  const truncarTexto = (texto: string, maxLength: number) => {
    return texto.length > maxLength
      ? texto.substring(0, maxLength) + "..."
      : texto;
  };
  if (error) return <p>Error: {error}</p>;

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="mx-auto container grid max-w-5xl items-center justify-center gap-4 px-4 md:gap-8 md:px-6 lg:grid-cols-1 lg:text-left xl:max-w-6xl xl:gap-10">
        <div className="space-y-4 md:space-y-6">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Mis Tiendas</h2>
          </div>
        </div>
        <div className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {tiendas.map((tienda, index) => (
            <Link key={tienda.IdTienda} href={`/shop/${encryptedTiendas[index]}`}>
              <div className="relative group overflow-hidden rounded-lg">
                <Image
                  src={tienda.MiniaturaTiendaURL || "/placeholder.svg"}
                  width={400}
                  height={400}
                  alt={tienda.NombreTienda}
                  className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
                  style={{ aspectRatio: "400/400", objectFit: "cover" }}
                />
                <div className="absolute pw-12 inset-0 bg-black/70 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-lg font-semibold mb-2">{tienda.NombreTienda}</h3>
                  <p className="text-sm ml-4">{truncarTexto(tienda.DescripcionTienda, 300)}</p>
                </div>
              </div>
            </Link>
          ))}
          <div className="relative group overflow-hidden rounded-lg">
            <Image
              src="/placeholder.svg"
              width={400}
              height={400}
              alt="Agregar Tienda"
              className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
              style={{ aspectRatio: "400/400", objectFit: "cover" }}
            />
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white opacity-100 transition-opacity duration-300">
              <Link
                href="/agregartienda"
                className="mt-4 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/80"
                prefetch={false}
              >
                +
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
