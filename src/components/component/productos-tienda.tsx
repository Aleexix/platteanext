import NextCrypto from 'next-crypto';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {  Package } from 'lucide-react';
interface Producto {
  IdProducto: string;
  NombreProducto: string;
  DescripcionProducto: string;
  StockProducto: string;
  PrecioProducto: string;
  FotoProductoURL: string;
}

export function ProductosTienda() {
  const params = useParams();
  const encryptedIdTienda = params.IdTienda as string; // Asegúrate de que sea una cadena
  const crypto = new NextCrypto('secret key');
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [encryptedIds, setEncryptedIds] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        // Reemplazar caracteres en el ID encriptado antes de decodificar
        const safeIdTienda = encryptedIdTienda.replace(/_/g, '/').replace(/-/g, '+');
        // Desencriptar el ID de la tienda
        const decryptedId = await crypto.decrypt(decodeURIComponent(safeIdTienda));

        // Fetch productos usando el ID desencriptado
        const response = await fetch(`http://localhost:4000/api/tienda/producto/${decryptedId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: Producto[] = await response.json();
        setProductos(data);

        // Encriptar IDs de productos para usar en los enlaces
        const encrypted = await Promise.all(data.map(async (producto) => {
          const encryptedId = await crypto.encrypt(producto.IdProducto);
          // Reemplazar caracteres problemáticos en el ID encriptado
          const safeId = encryptedId.replace(/\//g, '_').replace(/\+/g, '-');
          return { id: producto.IdProducto, encryptedId: safeId };
        }));

        setEncryptedIds(encrypted.reduce<{ [key: string]: string }>((acc, { id, encryptedId }) => {
          acc[id] = encryptedId;
          return acc;
        }, {}));
      } catch (error: any) {
        setError(error.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (encryptedIdTienda) {
      fetchProductos();
    }
  }, [encryptedIdTienda]);

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

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-red-50 border border-red-400 text-red-700 rounded-lg shadow-lg ml-4 mr-4 mt-4 mb-4">
        <div className="flex items-center justify-center w-16 h-16 bg-red-200 rounded-full mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M9 15c1.5-2 4.5-2 6 0" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="9" cy="9" r="1" />
            <circle cx="15" cy="9" r="1" />
          </svg>
        </div>
        <p className="text-lg font-bold text-center mb-2">¡Ups! No has agregado ningún producto</p>
        <p className="text-sm text-center text-gray-600">Agrega un producto pulsando en el botón de la caja </p><Package className="w-20 h-20" />
      </div>
    );
}


  return (
    <div className="px-4 md:px-6 py-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-center">Productos de la Tienda</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {productos.map((producto) => (
          <div key={producto.IdProducto} className="relative flex flex-col overflow-hidden rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out group">
            <Link
              href={`/product/${encryptedIds[producto.IdProducto] || ''}`}
              className="absolute inset-0 z-10"
              prefetch={false}
            >
              <span className="sr-only">View</span>
            </Link>
            <Image
              src={producto.FotoProductoURL || "/placeholder.svg"}
              alt={producto.NombreProducto}
              width={400}
              height={400}
              className="object-cover w-full h-64 group-hover:opacity-75 transition-opacity"
              quality={100}
            />
            <div className="p-4 flex flex-col justify-between h-full">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2 truncate">{truncarTexto(producto.NombreProducto, 50)}</h3>
                <p className="text-sm text-gray-600 h-20 overflow-hidden overflow-ellipsis">{truncarTexto(producto.DescripcionProducto, 100)}</p>
              </div>
              <h4 className="text-lg font-semibold mt-2">${formatPrice(producto.PrecioProducto)}</h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
}