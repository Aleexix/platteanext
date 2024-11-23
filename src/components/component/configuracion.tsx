"use client";

import { useRef, useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  IdPersona: string;
}

interface Profile {
  FotoPersonaURL: string;
  NombrePersona: string;
  ApellidoPersona: string;
  CorreoPersona: string;
  DescripcionPersona: string;
  TelefonoPersona?: string;
  bannerPersonaURL?: string;
}

export function Configuracion() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [telefono, setTelefono] = useState("");

  const [hasChanges, setHasChanges] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const decoded: DecodedToken = jwtDecode(token);
        const userId = decoded.IdPersona;

        const response = await fetch(
          `http://localhost:4000/api/persona/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data: Profile = await response.json();
          setProfile(data);
          setNombre(data.NombrePersona);
          setApellido(data.ApellidoPersona);
          setCorreo(data.CorreoPersona);
          setDescripcion(data.DescripcionPersona);
          setTelefono(data.TelefonoPersona || ""); // Asignar el número de celular
        } else {
          throw new Error("Error fetching profile");
        }
      } catch (error) {
        console.error(error);
        setError("Error al cargar el perfil");
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      setHasChanges(
        nombre !== profile.NombrePersona ||
          apellido !== profile.ApellidoPersona ||
          correo !== profile.CorreoPersona ||
          descripcion !== profile.DescripcionPersona ||
          telefono !== profile.TelefonoPersona ||
          file !== null ||
          bannerFile !== null
      );
    }
  }, [
    nombre,
    apellido,
    correo,
    descripcion,
    telefono,
    file,
    bannerFile,
    profile,
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const handleChangePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleChangeBannerClick = () => {
    bannerInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleBannerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setBannerFile(selectedFile);
      const reader = new FileReader();
      reader.onload = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const decoded: DecodedToken = jwtDecode(token);
      const userId = decoded.IdPersona;

      const formData = new FormData();
      formData.append("NombrePersona", nombre);
      formData.append("ApellidoPersona", apellido);
      formData.append("CorreoPersona", correo);
      formData.append("DescripcionPersona", descripcion);
      formData.append("TelefonoPersona", telefono);
      if (file) {
        formData.append("FotoPersona", file);
      }
      if (bannerFile) {
        formData.append("bannerPersona", bannerFile);
      }

      const response = await fetch(
        `http://localhost:4000/api/persona/${userId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        window.location.reload(); // Consider using a more elegant solution for updating UI
      } else {
        throw new Error("Error al actualizar el perfil");
      }
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al actualizar el perfil");
    }
  };

  if (error) return <p>Error: {error}</p>;

  return (
    <Card className="mx-auto w-full max-w-3xl mt-9 mb-9">
      <CardHeader>
        <CardTitle>Configuración de Perfil</CardTitle>
        <CardDescription>Actualiza tu información de perfil.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ingresa tu nombre"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Apellidos</Label>
            <Input
              id="lastName"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              placeholder="Ingresa tus apellidos"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Escribe una descripción"
            className="min-h-[100px]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Correo Electrónico</Label>
          <Input
            id="email"
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            placeholder="Ingresa tu correo electrónico"
          />
        </div>
        <div className="space-y-2">
  <Label htmlFor="phone">Número de Celular</Label>
  <Input
    id="phone"
    type="tel"
    value={telefono}
    onChange={(e) => {
      // Permitir solo números eliminando caracteres no numéricos
      const inputValue = e.target.value.replace(/\D/g, "");
      setTelefono(inputValue);
    }}
    placeholder="Ingresa tu número de celular"
  />
</div>

        <div className="space-y-2">
          <Label>Editar Foto de Perfil</Label>
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={
                  photoPreview ||
                  profile?.FotoPersonaURL ||
                  "/placeholder-user.jpg"
                }
                alt="Foto de perfil"
              />
              <AvatarFallback>Usuario</AvatarFallback>
            </Avatar>
            <div>
              <Button onClick={handleChangePhotoClick}>Cambiar Foto</Button>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
      
          </div>
        </div>
        <div className="space-y-2">
          <Label>Editar Banner</Label>
          <div className="relative h-40">
            <div className="absolute inset-0">
              <img
                src={
                  bannerPreview ||
                  profile?.bannerPersonaURL ||
                  "/placeholder-banner.jpg"
                }
                alt="Banner"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex items-center justify-center h-full">
              <input
                type="file"
                ref={bannerInputRef}
                accept="image/*"
                onChange={handleBannerChange}
                className="hidden"
              />
            </div>
            <Button
              className="absolute top-1 right-2 "
              onClick={handleChangeBannerClick}
            >
              Cambiar Banner
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSaveChanges} disabled={!hasChanges}>
          Guardar Cambios
        </Button>
      </CardFooter>
    </Card>
  );
}
