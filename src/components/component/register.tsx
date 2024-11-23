"use client";
import { JSX, SVGProps, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Register() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [telefono, setTelefono] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null); // Error específico para la contraseña
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const validarFormulario = () => {
    let valid = true;

    if (nombre.length < 4) {
      setError("El nombre debe tener al menos 4 caracteres.");
      valid = false;
    } else if (apellido.length < 4) {
      setError("El apellido debe tener al menos 4 caracteres.");
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      setError("Correo electrónico inválido.");
      valid = false;
    } else if (!/^[0-9]+$/.test(telefono)) {
      setError("El teléfono debe contener solo números.");
      valid = false;
    } else if (telefono.length < 10) {
      setError("El teléfono debe tener 10 dígitos.");
      valid = false;
    } else if (!validarContraseña(clave)) {
      valid = false;
    } else {
      setError(null);
      setPasswordError(null);
    }

    return valid;
  };

  const validarContraseña = (clave: string) => {
    const hasUpperCase = /[A-Z]/.test(clave);
    const hasNumber = /[0-9]/.test(clave);
    if (clave.length < 8 || !hasUpperCase || !hasNumber) {
      setPasswordError(
        "La contraseña debe tener al menos 8 caracteres, una mayúscula y un número."
      );
      return false;
    }
    setPasswordError(null);
    return true;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          NombrePersona: nombre,
          ApellidoPersona: apellido,
          CorreoPersona: correo,
          ClavePersona: clave,
          TelefonoPersona: telefono,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Usuario creado correctamente:", data);
        router.push("./login");
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error("Error al crear el usuario:", error);
      setError("Error al crear el usuario");
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto w-[350px] space-y-6">
          <div className="space-y-2 text-center">
            <div className="absolute top-4 left-4">
              <Link
                href="/"
                className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                prefetch={false}
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Volver atrás
              </Link>
            </div>
            <h1 className="text-3xl font-bold">Registrarse</h1>
            <p className="text-muted-foreground">
              Ingresa tus datos para crear una cuenta
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                placeholder="Ingresa tu nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                onFocus={() => setError(null)} // Limpia el error al enfocar
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Apellido</Label>
              <Input
                id="lastName"
                placeholder="Ingresa tu apellido"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                required
                onFocus={() => setError(null)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Ingresa tu teléfono"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                required
                onFocus={() => setError(null)}
                pattern="[0-9]*" // Solo permite números
                onKeyPress={(e) => {
                  // Previene el ingreso de letras y caracteres especiales
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
                onFocus={() => setError(null)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingresa tu contraseña"
                  onChange={(e) => {
                    setClave(e.target.value);
                    validarContraseña(e.target.value); // Validar contraseña en tiempo real
                  }}
                  required
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
              {passwordError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                  {passwordError}
                </div>
              )}
            </div>
            {error && !passwordError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            <div className="flex gap-4">
              <Button type="submit" className="w-full bg-plattea1">
                Registrarse
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/login" className="underline" prefetch={false}>
              Inicia sesión
            </Link>
          </div>
        </div>
      </div>
      <div className=" bg-muted lg:block">
        <img
          src="/Registrarse.jpg"
          alt="Imagen de registro"
          width="1920"
          height="1080"
          className="h-full w-full object-cover"
          style={{ aspectRatio: "1920/1080", objectFit: "cover" }}
        />
      </div>
    </div>
  );
}

function ArrowLeftIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
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

export default Register;
