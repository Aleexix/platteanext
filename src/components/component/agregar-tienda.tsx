"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NextCrypto from "next-crypto";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  IdPersona: string;
}

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
    }, 1000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-4 right-4 bg-platteaGreenv2 text-white p-4 rounded-md shadow-lg z-100 transition-all duration-300 ease-in-out ${
        isExiting ? "animate-fade-out" : "animate-fade-in"
      }`}
    >
      {message}
    </div>
  );
};

export function AgregarTienda() {
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [direccion, setDireccion] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [telefono, setTelefono] = useState("");

  const [miniatura, setMiniatura] = useState<File | null>(null);
  const [banner, setBanner] = useState<File | null>(null);

  const [previewMiniatura, setPreviewMiniatura] = useState<string | null>(null);
  const [previewBanner, setPreviewBanner] = useState<string | null>(null);

  const [alert, setAlert] = useState<string | null>(null);
  const [filtradas, setFiltradas] = useState<string[]>([]);
  const [categorias, setCategorias] = useState<
    { IdCategoria: number; NombreCategoria: string }[]
  >([]);

  const router = useRouter();
  const crypto = new NextCrypto("secret key");

  const ciudades = [
    "Bogotá",
    "Medellín",
    "Cali",
    "Barranquilla",
    "Cartagena",
    "Bucaramanga",
    "Cúcuta",
    "Pereira",
    "Santa Marta",
    "Manizales",
    "Barrancabermeja",

    // Agrega más ciudades aquí...
  ];

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/categoria");
        if (!response.ok) throw new Error("Error al cargar las categorías");
        const data = await response.json();
        setCategorias(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategorias();
  }, []);

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "miniatura" | "banner"
  ) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      if (type === "miniatura") {
        setMiniatura(file);
        setPreviewMiniatura(URL.createObjectURL(file));
      } else if (type === "banner") {
        setBanner(file);
        setPreviewBanner(URL.createObjectURL(file));
      }
    }
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setCiudad(valor);
    setFiltradas(
      ciudades.filter((ciudad) =>
        ciudad.toLowerCase().includes(valor.toLowerCase())
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setAlert("No se encontró el token de autenticación.");
      return;
    }

    const formData = new FormData();
    const decoded: DecodedToken = jwtDecode(token);
    const userId = decoded.IdPersona;

    formData.append("IdPersona", userId);
    formData.append("NombreTienda", nombre);
    formData.append("IdCategoriaFK", categoria);
    formData.append("DescripcionTienda", descripcion);
    formData.append("DireccionTienda", direccion);
    formData.append("CiudadTienda", ciudad);
    formData.append("TelefonoTienda", telefono);

    if (miniatura) formData.append("MiniaturaTienda", miniatura);
    if (banner) formData.append("BannerTienda", banner);

    try {
      const response = await fetch(
        "http://localhost:4000/api/tienda/persona/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        const tiendaId = responseData.idTienda;
        if (!tiendaId) {
          setAlert("No se recibió el id de la tienda");
          return;
        }

        const encryptedId = await crypto.encrypt(tiendaId);
        const safeId = encodeURIComponent(
          encryptedId.replace(/\//g, "_").replace(/\+/g, "-")
        );

        setAlert("Tienda creada correctamente");
        router.push(`/shop/${safeId}`);
      } else {
        const errorData = await response.json();
        setAlert(`Error al crear la tienda: ${errorData.message}`);
      }

      const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor = e.target.value;
        setCiudad(valor);
      };
    } catch (error) {
      setAlert(
        "Hubo un error al crear la tienda. Inténtalo de nuevo más tarde."
      );
    }
  };

  return (
    <Card className="max-w-4xl mx-auto p-6 sm:p-8 md:p-10 mb-20 mt-20 relative">
      {alert && <Alert message={alert} onClose={() => setAlert(null)} />}
      <CardHeader>
        <CardTitle className="text-3xl font-bold">Crea tu tienda</CardTitle>
        <CardDescription>Ingresa los detalles de tu tienda.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          onSubmit={handleSubmit}
        >
          <div className="grid gap-4">
            <div className=" grid gap-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Nombre de la Tienda
              </Label>
              <Input
                id="name"
                placeholder="Tienda de Ropa"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category" className="text-sm font-medium">
                Categoría
              </Label>
              <Select onValueChange={setCategoria}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((cat) => (
                    <SelectItem
                      key={cat.IdCategoria}
                      value={cat.IdCategoria.toString()}
                    >
                      {cat.NombreCategoria}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Teléfono
              </Label>
              <Input
                id="phone"
                placeholder="Teléfono"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="banner" className="text-sm font-medium">
                Banner
              </Label>
              <Input
                type="file"
                id="banner"
                accept="image/*"
                onChange={(e) => handleImageChange(e, "banner")}
              />
              {previewBanner && (
                <img
                  src={previewBanner}
                  alt="Preview Banner"
                  className="mt-2 w-32 h-16 object-cover rounded-md" // Cambia las dimensiones aquí
                />
              )}
            </div>
          </div>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="address" className="text-sm font-medium">
                  Dirección
                </Label>
                <Input
                  id="address"
                  placeholder="Añade la dirección.."
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="city" className="text-sm font-medium">
                  Ciudad
                </Label>
                <Input
                  id="city"
                  placeholder="Añade la ciudad.."
                  value={ciudad}
                  onChange={handleCityChange}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Descripción
              </Label>
              <Textarea
                id="description"
                rows={3}
                placeholder="Describe tu tienda..."
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="miniatura" className="text-sm font-medium">
                Miniatura
              </Label>
              <Input
                type="file"
                id="miniatura"
                accept="image/*"
                onChange={(e) => handleImageChange(e, "miniatura")}
              />
              {previewMiniatura && (
                <img
                  src={previewMiniatura}
                  alt="Preview Miniatura"
                  className="mt-2 w-32 h-32 object-cover rounded-md" // Cambia las dimensiones aquí
                />
              )}
            </div>
          </div>
        </form>
      </CardContent>
      <div className="absolute top-8 right-4 mt-7 ">
        <CardFooter>
          <Button type="submit" className="bg-plattea1">
            Crear Tienda
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}
