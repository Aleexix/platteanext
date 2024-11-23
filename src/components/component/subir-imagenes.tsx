
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function subirImagenes() {
  return (
    <Card className="overflow-hidden max-w-2xl">
      <CardHeader>
        <CardTitle>Cargar imágenes</CardTitle>
        <CardDescription>Sube tus imágenes para el producto</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="thumbnail">Imagen miniatura</Label>
              <div className="grid gap-2">
                <Input id="thumbnail" type="file" />
                <img
                  src="/placeholder.svg"
                  alt="Thumbnail"
                  width={200}
                  height={200}
                  className="object-cover w-full rounded-md"
                  style={{ aspectRatio: "200/200", objectFit: "cover" }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="banner">Imagen banner</Label>
              <div className="grid gap-2">
                <Input id="banner" type="file" />
                <img
                  src="/placeholder.svg"
                  alt="Banner"
                  width={200}
                  height={200}
                  className="object-cover w-full rounded-md"
                  style={{ aspectRatio: "200/200", objectFit: "cover" }}
                />
              </div>
            </div>
          </div>
          <Button type="submit">Enviar</Button>
        </div>
      </CardContent>
    </Card>
  )
}
