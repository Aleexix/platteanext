import NextCrypto from 'next-crypto';
import { useEffect, useState } from "react";
import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeftIcon } from "lucide-react";

interface Tienda {
  IdTienda: string;
  NombreTienda: string;
  DescripcionTienda: string;
  DireccionTienda: string;
  CiudadTienda: string;
  TelefonoTienda: string;
  MiniaturaTiendaURL: string;
  BannerTiendaURL: string;
  IdCategoriaFK: string;
  EstadoTienda: boolean;
}

const Alert = ({ message, onClose }: { message: string, onClose: () => void }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, 300); // Duración de la animación antes de ocultar el alert
    }, 3000); // Tiempo que se muestra el alert

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible) return null;

  return (
    <div className={`fixed top-4 right-4 bg-platteaGreenv2 text-white p-4 rounded-md shadow-lg z-50 transition-all duration-300 ease-in-out ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
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
          &times;
        </button>
      </div>
    </div>
  );
};

export function EditarTienda() {
  const params = useParams();
  const router = useRouter();
  const encryptedIdTienda = params.IdTienda as string;
  const crypto = new NextCrypto('secret key');

  const [tienda, setTienda] = useState<Tienda | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null); // Estado para la alerta

  useEffect(() => {
    const fetchTienda = async () => {
      try {
        const safeIdTienda = encryptedIdTienda.replace(/_/g, '/').replace(/-/g, '+');
        const decryptedId = await crypto.decrypt(decodeURIComponent(safeIdTienda));

        const response = await fetch(`http://localhost:4000/api/tienda/${decryptedId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: Tienda = await response.json();
        setTienda(data);
      } catch (error: any) {
        setError(error.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTienda();
  }, [encryptedIdTienda]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setIsDirty(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setIsDirty(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const safeIdTienda = encryptedIdTienda.replace(/_/g, '/').replace(/-/g, '+');
    const decryptedId = await crypto.decrypt(decodeURIComponent(safeIdTienda));

    try {
      const response = await fetch(`http://localhost:4000/api/tienda/${decryptedId}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la tienda');
      }

      setAlertMessage('Tienda actualizada correctamente');
      setIsDirty(false);
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred');
    }
  };

  const handleToggleState = async () => {
    const safeIdTienda = encryptedIdTienda.replace(/_/g, '/').replace(/-/g, '+');
    const decryptedId = await crypto.decrypt(decodeURIComponent(safeIdTienda));

    try {
      const response = await fetch(`http://localhost:4000/api/tienda/${decryptedId}`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error('Error al cambiar el estado de la tienda');
      }

      const updatedTienda = await response.json();
      setTienda(updatedTienda);

      const message = updatedTienda.EstadoTienda ? 'Tienda activada correctamente' : 'Tienda desactivada correctamente';
      setAlertMessage(message);
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex justify-center">
      {alertMessage && (
        <Alert message={alertMessage} onClose={() => setAlertMessage(null)} />
      )}
      <div className="absolute left-4 pt-8">
        <Button
          onClick={() => router.back()}
          className="inline-flex h-10 ml-8 items-center justify-center rounded-md border border-input bg-accent text-accent-foreground px-4 text-sm font-medium shadow-sm"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Volver atrás
        </Button>
      </div>
      <Card className="w-full max-w-xl mt-8 mb-8">
        <CardHeader>
          <CardTitle>Editar Tienda</CardTitle>
          <CardDescription>Actualiza la información de tu tienda.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-6" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="nombreTienda">Nombre de la Tienda</Label>
              <Input
                id="nombreTienda"
                name="NombreTienda"
                defaultValue={tienda?.NombreTienda}
                placeholder="Ingresa el nombre de la tienda"
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="descripcionTienda">Descripción</Label>
              <Textarea
                id="descripcionTienda"
                name="DescripcionTienda"
                defaultValue={tienda?.DescripcionTienda}
                placeholder="Ingresa la descripción de la tienda"
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="direccionTienda">Dirección</Label>
              <Input
                id="direccionTienda"
                name="DireccionTienda"
                defaultValue={tienda?.DireccionTienda}
                placeholder="Ingresa la dirección de la tienda"
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ciudadTienda">Ciudad</Label>
              <Input
                id="ciudadTienda"
                name="CiudadTienda"
                defaultValue={tienda?.CiudadTienda}
                placeholder="Ingresa la ciudad"
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="telefonoTienda">Teléfono</Label>
              <Input
                id="telefonoTienda"
                name="TelefonoTienda"
                defaultValue={tienda?.TelefonoTienda}
                placeholder="Ingresa el teléfono de la tienda"
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="idCategoriaFK">Categoría</Label>
              <Input
                id="idCategoriaFK"
                name="IdCategoriaFK"
                defaultValue={tienda?.IdCategoriaFK}
                placeholder="Ingresa la categoría de la tienda"
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bannerTienda">Banner de la Tienda</Label>
              <div className="flex items-center gap-2">
                <img
                  src={tienda?.BannerTiendaURL || "/placeholder.svg"}
                  alt="Banner de la tienda"
                  width={200}
                  height={100}
                  className="rounded-md"
                  style={{ aspectRatio: "200/100", objectFit: "cover" }}
                />
                <Input id="bannerTienda" name="BannerTienda" type="file" onChange={handleFileChange} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="miniaturaTienda">Miniatura de la Tienda</Label>
              <div className="flex items-center gap-2">
                <img
                  src={tienda?.MiniaturaTiendaURL || "/placeholder.svg"}
                  alt="Miniatura de la tienda"
                  width={100}
                  height={100}
                  className="rounded-md"
                  style={{ aspectRatio: "100/100", objectFit: "cover" }}
                />
                <Input id="miniaturaTienda" name="MiniaturaTienda" type="file" onChange={handleFileChange} />
              </div>
            </div>
            <div className='flex'>
              <div>
                <Button
                  className="bg-blue-500 text-white"
                  disabled={!isDirty}
                >
                  Guardar Cambios
                </Button>
              </div>
              <Button type="button" onClick={handleToggleState} className={`bg-${tienda?.EstadoTienda ? 'red-500' : 'plattea1'} text-white ml-52`}>
                {tienda?.EstadoTienda ? 'Desactivar Tienda' : 'Activar Tienda'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}