import { useEffect, useState } from 'react';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Link from "next/link";
import NextCrypto from 'next-crypto';

interface Categoria {
  IdCategoria: number;
  NombreCategoria: string;
  FotoCategoria: string | null;
}

export function CarruselTiendas() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [encryptedCategorias, setEncryptedCategorias] = useState<string[]>([]);
  const crypto = new NextCrypto('secret key'); // Instancia de NextCrypto

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/categoria/');
        const data: Categoria[] = await response.json();
        setCategorias(data);
        await encryptCategorias(data); // Encriptar IDs después de obtener las categorías
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      }
    };

    fetchCategorias();
  }, []);

  const encryptCategorias = async (categorias: Categoria[]) => {
    const encryptedIds = await Promise.all(categorias.map(async (categoria) => {
      const encryptedId = await crypto.encrypt(categoria.IdCategoria.toString());
      return encryptedId.replace(/\//g, '_').replace(/\+/g, '-'); // Reemplazar caracteres problemáticos
    }));
    setEncryptedCategorias(encryptedIds);
  };

  return (
    <section className="py-12 px-4 md:px-6">
      <div className="container mx-auto px-4 md:px-6 lg:px-7">
        <h2 className="text-2xl font-bold mb-6">Explora nuestras categorías</h2>
        <Carousel
          className="w-full"
          autoplay={true}
          infinite={true}
          autoplayInterval={3000}
        >
          <CarouselContent>
            {categorias.map((categoria, index) => (
              <CarouselItem key={categoria.IdCategoria} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-4">
                  <Link 
                    href={`/categoria/${encryptedCategorias[index]}`} 
                    className="block rounded-lg overflow-hidden group" 
                    prefetch={false}
                  >
                    <img
                      src={categoria.FotoCategoria || "/about.jpg"} // Usa la foto de la categoría o una por defecto
                      alt={categoria.NombreCategoria}
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover group-hover:opacity-50 transition-opacity"
                      style={{ aspectRatio: "300/200", objectFit: "cover" }}
                    />
                    <div className="bg-background p-4">
                      <h3 className="text-lg font-semibold">{categoria.NombreCategoria}</h3>
                      <p className="text-muted-foreground group-hover:underline transition-colors">Ver más</p>
                    </div>
                  </Link>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
