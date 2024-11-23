"use client";

import { useEffect, useState, JSX, SVGProps } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import NextCrypto from 'next-crypto'; // Asegúrate de que NextCrypto esté instalado

interface Producto {
  IdProducto: string;
  NombreProducto: string;
  DescripcionProducto: string;
  PrecioProducto: string;
  FotoProductoURL: string;
  NombreTienda: string;
  PromedioCalificacion: number;
}

export function Productos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Producto[]>([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string>("");
  const [minPrice, setMinPrice] = useState<number | ''>(''); 
  const [maxPrice, setMaxPrice] = useState<number | ''>(''); 
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedPriceRange, setSelectedPriceRange] = useState<number[]>([]);
  const [encryptedProductLinks, setEncryptedProductLinks] = useState<{ [key: string]: string }>({}); // Estado para los links encriptados

  const crypto = new NextCrypto('secret key'); // Reemplaza 'your-secret-key' con tu clave

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/producto`);
        if (response.ok) {
          let data: Producto[] = await response.json();
          data = mezclarArray(data);
          setProductos(data);
          setFilteredProducts(data);

          // Encriptar los IDs de productos
          const encryptedLinks = await Promise.all(data.map(async (producto) => {
            const encryptedId = await crypto.encrypt(producto.IdProducto); // Encriptar el ID
            // Reemplazar caracteres problemáticos
            return { id: producto.IdProducto, encryptedId: encryptedId.replace(/\//g, '_').replace(/\+/g, '-') };
          }));

          // Convertir la lista en un objeto con el IdProducto como clave
          const encryptedLinksObj = encryptedLinks.reduce<{ [key: string]: string }>((acc, { id, encryptedId }) => {
            acc[id] = encryptedId;
            return acc;
          }, {});

          setEncryptedProductLinks(encryptedLinksObj);

        } else {
          throw new Error("Error al obtener los productos");
        }
      } catch (error) {
        console.error(error);
        setError("Error al obtener los productos");
      }
    };

    fetchProductos();
  }, []);

  useEffect(() => {
    const filtered = productos.filter((producto) => {
      const precio = parseFloat(producto.PrecioProducto);
      const withinPriceRange =
        (minPrice === "" || precio >= minPrice) &&
        (maxPrice === "" || precio <= maxPrice);
      return producto.NombreProducto.toLowerCase().includes(search.toLowerCase()) && withinPriceRange;
    });

    const sorted = filtered.sort((a, b) => {
      const precioA = parseFloat(a.PrecioProducto);
      const precioB = parseFloat(b.PrecioProducto);
      return sortOrder === "asc" ? precioA - precioB : precioB - precioA;
    });

    setFilteredProducts(sorted);
  }, [search, productos, minPrice, maxPrice, sortOrder]);

  function mezclarArray(array: Producto[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const priceRanges = [
    { range: [0, 50000], label: "$0 - $50.000" },
    { range: [50000, 100000], label: "$50.000 - $100.000" },
    { range: [100000, 200000], label: "$100.000 - $200.000" },
    { range: [200000, 500000], label: "$200.000 - $500.000" },
  ];

  const handlePriceFilter = (min: number, max: number) => {
    if (selectedPriceRange[0] === min && selectedPriceRange[1] === max) {
      setMinPrice("");
      setMaxPrice("");
      setSelectedPriceRange([]);
    } else {
      setMinPrice(min);
      setMaxPrice(max);
      setSelectedPriceRange([min, max]);
    }
  };

  const handleSortOrder = (order: "asc" | "desc") => {
    setSortOrder(order);
  };

  const truncarTexto = (texto: string, maxLength: number) => {
    return texto.length > maxLength
      ? texto.substring(0, maxLength) + "..."
      : texto;
  };

  const isPriceRangeSelected = (range: number[]) => {
    return selectedPriceRange[0] === range[0] && selectedPriceRange[1] === range[1];
  };

  if (error) return <p>Error: {error}</p>;
  const formatPrice = (precio: string) => {
    // Convertir el precio a número y formatearlo con puntos de miles
    const numero = Number(precio);
    return new Intl.NumberFormat('es-ES').format(numero);
  };
  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="mb-8">
        <div className="mb-6">
          <Input
            type="text"
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary"
          />
          <div className="flex items-center overflow-x-auto pb-10 border-b border-gray-300 mt-4">
            {priceRanges.map(({ range, label }) => (
              <Button
                key={label}
                variant="outline"
                className={`mr-4 ${isPriceRangeSelected(range) ? "bg-plattea1 text-white" : ""}`}
                onClick={() => handlePriceFilter(range[0], range[1])}
              >
                {label}
              </Button>
            ))}
          </div>
          <div className="flex space-x-4 mt-4">
            <Button
              variant="outline"
              onClick={() => handleSortOrder("asc")}
              className={sortOrder === "asc" ? "bg-plattea1 text-white" : ""}
            >
              Ordenar por precio: Menor a Mayor
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSortOrder("desc")}
              className={sortOrder === "desc" ? "bg-plattea1 text-white" : ""}
            >
              Ordenar por precio: Mayor a Menor
            </Button>
          </div>
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-5">Productos</h1>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredProducts.map((producto) => (
          <Link
            key={producto.IdProducto}
            href={`/product/${encryptedProductLinks[producto.IdProducto] || ''}`} // Usar el ID encriptado en el enlace
            prefetch={false}
          >
            <div className="relative flex flex-col overflow-hidden transition-transform duration-300 ease-in-out rounded-lg shadow-lg group hover:shadow-xl hover:-translate-y-2">
              <div className="w-full h-64 overflow-hidden">
                <img
                  src={producto.FotoProductoURL}
                  alt={producto.NombreProducto}
                  width={500}
                  height={400}
                  className="object-cover w-full h-full"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="flex flex-col justify-between p-4 bg-background h-full">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 truncate">
                    {truncarTexto(producto.NombreProducto, 50)}
                  </h3>
                  <p className="text-sm text-muted-foreground h-16 overflow-hidden overflow-ellipsis">
                    {truncarTexto(producto.DescripcionProducto, 100)}
                  </p>
                </div>
                <h4 className="text-lg font-semibold md:text-xl mt-2">
                  ${formatPrice(producto.PrecioProducto)}
                </h4>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function ShoppingBagIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="M6 2h12a1 1 0 0 1 1 1v1h-1V3H6v1H5V3a1 1 0 0 1 1-1zM5 4v2h14V4H5zM3 6h18a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zm1 2v14h14V8H4z"
      />
    </svg>
  );
}
