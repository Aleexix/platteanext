"use client";
import NextCrypto from 'next-crypto';
import { useState, useEffect } from "react";
import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";

interface Producto {
  IdProducto: string;
  NombreProducto: string;
  DescripcionProducto: string;
  PrecioProducto: number;
  FotoProductoURL: string;
  StockProducto: number;
  IdCategoriaFK: number;
  IdTiendaFK: number;
}

export function EditarProducto() {
  const params = useParams();
  const router = useRouter();
  const encryptedIdProducto = params.IdProducto as string;
  const [producto, setProducto] = useState<Producto | null>(null);
  const [error, setError] = useState<string>("");
  const crypto = new NextCrypto('secret key');

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        console.log("ID encriptado:", encryptedIdProducto);

        // Decodificar el ID encriptado
        const decodedId = decodeURIComponent(encryptedIdProducto);
        console.log("ID decodificado:", decodedId);

        // Desencriptar el ID
        const decryptedId = await crypto.decrypt(decodedId);
        console.log("ID desencriptado:", decryptedId);

        // Fetch el producto con el ID desencriptado
        const response = await fetch(`http://localhost:4000/api/producto/${decryptedId}`);
        if (response.ok) {
          const data = await response.json();
          setProducto(data[0]);
        } else {
          throw new Error("Error fetching product");
        }
      } catch (error) {
        console.error("Error en fetchProducto:", error);
        setError("Error al obtener el producto");
      }
    };

    if (encryptedIdProducto) {
      fetchProducto();
    }
  }, [encryptedIdProducto]);

  if (error) return <p>Error: {error}</p>;
  if (!producto) return <p>Cargando producto...</p>;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      // Encriptar el ID del producto antes de enviarlo
      const encryptedId = await crypto.encrypt(producto.IdProducto);

      // Codificar el ID encriptado para la URL
      const encodedId = encodeURIComponent(encryptedId);

      // Construir el payload del formulario
      const formData = new FormData(event.currentTarget);
      const data = Object.fromEntries(formData);

      const response = await fetch(`http://localhost:4000/api/producto/${producto.IdProducto}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Producto actualizado exitosamente");
        router.push(`/producto/${encodedId}`); // Redirigir después de actualizar
      } else {
        throw new Error("Error al actualizar el producto");
      }
    } catch (error) {
      console.error("Error en handleSubmit:", error);
      alert("Hubo un problema al actualizar el producto");
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl space-y-8">
        <div>
          <h2 className="text-center text-3xl font-bold tracking-tight text-foreground">Editar producto</h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">Edite en este formulario el producto</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-foreground">Nombre del producto</label>
              <div className="mt-2">
                <input
                  id="name"
                  name="NombreProducto"
                  type="text"
                  autoComplete="name"
                  required
                  defaultValue={producto.NombreProducto}
                  className="block w-full rounded-md border-0 py-1.5 text-foreground shadow-sm ring-1 ring-inset ring-muted-foreground/10 placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="sm:col-span-4">
              <label htmlFor="description" className="block text-sm font-medium leading-6 text-foreground">Descripción del producto</label>
              <div className="mt-2">
                <textarea
                  id="description"
                  name="DescripcionProducto"
                  rows={3}
                  defaultValue={producto.DescripcionProducto}
                  className="block w-full rounded-md border-0 py-1.5 text-foreground shadow-sm ring-1 ring-inset ring-muted-foreground/10 placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                  placeholder="Ingresa la descripción del producto..."
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="price" className="block text-sm font-medium leading-6 text-foreground">Precio</label>
              <div className="mt-2">
                <input
                  id="price"
                  name="PrecioProducto"
                  type="number"
                  min={0}
                  step={0.01}
                  defaultValue={producto.PrecioProducto}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-foreground shadow-sm ring-1 ring-inset ring-muted-foreground/10 placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="sm:col-span-4">
              <label htmlFor="category" className="block text-sm font-medium leading-6 text-foreground">Categoría</label>
              <div className="mt-2">
                <select
                  id="category"
                  name="IdCategoriaFK"
                  required
                  defaultValue={producto.IdCategoriaFK}
                  className="block w-full rounded-md border-0 py-1.5 text-foreground shadow-sm ring-1 ring-inset ring-muted-foreground/10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                >
                  <option value="">Selecciona una categoría</option>
                  <option value="1">Moda</option>
                  <option value="2">Electrodomésticos</option>
                  <option value="3">Hogar</option>
                  <option value="4">Deportes</option>
                  <option value="5">Juguetes</option>
                  <option value="6">Belleza</option>
                  <option value="7">Electrónica</option>
                  <option value="8">Libros</option>
                  <option value="9">Comida</option>
                  <option value="10">Salud</option>
                  <option value="11">Oficina</option>
                  <option value="12">Jardín</option>
                </select>
              </div>
            </div>
            <div className="sm:col-span-4">
              <label htmlFor="images" className="block text-sm font-medium leading-6 text-foreground">Imágenes del producto</label>
              <div className="mt-2 flex justify-center rounded-md border-2 border-dashed border-muted-foreground/20 px-6 pt-5 pb-6">
                <div className="space-y-1 text-center">
                  <img src={producto.FotoProductoURL} alt="Producto" className="mx-auto h-12 w-12 text-muted-foreground" />
                  <div className="flex text-sm text-muted-foreground">
                    <label
                      htmlFor="images"
                      className="relative cursor-pointer rounded-md bg-white font-medium text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-primary-foreground"
                    >
                      <span>Subir un archivo</span>
                      <input id="images" name="images" type="file" multiple className="sr-only" />
                    </label>
                    <p className="pl-1">o arrastra y suelta</p>
                  </div>
                  <p className="text-xs text-muted-foreground">PNG, JPG, GIF hasta 10MB</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" className="w-full sm:w-auto">Guardar producto</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
