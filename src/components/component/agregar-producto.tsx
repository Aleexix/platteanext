import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, ChangeEvent, FormEvent, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import NextCrypto from "next-crypto";

const Alert = ({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) => {
  const [isExiting, setIsExiting] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, 300);
    }, 10000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-4 right-4 bg-platteaGreenv2 text-white p-4 rounded-md shadow-lg z-60 transition-all duration-300 ease-in-out ${
        isExiting ? "animate-fade-out" : "animate-fade-in"
      }`}
    >
      <div className="flex justify-between items-center">
        {message}
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
          &times; {/* Carácter para la X */}
        </button>
      </div>
    </div>
  );
};

export function AgregarProducto() {
  const params = useParams();
  const encryptedIdTienda = params.IdTienda as string;
  const crypto = new NextCrypto("secret key");
  const [idTienda, setIdTienda] = useState<string | null>(null);
  const [alert, setAlert] = useState<string | null>(null);

  const [nombre, setNombre] = useState<string>("");
  const [descripcion, setDescripcion] = useState<string>("");
  const [precio, setPrecio] = useState<string>("");
  const [stock, setStock] = useState<string>("");
  const [imagen, setImagen] = useState<File | null>(null);

  const nombreRef = useRef<HTMLInputElement>(null);
  const descripcionRef = useRef<HTMLTextAreaElement>(null);
  const precioRef = useRef<HTMLInputElement>(null);
  const stockRef = useRef<HTMLInputElement>(null);
  const imagenRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchDecryptedId = async () => {
      try {
        const safeIdTienda = encryptedIdTienda
          .replace(/_/g, "/")
          .replace(/-/g, "+");
        const decryptedId = await crypto.decrypt(
          decodeURIComponent(safeIdTienda)
        );
        setIdTienda(decryptedId);
      } catch (error) {
        console.error("Error al desencriptar el ID de la tienda", error);
      }
    };

    if (encryptedIdTienda) {
      fetchDecryptedId();
    }
  }, [encryptedIdTienda]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!imagen || !idTienda) {
      setAlert("Por favor, completa todos los campos y selecciona una imagen.");
      return;
    }

    const cleanPrecio = precio.replace(/\./g, "").replace(/,/g, "");

    const formData = new FormData();
    formData.append("NombreProducto", nombre);
    formData.append("DescripcionProducto", descripcion);
    formData.append("PrecioProducto", cleanPrecio);
    formData.append("StockProducto", stock);
    formData.append("FotoProducto", imagen);
    formData.append("IdTiendaFK", idTienda);

    try {
      const response = await fetch("http://localhost:4000/api/producto/", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setAlert("Producto creado correctamente");
        window.location.reload();
      } else {
        setAlert("Error al crear el producto: " + data.message);
      }
    } catch (error: any) {
      setAlert("Error al enviar el formulario: " + error.message);
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImagen(file);
  };

  const formatPrice = (value: string) => {
    return value
      .replace(/[^\d,]/g, "") // Remover todo lo que no sea dígito o coma
      .replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Añadir puntos cada tres dígitos
  };

  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formattedPrice = formatPrice(e.target.value);
    setPrecio(formattedPrice);
  };

  const handleKeyDown = (e: React.KeyboardEvent, nextRef: React.RefObject<any>) => {
    if (e.key === "Enter" && nextRef.current) {
      nextRef.current.focus();
    }
  };

  return (
    <div>
      <Dialog>
        {alert && <Alert message={alert} onClose={() => setAlert(null)} />}
        <DialogTrigger asChild>
          <Button>Agregar Producto</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Producto</DialogTitle>
          </DialogHeader>
          <form
            className="grid gap-4"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
          >
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                placeholder="Ingresa el nombre del producto"
                value={nombre}
                ref={nombreRef}
                onKeyDown={(e) => handleKeyDown(e, descripcionRef)}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                placeholder="Ingresa la descripción del producto"
                value={descripcion}
                ref={descripcionRef}
                onKeyDown={(e) => handleKeyDown(e, precioRef)}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Precio</Label>
              <Input
                id="price"
                type="text"
                placeholder="Ingresa el precio del producto"
                value={precio}
                ref={precioRef}
                onKeyDown={(e) => handleKeyDown(e, stockRef)}
                onChange={handlePriceChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                placeholder="Ingresa el stock del producto"
                value={stock}
                ref={stockRef}
                onKeyDown={(e) => handleKeyDown(e, imagenRef)}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image">Imagen</Label>
              <Input
                id="image"
                type="file"
                ref={imagenRef}
                onChange={handleImageChange}
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  /* handle cancel */
                }}
              >
                Cancelar
              </Button>
              <Button type="submit">Guardar Producto</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
