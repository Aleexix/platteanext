"use client";

import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { JSX, SVGProps, useRef, useState } from 'react';

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseña
  const router = useRouter();
  const [error, setError] = useState("");

  // Refs para los campos de entrada
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setError(""); // Limpiar cualquier error previo
 
    try {
      const response = await fetch("http://localhost:4000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ CorreoPersona: email, ClavePersona: password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Guardar el token y el idRolFK en localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("idRolFK", data.persona.idRolFK);  // Guardar idRolFK en localStorage
        console.log("Token:", data.token);
        console.log("Rol:", data.persona.idRolFK);

        // Redirigir a la página deseada
        router.push("./");
      } else {
        // Mostrar el mensaje de error
        setError(data.message || "Error al iniciar sesión.");
      }
    } catch (err) {
      console.error("Error al intentar iniciar sesión:", err);
      setError("Ocurrió un error. Por favor, inténtalo nuevamente.");
    }
  };

  // Función para manejar el evento de Enter y enfocar el siguiente campo
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, nextRef: React.RefObject<HTMLInputElement>) => {
    if (e.key === "Enter" && nextRef.current) {
      nextRef.current.focus();  // Enfocar el siguiente campo
    }
  };

  return (
    <div className="w-full  lg:grid lg:min-h-[600px] lg:grid-cols-2  h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto w-[350px] space-y-6">
          <div className="space-y-2 text-center">
            <div className="absolute top-4 left-4">
              <Link
                href="/"
                className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Volver atrás
              </Link>
            </div>
            <h1 className="text-3xl font-bold">Iniciar sesión</h1>
            <p className="text-muted-foreground">Ingresa tu correo y contraseña para acceder a tu cuenta</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                ref={emailInputRef}  // Añadir ref para el campo de correo
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, passwordInputRef)} // Mover al siguiente campo al presionar Enter
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"} // Tipo de campo basado en el estado
                  placeholder="Ingresa tu contraseña"
                  ref={passwordInputRef}  // Añadir ref para el campo de contraseña
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex gap-4">
              <Button type="submit" className="w-full bg-plattea1">
                Iniciar sesión
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            ¿Has olvidado tu contraseña?{" "}
            <Link href="/recuperarClave" className="underline">
              Cambiar Contraseña
            </Link>
          </div>
          <div className="mt-4 text-center text-sm">
            ¿No tienes una cuenta?{" "}
            <Link href="/register" className="underline">
              Regístrate
            </Link>
          </div>
        </div>
      </div>
      <div className=" bg-muted lg:block ">
        <img
          src="/InicioSesion.jpg"
          alt="Imagen de inicio de sesión"
          width="1920"
          height="1080"
          className="h-full w-full object-cover"
          style={{ aspectRatio: "1920/1080", objectFit: "cover" }}
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

function EyeIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
      <path d="M16.9 16.9a10.3 10.3 0 0 1-4.4 1.1C7.8 18 5.6 14.9 5.6 12s2.2-6 6.9-6c1.3 0 2.5.3 3.5.8" />
      <path d="M23 1 1 23" />
    </svg>
  );
}
