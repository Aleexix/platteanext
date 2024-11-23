'use client';

import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SVGProps, useState } from 'react';

export function RecuperarClave() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch('http://localhost:4000/api/request-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo: email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Correo enviado con éxito. Revisa tu bandeja de entrada.');
      } else {
        setMessage(data.message || 'Error al enviar el correo.');
      }
    } catch (error: any) { // Especificamos el tipo de error como 'any'
      setMessage('Error al enviar el correo: ' + error.message);
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto w-[350px] space-y-6">
          <div className="absolute top-4 left-4">
            <Link
              href="/"
              className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Volver atrás
            </Link>
          </div>
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Recuperar contraseña</h1>
            <p className="text-muted-foreground">Ingresa tu correo electrónico para restablecer tu contraseña.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              Enviar
            </Button>
            {message && <p className="text-center text-red-500">{message}</p>}
          </form>
        </div>
      </div>
      <div className="h-screen bg-muted lg:block">
        <img
          src="/InicioSesion.jpg"
          alt="Paisaje natural"
          width="1200"
          height="800"
          className="h-full w-full object-cover"
          style={{ aspectRatio: "1200/800", objectFit: "cover" }}
        />
      </div>
    </div>
  );
}

function ArrowLeftIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}
