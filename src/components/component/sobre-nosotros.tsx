
export function SobreNosotros() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-4">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Sobre Nosotros</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Brindamos espacios para que inicies tu propio negocio
            </h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Nuestra empresa se dedica a ofrecer espacios de trabajo flexibles y servicios de apoyo a emprendedores y
              pequeñas empresas. Nuestro objetivo es brindar las herramientas y el entorno necesarios para que puedas
              hacer crecer tu negocio.
            </p>
          </div>
          <div className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-1">
                <h3 className="text-xl font-bold">Misión</h3>
                <p className="text-muted-foreground">
                  Nuestra misión es apoyar a los emprendedores y ayudarlos a alcanzar el éxito, proporcionándoles
                  espacios de trabajo innovadores y servicios de valor agregado.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-xl font-bold">Visión</h3>
                <p className="text-muted-foreground">
                  Nuestra visión es convertirnos en el destino preferido para que los emprendedores inicien y hagan
                  crecer sus negocios, ofreciendo un ecosistema completo de recursos y oportunidades.
                </p>
              </div>
            </div>
            <div className="grid gap-4">
              <div className="grid gap-1">
                <h3 className="text-xl font-bold">Espacios de Trabajo</h3>
                <p className="text-muted-foreground">
                  Ofrecemos una variedad de espacios de trabajo flexibles, desde oficinas privadas hasta espacios de
                  coworking, para adaptarnos a las necesidades de tu negocio.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-xl font-bold">Servicios</h3>
                <p className="text-muted-foreground">
                  Además de los espacios de trabajo, brindamos servicios de apoyo como asesoría empresarial, acceso a
                  redes de contactos, y programas de capacitación y desarrollo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
