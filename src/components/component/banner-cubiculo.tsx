"use client";

import { JSX, SVGProps, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  IdPersona: string;
}

export function BannerCubiculo() {
  const [selectedImage, setSelectedImage] = useState<Blob | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleConfirmImage = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const decoded: DecodedToken = jwtDecode(token);
      const userId = decoded.IdPersona;

      const formData = new FormData();
      if (selectedImage) {
        formData.append("bannerPersona", selectedImage);
      }

      const response = await fetch(
        `http://localhost:4000/api/persona/${userId}`, // Cambia la URL a la ruta de tu API para actualizar el banner
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        // Maneja la respuesta según tu lógica
        console.log("Imagen actualizada con éxito");
      } else {
        throw new Error("Error al actualizar la imagen");
      }
    } catch (error) {
      console.error(error);
      setError("Ocurrió un error al actualizar la imagen");
    }
  };

  return (
    <div className="w-full bg-[#f5f5f5] py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          <div className="relative aspect-[3/1] overflow-hidden rounded-xl">
            {previewImage ? (
              <img
                src={previewImage}
                alt="Banner"
                width={1200}
                height={400}
                className="h-full w-full object-cover"
                style={{ aspectRatio: "1200/400", objectFit: "cover" }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                <ImageIcon className="h-12 w-12" />
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Edita tu banner</h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Sube una imagen para personalizar el banner de tu sitio web.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[200px]:flex-row">
              <label
                htmlFor="image-upload"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
              >
                Cargar imagen
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                />
              </label>
              {selectedImage && <Button onClick={handleConfirmImage}>Confirmar imagen</Button>}
            </div>
            {error && <p className="text-red-500">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

function ImageIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  );
}
