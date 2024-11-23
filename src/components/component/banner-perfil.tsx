
      import { Card } from "@/components/ui/card"
      import { Avatar, AvatarImage } from "@/components/ui/avatar"
      import { useEffect, useState } from "react";
      import { JSX, SVGProps } from "react"
      import {jwtDecode} from 'jwt-decode';


      interface DecodedToken {
        IdPersona: string;
      }

      interface Profile {
        FotoPersonaURL: string;
        bannerPersonaURL:  string;
        NombrePersona: string;
        ApellidoPersona: string;
        CorreoPersona: string;
        CiudadPersona: string;
        DescripcionPersona: string;
        DireccionPersona: string;
        tiendas: any[];
      }


      export function BannerPerfil() {
        const [profile, setProfile] = useState<Profile | null>(null);
        const [error, setError] = useState<string>("");

        useEffect(() => {
          const fetchProfile = async () => {
            try {
              const token = localStorage.getItem("token");
              if (!token) {
                throw new Error("No token found");
              }

              const decoded: DecodedToken = jwtDecode(token);
              const userId = decoded.IdPersona;

              console.log('Decoded Token:', decoded); // Verifica el token decodificado

              const response = await fetch(`http://localhost:4000/api/persona/${userId}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

              console.log('Response:', response); // Verifica la respuesta de la API

              if (response.ok) {
                const data: Profile = await response.json();
                console.log('Profile data:', data); // Verifica los datos del perfil obtenidos
                setProfile(data);
              } else {
                throw new Error("Error fetching profile");
              }
            } catch (error) {
              console.error(error);
              setError("Error al obtener el perfil");
            }
          };

          fetchProfile();
        }, []);

        if (error) return <p>Error: {error}</p>;
        return (
          <Card className="w-full rounded-2x2 overflow-hidden">
            <div className="h-70 bg-[#1e1e1e] relative flex justify-center">
              <img
                src={profile?.bannerPersonaURL}
                alt="Banner"
                className="w-full h-full object-cover"
                width="768"
                height="192"
                style={{ aspectRatio: "768/192", objectFit: "cover" }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1e1e1e]" />
            </div>
            <div className="p-6 pt-12 bg-white text-black">
              <div className="flex items-center gap-4">
                <Avatar className="w-24 h-24 border-4 border-white">
                <AvatarImage src={profile?.FotoPersonaURL || "/OIP.jpeg"} alt="User Avatar" />
                </Avatar>
                <div className="flex-1">
                  <div className="text-2xl font-bold">{profile?.NombrePersona || "Nombre Usuario"}  {profile?.ApellidoPersona || ""}</div>
                  <div className="text-sm text-gray-500">{profile?.CorreoPersona || "Correo@"}</div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <InfoIcon className="w-4 h-4 text-gray-500" />
                  <span> {profile?.DescripcionPersona || "Descripción no disponible"}</span>
                </div>
              </div>
            </div>
          </Card>
        )
      }

      function InfoIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
        )
      }


      function MapPinIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        )
      }
