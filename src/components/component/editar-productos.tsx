import NextCrypto from 'next-crypto';
import { SVGProps, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import { AgregarProducto } from './agregar-producto';
import { ProductoEditar } from './producto-editar';
import Swal from 'sweetalert2'; // Importa SweetAlert2
import { HistorialComprasButtonComponent } from '../historial-compras-button';

interface Producto {
  IdProducto: string;
  NombreProducto: string;
  DescripcionProducto: string;
  StockProducto: string;
  PrecioProducto: string;
  FotoProductoURL: string;
}

export function EditarProductos() {
  const params = useParams();
  const router = useRouter();
  const encryptedIdTienda = params.IdTienda as string;
  const crypto = new NextCrypto('secret key');
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [encryptedProductLinks, setEncryptedProductLinks] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    if (encryptedIdTienda) {
      const fetchProductos = async () => {
        try {
          const safeIdTienda = encryptedIdTienda.replace(/_/g, '/').replace(/-/g, '+');
          const decryptedId = await crypto.decrypt(decodeURIComponent(safeIdTienda));

          const response = await fetch(`http://localhost:4000/api/tienda/producto/${decryptedId}`);
          if (response.status === 404) {
            setProductos([]);
            return;
          }
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data: Producto[] = await response.json();
          setProductos(data);

          // Encriptar IDs de productos para los enlaces
          const productLinks = new Map<string, string>();
          for (const producto of data) {
            const encryptedId = await crypto.encrypt(producto.IdProducto);
            const safeId = encryptedId.replace(/\//g, '_').replace(/\+/g, '-');
            productLinks.set(producto.IdProducto, safeId);
          }
          setEncryptedProductLinks(productLinks);
        } catch (error: any) {
          setError(error.message || 'An unexpected error occurred');
        } finally {
          setLoading(false);
        }
      };

      fetchProductos();
    }
  }, [encryptedIdTienda]);

  useEffect(() => {
    if (productoSeleccionado) {
      console.log('Selected Product:', productoSeleccionado);
    }
  }, [productoSeleccionado]);

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const handleDelete = async (idProducto: string) => {
    const confirmed = window.confirm('¿Estás seguro de que deseas eliminar este producto?');
    if (!confirmed) return;
  
    try {
      // Encriptar el ID del producto
      const encryptedId = await crypto.encrypt(idProducto);
      const safeId = encryptedId.replace(/\//g, '_').replace(/\+/g, '-');
  
      // Realizar la solicitud de eliminación
      const response = await fetch(`http://localhost:4000/api/producto/${safeId}`, {
        method: 'DELETE',
      });
  
      // Verificar la respuesta
      if (!response.ok) {
        throw new Error('No se pudo eliminar el producto');
      }
  
      // Actualizar el estado de productos
      setProductos((prevProductos) => prevProductos.filter(producto => producto.IdProducto !== idProducto));
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      alert('Error al eliminar el producto. Intenta nuevamente más tarde.');

    }
  };
  return (
    <div>
      <div className="left-4 pt-8 pb-8">
        <Button
          onClick={() => router.back()}
          className="inline-flex h-10 ml-4 items-center justify-center rounded-md border border-input bg-accent text-accent-foreground px-4 text-sm font-medium shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-10 hover:bg-gray-200"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Volver atrás
        </Button>
        <div className="relative mb-1">
  <div className="flex justify-end gap-4 pr-4">
    <AgregarProducto />
    <HistorialComprasButtonComponent />
  </div>
</div>
      </div>
      <h1 className="text-2xl font-bold mb-6 ml-4">Administración de Productos</h1>

      {productos.length > 0 ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 ml-4 mr-4">
          {productos.map((producto) => {
            const encryptedIdProducto = encryptedProductLinks.get(producto.IdProducto) || '';

            return (
              <div key={producto.IdProducto} className="bg-card rounded-lg overflow-hidden shadow-sm">
                <div className="relative group">
                  <img
                    src={producto.FotoProductoURL || "/placeholder.svg"}
                    alt={`Imagen de ${producto.NombreProducto}`}
                    width={600}
                    height={400}
                    className="w-full h-[200px] object-cover"
                    style={{ aspectRatio: "600/400", objectFit: "cover" }}
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <ProductoEditar encryptedIdProducto={''} onProductoActualizado={function (): void {
                      throw new Error('Function not implemented.');
                    } } />
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(producto.IdProducto)}>
                      <TrashIcon className="w-5 h-5" />
                      <span className="sr-only">Eliminar</span>
                    </Button>
                  </div>
                </div>
                <div className="p-4 grid gap-2">
                  <h3 className="font-semibold text-lg">{truncarTexto(producto.NombreProducto, 25)}</h3>
                  <p className="text-sm text-muted-foreground">{truncarTexto(producto.DescripcionProducto, 100)}</p>
                  <div className="flex items-center justify-between">
                    {/* Formatear el precio */}
                    <span className="font-semibold text-lg">${formatPrice(producto.PrecioProducto)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center">
          No hay productos disponibles
        </div>
      )}
    </div>
  );
}

function FilePenIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z" />
    </svg>
  );
}

function TrashIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M8 6v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6" />
      <path d="M4 6V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2" />
    </svg>
  );
}
