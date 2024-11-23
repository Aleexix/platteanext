"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import NextCrypto from 'next-crypto';
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

export function Tiendas() {
  const [tiendas, setTiendas] = useState<Tienda[]>([]);
  const [filteredTiendas, setFilteredTiendas] = useState<Tienda[]>([]);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; 
  const [encryptedIds, setEncryptedIds] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState<string>("");
  const crypto = new NextCrypto('secret key');

  useEffect(() => {
    const fetchTiendas = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/tienda`);
        if (response.ok) {
          const data: Tienda[] = await response.json();
          setTiendas(data);
          setFilteredTiendas(data);

          const encrypted = await Promise.all(data.map(async (tienda) => {
            const encryptedId = await crypto.encrypt(tienda.IdTienda);
            const safeEncryptedId = encryptedId.replace(/\//g, '_').replace(/\+/g, '-');
            return {
              id: tienda.IdTienda,
              encryptedId: safeEncryptedId
            };
          }));

          setEncryptedIds(encrypted.reduce<{ [key: string]: string }>((acc, { id, encryptedId }) => {
            acc[id] = encryptedId;
            return acc;
          }, {}));
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

  useEffect(() => {
    const normalizeString = (str: string) => {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    };

    const filtered = tiendas.filter((tienda) => {
      const normalizedNombre = normalizeString(tienda.NombreTienda);
      const normalizedSearch = normalizeString(search);
      const normalizedLocation = normalizeString(location);
      const normalizedCiudad = normalizeString(tienda.CiudadTienda);

      return normalizedNombre.includes(normalizedSearch) &&
             normalizedCiudad.includes(normalizedLocation);
    });
    setFilteredTiendas(filtered);
  }, [search, location, tiendas]);

  const totalPages = Math.ceil(filteredTiendas.length / itemsPerPage);
  const currentTiendas = filteredTiendas.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-7 ">
      <h2 className="text-3xl font-bold mb-5 ml-5">Descubre Nuestras Tiendas</h2>
      <div className="ml-5 ">
      <Busqueda 
        search={search} 
        setSearch={setSearch} 
        location={location} 
        setLocation={setLocation} 
      />
      </div>
      <section className="grid grid-cols-1 gap-6 p-4 md:grid-cols-2 lg:grid-cols-4 md:p-6">
        {currentTiendas.map((tienda) => (
          <Link key={tienda.IdTienda} href={`/shop/${encryptedIds[tienda.IdTienda] || ''}`}>
            <div className="relative overflow-hidden rounded-lg shadow-lg group transition-transform transform hover:scale-105">
              <img
                src={tienda.MiniaturaTiendaURL}
                alt={tienda.NombreTienda}
                className="object-cover w-full h-60 transition-transform duration-300 ease-in-out"
                style={{ aspectRatio: "400/300", objectFit: "cover" }}
              />
              <div className="p-4 bg-white">
                <h3 className="text-lg font-semibold md:text-xl text-gray-800">{tienda.NombreTienda}</h3>
                <p className="text-sm text-gray-600">Ciudad: {tienda.CiudadTienda}</p>
                <p className="text-sm text-gray-600">Dirección: {tienda.DireccionTienda}</p>
              </div>
            </div>
          </Link>
        ))}
      </section>
      <div className="flex justify-center items-center mt-6">
        <Button 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
          disabled={currentPage === 1}
          className={`mr-2 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-plattea1 transition'}`}
        >
          Anterior
        </Button>
        <div className="flex items-center">
          {Array.from({ length: totalPages }, (_, index) => (
            <Button 
              key={index} 
              onClick={() => setCurrentPage(index + 1)} 
              className={`mx-1 px-3 py-1 rounded-md ${currentPage === index + 1 ? 'bg-gray-500 text-white' : 'bg-gray-200 hover:bg-gray-300'} transition`}
            >
              {index + 1}
            </Button>
          ))}
        </div>
        <Button 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
          disabled={currentPage === totalPages}
          className={`ml-2 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-plattea1 transition'}`}
        >
          Siguiente
        </Button>
      </div>
      <div className="text-center mt-4">
        <span className="text-gray-600">Página {currentPage} de {totalPages}</span>
      </div>
    </div>
  );
}

function Busqueda({ search, setSearch, location, setLocation }: { search: string; setSearch: (value: string) => void; location: string; setLocation: (value: string) => void; }) {
  return (
    <div className="flex flex-col md:flex-row w-full mb-6">
      <div className="flex flex-col w-full md:w-1/4 md:mr-4">
        <label className="mb-1 text-sm font-semibold text-gray-700">Buscar Tiendas</label>
        <Input
          type="search"
          placeholder="Buscar tiendas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 px-4 py-2 text-sm rounded-md border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
        />
      </div>
      <div className="flex flex-col w-full md:w-1/5 md:ml-0 mt-4 md:mt-0">
        <label className="mb-1 text-sm font-semibold text-gray-700">Ubicación</label>
        <Input
          type="text"
          placeholder="Ubicación..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="h-10 px-4 py-2 text-sm rounded-md border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
        />
      </div>
    </div>
  );
}
