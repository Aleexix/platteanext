"use client";
import NextCrypto from 'next-crypto';
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface Producto {
  IdProducto: string;
  NombreProducto: string;
  DescripcionProducto: string;
  PrecioProducto: number;
  FotoProductoURL: string;
  StockProducto: number;
  IdCategoriaFK: number;
}

interface ProductoEditarProps {
  encryptedIdProducto: string;
  onProductoActualizado: () => void; // Callback para notificar que se ha actualizado un producto
}

export function ProductoEditar({ encryptedIdProducto, onProductoActualizado }: ProductoEditarProps) {
  const router = useRouter();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [error, setError] = useState<string>("");
  const [isModified, setIsModified] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false); // Controla el estado del diálogo
  const crypto = new NextCrypto('secret key');
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const decryptedId = await crypto.decrypt(decodeURIComponent(encryptedIdProducto));
        const response = await fetch(`http://localhost:4000/api/producto/${decryptedId}`);
        if (response.ok) {
          const data = await response.json();
          setProducto(data[0]);
          setSelectedCategory(data[0].IdCategoriaFK.toString()); // Establecer categoría seleccionada
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

  const handleInputChange = () => {
    setIsModified(true);
  };

  if (error) return <p>Error: {error}</p>;
  if (!producto) return <p>Cargando producto...</p>;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const updatedProducto: Producto = {
      ...producto!,
      NombreProducto: formData.get("NombreProducto") as string,
      DescripcionProducto: formData.get("DescripcionProducto") as string,
      PrecioProducto: parseFloat(formData.get("PrecioProducto") as string),
      IdCategoriaFK: parseInt(selectedCategory), // Usar la categoría seleccionada
      StockProducto: producto.StockProducto,
    };

    const fotoProducto = formData.get("FotoProducto");
    if (fotoProducto && fotoProducto instanceof File) {
      formData.set("FotoProducto", fotoProducto);
    } else {
      formData.set("FotoProductoURL", producto.FotoProductoURL);
    }

    try {
      const response = await fetch(`http://localhost:4000/api/producto/${producto.IdProducto}`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        setProducto(updatedProducto);
        setIsModified(false);
        onProductoActualizado();
        setIsDialogOpen(false); // Cierra el diálogo al guardar cambios
      } else {
        throw new Error("Error al actualizar el producto");
      }
    } catch (error) {
      console.error("Error en handleSubmit:", error);
      alert("Hubo un problema al actualizar el producto");
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" onClick={() => setIsDialogOpen(true)}>
          <UndoIcon className="h-5 w-5" />
          <span className="sr-only">Editar producto</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <div className="flex flex-col gap-4 p-4">
          <div className="grid gap-1">
            <DialogTitle className="text-xl font-semibold">Editar producto</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Actualiza los detalles de este producto.
            </DialogDescription>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-3">
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  name="NombreProducto"
                  type="text"
                  required
                  defaultValue={producto.NombreProducto}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  name="DescripcionProducto"
                  className="min-h-20"
                  defaultValue={producto.DescripcionProducto}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Precio</Label>
                <Input
                  id="price"
                  name="PrecioProducto"
                  type="number"
                  min={0}
                  step={0.01}
                  defaultValue={producto.PrecioProducto}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image">Imagen</Label>
                <div className="flex items-center">
                  {producto.FotoProductoURL && (
                    <img
                      src={producto.FotoProductoURL}
                      alt="Imagen del producto"
                      className="mr-2 max-h-10"
                    />
                  )}
                  <Input id="image" name="FotoProducto" type="file" onChange={handleInputChange} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Categoría</Label>
                <Select
                  name="IdCategoriaFK"
                  value={selectedCategory}
                  onValueChange={(value) => {
                    setSelectedCategory(value);
                    handleInputChange();
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Moda</SelectItem>
                    <SelectItem value="2">Electrodomésticos</SelectItem>
                    <SelectItem value="3">Hogar</SelectItem>
                    <SelectItem value="4">Deportes</SelectItem>
                    <SelectItem value="5">Juguetes</SelectItem>
                    <SelectItem value="6">Belleza</SelectItem>
                    <SelectItem value="7">Electrónica</SelectItem>
                    <SelectItem value="8">Libros</SelectItem>
                    <SelectItem value="9">Comida</SelectItem>
                    <SelectItem value="10">Salud</SelectItem>
                    <SelectItem value="11">Oficina</SelectItem>
                    <SelectItem value="12">Jardín</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={!isModified}>Guardar cambios</Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function UndoIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="14 2 18 6 7 17 3 17 3 13 14 2"></polygon>
    </svg>
  );
}
