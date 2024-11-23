import NextCrypto from 'next-crypto';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface Tienda {
  IdTienda: number;
  NombreTienda: string;
  PromedioCalificacion: string;
  MiniaturaTiendaURL: string;
  DescripcionTienda: string;
}

export function TiendasDestacadas() {
  const [tiendas, setTiendas] = useState<Tienda[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string>("");
  const [encryptedIds, setEncryptedIds] = useState<{ [key: number]: string }>({});
  const crypto = new NextCrypto('secret key');

  useEffect(() => {
    const fetchTiendas = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/tiendastop/`);

        if (response.ok) {
          const data: Tienda[] = await response.json();

          // Encriptar los IDs de las tiendas
          const encrypted = await Promise.all(data.map(async (tienda) => {
            const encryptedId = await crypto.encrypt(tienda.IdTienda.toString());
            const safeId = encryptedId.replace(/\//g, '_').replace(/\+/g, '-');
            return { id: tienda.IdTienda, encryptedId: safeId };
          }));

          setEncryptedIds(encrypted.reduce<{ [key: number]: string }>((acc, { id, encryptedId }) => {
            acc[id] = encryptedId;
            return acc;
          }, {}));

          setTiendas(data);
          setIsLoaded(true);
        } else {
          throw new Error("Error fetching stores");
        }
      } catch (error) {
        console.error(error);
        setError("Error al obtener las tiendas");
      }
    };

    fetchTiendas();
  }, []);

  const truncarTexto = (texto: string, maxLength: number) => {
    return texto.length > maxLength
      ? texto.substring(0, maxLength) + "..."
      : texto;
  };

  if (error) return <p>Error: {error}</p>;
  if (!isLoaded) return <p>Cargando...</p>;

  return (
    <section className="mt-5 p-4 md:p-1 mb-6">
      <div className="container mx-auto px-4 md:px-6 lg:px-7">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Tiendas Destacadas
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {tiendas.map((tienda) => (
            <div
              key={tienda.IdTienda}
              className="relative overflow-hidden rounded-lg group"
            >
              <Link
                href={`/shop/${encryptedIds[tienda.IdTienda] || ''}`}
                className="absolute inset-0 z-10"
                prefetch={false}
              >
                <span className="sr-only">Ver tienda</span>
              </Link>
              <img
                src={tienda.MiniaturaTiendaURL || "/placeholder.svg"}
                alt={tienda.NombreTienda}
                width={400}
                height={300}
                className="object-cover w-full h-60"
                style={{ aspectRatio: "400/300", objectFit: "cover" }}
              />
              <div className="p-4 bg-background">
                <h3 className="text-lg font-semibold md:text-xl">
                  {truncarTexto(tienda.NombreTienda, 20)}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Calificación: {parseFloat(tienda.PromedioCalificacion).toFixed(1)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {truncarTexto(tienda.DescripcionTienda, 100)}
                </p>
                <Button size="sm" className="bg-plattea1 text-plattea2">
                  Ver Más
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
