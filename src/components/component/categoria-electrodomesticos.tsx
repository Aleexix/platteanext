"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Tienda {
  IdTienda: string;
  NombreTienda: string;
  DescripcionTienda: string;
  DireccionTienda: string;
  MiniaturaTiendaURL: string;
  CiudadTienda: string;
}

export function CategoriaElectrodomesticos() {
  const [tiendas, setTiendas] = useState<Tienda[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchTiendas = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/tienda/electrodomesticos`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: Tienda[] = await response.json();
        setTiendas(data);
      } catch (error: any) {
        console.error("Error fetching tiendas data:", error.message);
        setError("Failed to fetch tiendas data: " + error.message);
      }
    };
  
    fetchTiendas();
  }, []);
  

  if (error) return <p>Error: {error}</p>;

  return (
    <section className="w-full max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16">
      <div className="flex items-center justify-between mb-8 md:mb-10">
        <h2 className="text-2xl md:text-3xl font-bold">Electrodomesticos</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
        {tiendas.length > 0 ? (
          tiendas.map((tienda) => (
            <div key={tienda.IdTienda} className="bg-background rounded-lg overflow-hidden shadow-lg group">
              <Link href={`/tiendas/${tienda.IdTienda}`} className="block" prefetch={false}>
                <img
                  src={tienda.MiniaturaTiendaURL}
                  alt={tienda.NombreTienda}
                  width={400}
                  height={300}
                  className="w-full h-60 object-cover group-hover:opacity-90 transition-opacity"
                  style={{ aspectRatio: "4/3", objectFit: "cover" }}
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-1">{tienda.NombreTienda}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{tienda.DescripcionTienda}</p>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <p className="text-center text-lg text-gray-600 ">No hay tiendas disponibles en esta categoría.</p>
        )}
      </div>
    </section>
  );
}
