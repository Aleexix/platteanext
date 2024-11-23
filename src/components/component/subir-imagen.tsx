/* "use client"

import { useState } from "react"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

export function SubirImagen() {
  const [file, setFile] = useState(null)
  const [width, setWidth] = useState(300)
  const [height, setHeight] = useState(300)

  const handleFileChange = (event) => {
    if (event.target.files) {
      setFile(event.target.files[0])
    }
  }

  const handleDrop = (event) => {
    event.preventDefault()
    if (event.dataTransfer.files) {
      setFile(event.dataTransfer.files[0])
    }
  }

  const handleUpload = () => {
    console.log("Subiendo imagen:", file)
  }

  return (
    <Dialog defaultOpen>
      <DialogTrigger asChild>
        <Button variant="outline">Cargar imagen</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cargar imagen</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleDrop}
            className="flex items-center justify-center w-full h-[300px] border-2 border-dashed border-muted rounded-md cursor-pointer"
          >
            {file ? (
              <img
                src="/placeholder.svg"
                alt="Imagen cargada"
                width={width}
                height={height}
                className="max-w-full max-h-full object-contain"
                style={{ aspectRatio: width / height, objectFit: "cover" }}
              />
            ) : (
              <span className="text-muted-foreground">Arrastra y suelta una imagen o haz clic para seleccionar</span>
            )}
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="width" className="text-right">
              Ancho
            </Label>
            <Slider
              id="width"
              value={[width]}
              onValueChange={setWidth}
              min={100}
              max={800}
              step={10}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="height" className="text-right">
              Alto
            </Label>
            <Slider
              id="height"
              value={[height]}
              onValueChange={setHeight}
              min={100}
              max={600}
              step={10}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleUpload} disabled={!file}>
            Subir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
 */