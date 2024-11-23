import Link from "next/link"

export function BannerWork() {
  return (
    <section className="w-full bg-gradient-to-r from-primary to-primary-foreground py-12 md:py-24 lg:py-32 ">
      <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-12">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tighter text-primary-foreground sm:text-4xl md:text-5xl lg:text-6xl">
            Abre tu tienda virtual
          </h2>
          <p className="max-w-[600px] text-primary-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Expande tu negocio al mundo digital y llega a más clientes. Con una tienda en línea, podrás vender las 24
            horas del día y gestionar tu negocio de manera más eficiente.
          </p>
          <Link
            href="/agregartienda"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary-foreground px-8 text-sm font-medium text-primary shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            prefetch={false}
          >
            Crear mi tienda
          </Link>
        </div>
        <div className="flex justify-center w-full">
          <img
            src="/bannerwork.png"
            alt="Tienda virtual"
            width="400"
            height="400"
            className="max-w-full"
            style={{ aspectRatio: "400/400", objectFit: "cover" }}
          />
        </div>
      </div>
    </section>
  )
}
