import NextCrypto from 'next-crypto';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";



interface Producto {
  IdProducto: string;
  NombreProducto: string;
  PromedioCalificacion: string; // Asegúrate de que este campo existe si lo vas a usar
  PrecioProducto: string; // Asegúrate de que este campo existe si lo vas a usar
  FotoProductoURL: string;
}

export function ProductosDestacados() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string>("");
  const [encryptedIds, setEncryptedIds] = useState<{ [key: string]: string }>({});
  const crypto = new NextCrypto('secret key'); // Llave de encriptación

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/productosdestacados/`);

        if (response.ok) {
          const data: Producto[] = await response.json();

          // Encriptar los IDs de los productos
          const encrypted = await Promise.all(data.map(async (producto) => {
            const encryptedId = await crypto.encrypt(producto.IdProducto);
            const safeId = encryptedId.replace(/\//g, '_').replace(/\+/g, '-');
            return { id: producto.IdProducto, encryptedId: safeId };
          }));

          setEncryptedIds(encrypted.reduce<{ [key: string]: string }>((acc, { id, encryptedId }) => {
            acc[id] = encryptedId;
            return acc;
          }, {}));

          setProductos(data);
          setIsLoaded(true);
        } else {
          throw new Error("Error fetching products");
        }
      } catch (error) {
        console.error(error);
        setError("Error al obtener los productos");
      }
    };

    fetchProductos();
  }, []);
  const truncarTexto = (texto: string, maxLength: number) => {
    return texto.length > maxLength
      ? texto.substring(0, maxLength) + "..."
      : texto;
  };
  const formatPrice = (precio: string) => {
    // Convertir el precio a número y formatearlo con puntos de miles
    const numero = Number(precio);
    return new Intl.NumberFormat('es-ES').format(numero);
  };

  if (error) return <p>Error: {error}</p>;
  if (!isLoaded) return <p>Cargando...</p>;

  return (
    <section className="mt-5 p-4 md:p-1 mb-6">
      <div className="container mx-auto px-4 md:px-6 lg:px-7">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Productos Destacados
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {productos.map((producto) => (
            <div
              key={producto.IdProducto}
              className="relative overflow-hidden rounded-lg group"
            >
              <Link
                href={`/product/${encryptedIds[producto.IdProducto] || ''}`}
                className="absolute inset-0 z-10"
                prefetch={false}
              >
                <span className="sr-only">Ver producto</span>
              </Link>
              <img
                src={producto.FotoProductoURL || "/placeholder.svg"}
                alt={producto.NombreProducto}
                width={400}
                height={300}
                className="object-cover w-full h-60"
                style={{ aspectRatio: "400/300", objectFit: "cover" }}
              />
              <div className="p-4 bg-background">
                <h3 className="text-lg font-semibold md:text-xl">
                {truncarTexto(producto.NombreProducto, 18)}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Calificación: {parseFloat(producto.PromedioCalificacion).toFixed(1)}
                </p>
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-semibold md:text-lg">
                    ${formatPrice(producto.PrecioProducto)}
                  </h4>
                  <Button size="sm" className="bg-plattea1 text-plattea2">
                    Ver
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
