"use client"

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { JSX, SVGProps, useState } from "react"


export function EditarFotoCubiculo() {
  const [selectedImage, setSelectedImage] = useState<Blob | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleConfirmImage = () => {
    console.log("Imagen confirmada:", selectedImage);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Editar foto de tienda</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center">
          <img
            src="/placeholder.svg"
            alt="Foto de la tienda"
            width={400}
            height={300}
            className="rounded-md object-cover"
            style={{ aspectRatio: "400/300", objectFit: "cover" }}
          />
        </div>
        <div className="mt-4">
          <Label htmlFor="image">Cargar imagen</Label>
          <Input id="image" type="file" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline">Cancelar</Button>
        <Button>Guardar</Button>
      </CardFooter>
    </Card>
  )
}
