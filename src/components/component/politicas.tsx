
"use client";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useParams, useRouter } from 'next/navigation';

export function Politicas() {
  const router = useRouter(); 
  return (
    <div style={{ position: 'relative' }}>
        <Button
          onClick={() => router.back()}
          className="inline-flex h-10 ml-8 items-center justify-center rounded-md border border-input bg-accent text-accent-foreground px-4 text-sm font-medium shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-10 hover:bg-gray-200"
          style={{ position: 'absolute', top: '45px', left: '20px' }}
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Volver atrás
        </Button>

    <div className="w-full max-w-4xl mx-auto p-6 md:p-8 lg:p-10">
     
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Términos y Condiciones</h1>
          <p className="mt-2 text-muted-foreground">
            Bienvenido a nuestra tienda en línea. Estos términos y condiciones rigen el uso de nuestros servicios y el
            acceso a nuestro sitio web. Al utilizar nuestros servicios, usted acepta cumplir con estos términos.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold">Métodos de Pago</h2>
          <p className="mt-2 text-muted-foreground">
            Aceptamos una variedad de métodos de pago, incluyendo tarjetas de crédito, tarjetas de débito y
            transferencias bancarias. Todos los pagos se procesan de manera segura y confidencial. No almacenamos ni
            tenemos acceso a la información de su tarjeta de crédito.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold">Devoluciones y Reembolsos</h2>
          <p className="mt-2 text-muted-foreground">
            Ofrecemos un período de 30 días para devoluciones y reembolsos. Si no está satisfecho con su compra, puede
            devolverla y le reembolsaremos el monto total. Tenga en cuenta que los artículos deben estar en su condición
            original y sin usar.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold">Privacidad y Protección de Datos</h2>
          <p className="mt-2 text-muted-foreground">
            Nos tomamos muy en serio la privacidad y la protección de sus datos personales. Recopilamos solo la
            información necesaria para procesar sus pedidos y mejorar su experiencia en nuestro sitio web. Nunca
            compartiremos ni venderemos su información a terceros sin su consentimiento.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold">Propiedad Intelectual</h2>
          <p className="mt-2 text-muted-foreground">
            Todo el contenido de nuestro sitio web, incluyendo textos, imágenes, logotipos y diseños, son propiedad de
            nuestra empresa y están protegidos por derechos de autor. Queda prohibida la reproducción o uso no
            autorizado de cualquier material sin nuestro consentimiento previo por escrito.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold">Limitación de Responsabilidad</h2>
          <p className="mt-2 text-muted-foreground">
            No seremos responsables por ningún daño o pérdida que pueda resultar del uso de nuestros servicios,
            incluyendo, pero no limitado a, daños directos, indirectos, incidentales o consecuentes. Nos reservamos el
            derecho de modificar estos términos y condiciones en cualquier momento sin previo aviso.
          </p>
        </div>
      </div>
    </div>
    </div>
  )
}
