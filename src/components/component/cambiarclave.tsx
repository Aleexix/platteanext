import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import {useRouter, useParams } from 'next/navigation';

interface DecodedToken {
  Correo: string;
}

export function Cambiarclave() {
  const params = useParams(); // Hook para el enrutador de Next.js
  const token = Array.isArray(params.token) ? params.token[0] : params.token;
  const router = useRouter(); 
  const [correo, setCorreo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        setCorreo(decoded.Correo);
        console.log("Correo: ", decoded.Correo);
      } catch (error) {
        console.error("Error al decodificar el token: ", error);
        setError("Token inválido o expirado");
      }
    } else {
      setError("No se encontró el token en la URL");
    }
  }, [token]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // Usar event.currentTarget para obtener el formulario completo
    const form = event.currentTarget;
    const newPassword = form.password.value; // Acceder al valor directamente desde el formulario

    // Verificar que el correo y la nueva contraseña estén presentes
    if (!correo || !newPassword) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gmail: correo,
          newPassword: newPassword,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al restablecer la contraseña");
      }

      const data = await response.json();
      router.push("/login");
      console.log("Respuesta de la API:", data);
      setSuccess("Contraseña restablecida con éxito.");
      setError(null); // Limpiar errores
    } catch (error) {
      console.error("Error:", error);
      setError(error instanceof Error ? error.message : "Error desconocido");
      setSuccess(null); // Limpiar éxito
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto w-[350px] space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Cambiar contraseña</h1>
            <p className="text-muted-foreground">Ingresa tu nueva contraseña.</p>
            {error && <p className="text-red-500">{error}</p>} {/* Mostrar error si hay */}
            {success && <p className="text-green-500">{success}</p>} {/* Mostrar éxito si hay */}
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Nueva contraseña</Label>
              <Input id="password" name="password" type="password" placeholder="Ingresa tu nueva contraseña" required />
            </div>
            <Button type="submit" className="w-full">
              Cambiar
            </Button>
          </form>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <img
          src="/placeholder.svg"
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
