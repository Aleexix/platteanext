"use client";

import Link from "next/link"

export function TiendasM() {
  return (
    <section className="grid grid-cols-1 gap-6 p-4 md:grid-cols-2 lg:grid-cols-4 md:p-6">
      <div className="relative overflow-hidden rounded-lg group">
        <Link href="/shop" className="absolute inset-0 z-10" prefetch={false}>
          <span className="sr-only">Ver tienda</span>
        </Link>
        <img
          src="/placeholder.svg"
          alt="Tienda 1"
          width={400}
          height={300}
          className="object-cover w-full h-60"
          style={{ aspectRatio: "400/300", objectFit: "cover" }}
        />
        <div className="p-4 bg-background">
          <h3 className="text-lg font-semibold md:text-xl">Tienda de Ropa</h3>
          <p className="text-sm text-muted-foreground">Moda de última tendencia</p>
        </div>
      </div>
      <div className="relative overflow-hidden rounded-lg group">
        <Link href="/shop" className="absolute inset-0 z-10" prefetch={false}>
          <span className="sr-only">Ver tienda</span>
        </Link>
        <img
          src="/placeholder.svg"
          alt="Tienda 2"
          width={400}
          height={300}
          className="object-cover w-full h-60"
          style={{ aspectRatio: "400/300", objectFit: "cover" }}
        />
        <div className="p-4 bg-background">
          <h3 className="text-lg font-semibold md:text-xl">Librería Artesanal</h3>
          <p className="text-sm text-muted-foreground">Libros únicos y artesanales</p>
        </div>
      </div>
      <div className="relative overflow-hidden rounded-lg group">
        <Link href="/shop" className="absolute inset-0 z-10" prefetch={false}>
          <span className="sr-only">Ver tienda</span>
        </Link>
        <img
          src="/placeholder.svg"
          alt="Tienda 3"
          width={400}
          height={300}
          className="object-cover w-full h-60"
          style={{ aspectRatio: "400/300", objectFit: "cover" }}
        />
        <div className="p-4 bg-background">
          <h3 className="text-lg font-semibold md:text-xl">Tienda de Artesanías</h3>
          <p className="text-sm text-muted-foreground">Productos hechos a mano</p>
        </div>
      </div>
      <div className="relative overflow-hidden rounded-lg group">
        <Link href="/shop" className="absolute inset-0 z-10" prefetch={false}>
          <span className="sr-only">Ver tienda</span>
        </Link>
        <img
          src="/placeholder.svg"
          alt="Tienda 4"
          width={400}
          height={300}
          className="object-cover w-full h-60"
          style={{ aspectRatio: "400/300", objectFit: "cover" }}
        />
        <div className="p-4 bg-background">
          <h3 className="text-lg font-semibold md:text-xl">Tienda de Electrónicos</h3>
          <p className="text-sm text-muted-foreground">Gadgets y dispositivos modernos</p>
        </div>
      </div>
    </section>
  )
}
