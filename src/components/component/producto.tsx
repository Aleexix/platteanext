"use client";
import NextCrypto from 'next-crypto';
import { useState, useEffect, JSX, SVGProps, SetStateAction } from "react";
import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { jwtDecode } from 'jwt-decode';
import { ArrowLeftIcon } from "lucide-react";

interface DecodedToken {
  IdPersona: string;
}

interface Producto {
  IdProducto: string;
  NombreProducto: string;
  DescripcionProducto: string;
  PrecioProducto: string;
  FotoProductoURL: string;
  NombreTienda: string;
  PromedioCalificacion: number;
}

interface ProductoProps {
  onAddToCart: () => void; // Asegúrate de que esta prop esté definida
}


const Alert = ({ message, onClose }: { message: string, onClose: () => void }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        setIsVisible(false);
        onClose(); // Llamar a la función onClose después de que la alerta se oculte
      }, 300); // Esperar que termine la animación antes de remover el alert
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-4 right-4 bg-platteaGreenv2 text-white p-4 rounded-md shadow-lg z-50 transition-all duration-300 ease-in-out ${
        isVisible ? 'animate-fade-in' : 'animate-fade-out'
      }`}
    >
      <div className="flex justify-between items-center">
        <span>{message}</span>
        <button
          onClick={() => {
            setIsExiting(true);
            setTimeout(() => {
              setIsVisible(false);
              onClose();
            }, 300);
          }}
          className="text-white ml-2"
        >
          &times; {/* Este es el carácter para la X */}
        </button>
      </div>
    </div>
  );
};

export function Producto({ onAddToCart }: ProductoProps)  {
  const params = useParams();
  const router = useRouter(); // Hook para el enrutador de Next.js
  const encryptedIdProducto = params.IdProducto as string; // Asegúrate de que sea una cadena
  const [producto, setProducto] = useState<Producto | null>(null);
  const [rating, setRating] = useState(3);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string>("");
  const [alert, setAlert] = useState<string | null>(null); // Para mostrar alertas
  const crypto = new NextCrypto('secret key');

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        console.log("ID encriptado:", encryptedIdProducto);

        const safeIdProducto = encryptedIdProducto.replace(/_/g, '/').replace(/-/g, '+');
        const decodedId = decodeURIComponent(safeIdProducto);
        const decrypted = await crypto.decrypt(decodedId);
        console.log("ID desencriptado:", decrypted);

        const response = await fetch(`http://localhost:4000/api/producto/${decrypted}`);
        console.log("Response status:", response.status);
        if (response.ok) {
          const data = await response.json();
          const producto = data[0];
          setProducto(producto);
          setIsLoaded(true);
        } else {
          throw new Error("Error fetching product");
        }
      } catch (error) {
        console.error("Error en fetchProducto:", error);
        setError("Error al obtener el producto");
        setAlert("Error al obtener el producto");
      }
    };

    if (encryptedIdProducto) {
      fetchProducto();
    }
  }, [encryptedIdProducto]);

  const handleRatingChange = (value: SetStateAction<number>) => {
    setRating(value);
  };
  const formatPrice = (precio: string) => {
    // Convertir el precio a número y formatearlo con puntos de miles
    const numero = Number(precio);
    return new Intl.NumberFormat('es-ES').format(numero);
  };
  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const decoded: DecodedToken = jwtDecode(token);
      const userId = decoded.IdPersona;
      const response = await fetch("http://localhost:4000/api/carrito", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          IdPersonaFK: userId,
          IdProductoFK: producto?.IdProducto
        }),
      });
    
      if (response.ok) {
        setAlert("Producto añadido al carrito exitosamente");
        onAddToCart();
      } else {
        throw new Error("Error al añadir el producto al carrito");
      }
    } catch (error) {
      console.error("Error en handleAddToCart:", error);
      setAlert("Este producto ya está en tu carrito. Si deseas, puedes actualizar la cantidad desde tu carrito.");
    }
  };

  if (error) return <Alert message={error} onClose={() => setAlert(null)} />;
  if (!isLoaded || !producto) return <p>Cargando...</p>;

  return (
    <div className="flex flex-col h-full">
      <div className="left-4 pt-3">
        <Button
          onClick={() => router.back()}
          className="inline-flex h-10 ml-8 items-center justify-center rounded-md border border-input bg-accent text-accent-foreground px-4 text-sm font-medium shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-10 hover:bg-gray-200"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Volver atrás
        </Button>
      </div>

      {/* Mostrar alerta si existe */}
      {alert && <Alert message={alert} onClose={() => setAlert(null)} />}

      <div className="flex items-center justify-center px-4 md:px-6 py-8">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <img
              src={producto.FotoProductoURL}
              alt="Product Image"
              width={600}
              height={600}
              className="w-full rounded-lg"
              style={{ aspectRatio: "600/600", objectFit: "cover" }}
            />
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl font-bold">{producto.NombreProducto}</h2>
            <p className="text-muted-foreground">{producto.NombreTienda}</p>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className={`w-5 h-5 cursor-pointer ${star <= producto.PromedioCalificacion ? 'text-black' : 'text-gray-300'} fill-current`}
                  onClick={() => handleRatingChange(star)}
                >
                  <StarIcon className={`w-6 h-6 ${star <= producto.PromedioCalificacion ? 'fill-black' : 'fill-gray-300'}`} />
                </button>
              ))}
            </div>
            <p className="text-muted-foreground">{producto.DescripcionProducto}</p>
            <div className="flex flex-col md:flex-row items-center justify-between">
              <h3 className="text-3xl font-bold">${formatPrice(producto.PrecioProducto)}</h3>
              <div className="flex gap-2 mt-4 md:mt-0">
                <Button onClick={handleAddToCart}>Añadir al carrito</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StarIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
