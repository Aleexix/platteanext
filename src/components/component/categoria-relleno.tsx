"use client";
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import Link from "next/link";
import NextCrypto from 'next-crypto';

interface Tienda {
  IdTienda: string;
  NombreTienda: string;
  DescripcionTienda: string;
  DireccionTienda: string;
  MiniaturaTiendaURL: string;
  CiudadTienda: string;
}

interface Categoria {
  IdCategoria: number;
  NombreCategoria: string;
  FotoCategoria: string | null;
}

export function CategoriaRelleno() {
  const params = useParams();
  const router = useRouter();
  const [tiendas, setTiendas] = useState<Tienda[]>([]);
  const [nombreCategoria, setNombreCategoria] = useState<string>("");
  const [encryptedTiendas, setEncryptedTiendas] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState<string>("");
  const encryptedCategoriaId = params.IdCategoria as string;
  const crypto = new NextCrypto('secret key'); // Cambia 'secret key' por tu clave real

  useEffect(() => {
    const fetchTiendas = async () => {
      console.log("encryptedCategoriaId:", encryptedCategoriaId);

      if (!encryptedCategoriaId) {
        setError("No category ID provided.");
        return;
      }

      try {
        const safeIdProducto = encryptedCategoriaId.replace(/_/g, '/').replace(/-/g, '+');
        const decodedId = decodeURIComponent(safeIdProducto);
        const decrypted = await crypto.decrypt(decodedId);
        console.log("ID desencriptado:", decrypted);

        // Fetch tiendas
        const response = await fetch(`http://localhost:4000/api/tienda/obtenerPorCategoria/${decrypted}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: Tienda[] = await response.json();
        setTiendas(data);
        
        // Encriptar los IDs de las tiendas
        const encryptedIds = await Promise.all(
          data.map(async (tienda) => {
            const encryptedId = await crypto.encrypt(tienda.IdTienda);
            return {
              id: tienda.IdTienda,
              encryptedId: encryptedId,
            };
          })
        );

        const encryptedTiendasObj = encryptedIds.reduce((acc, { id, encryptedId }) => {
          acc[id] = encryptedId;
          return acc;
        }, {} as { [key: string]: string });

        setEncryptedTiendas(encryptedTiendasObj);

        // Fetch categoria
        const categoriaResponse = await fetch(`http://localhost:4000/api/categoria/${decrypted}`);
        if (!categoriaResponse.ok) {
          throw new Error(`HTTP error! Status: ${categoriaResponse.status}`);
        }
        const categoriaData: Categoria = await categoriaResponse.json();
        setNombreCategoria(categoriaData.NombreCategoria); // Asignar el nombre de la categoría

      } catch (error: any) {
        console.error("Error fetching tiendas data:", error.message);
        setError("Failed to fetch tiendas data: " + error.message);
      }
    };

    fetchTiendas();
  }, [encryptedCategoriaId]);

  if (error) return <p>Error: {error}</p>;

  return (
    <section className="w-full max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16">
      <div className="flex items-center justify-between mb-8 md:mb-10">
        <h2 className="text-2xl md:text-3xl font-bold">{nombreCategoria || "Cargando..."}</h2> {/* Mostrar NombreCategoria */}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
        {tiendas.length > 0 ? (
          tiendas.map((tienda) => (
            <div key={tienda.IdTienda} className="bg-background rounded-lg overflow-hidden shadow-lg group">
              <Link href={`/shop/${encryptedTiendas[tienda.IdTienda]}`} className="block" prefetch={false}>
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
