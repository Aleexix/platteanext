"use client";


import { useState, useEffect, SVGProps } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { jwtDecode } from "jwt-decode"; // Usa la importación correcta para jwt-decode
import { XIcon } from "lucide-react";
import Link from "next/link";


interface DecodedToken {
  IdPersona: string;
}

interface Profile {
  CorreoPersona: string;
}
interface FooterProps {
  className?: string; // Acepta className como prop opcional
}


export function Footer({ className }: FooterProps) {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string | null>(null); // Permite valores null

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const decoded: DecodedToken = jwtDecode(token);
        const userId = decoded.IdPersona;

        const response = await fetch(
          `http://localhost:4000/api/persona/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data: Profile = await response.json();
          setEmail(data.CorreoPersona);
        } else {
          throw new Error("Error fetching profile");
        }
      } catch (error) {
        console.error(error);
        setError("Error al cargar el perfil");
      }
    };

    fetchProfile();
  }, []);

  //usuario no logueado 

  if (error) {
    return (
      <footer className="bg-plattea1 py-8 md:py-5 text-white relative ">
        <div className="container mx-auto grid grid-cols-1 gap-8 px-4 md:grid-cols-3 md:gap-12">
          <div className="flex flex-col items-start gap-4">
            <a href="#" className="flex items-center">
              <PlatteaIcon className="h-9 w-8" />
              <span className="ml-2 text-lg font-bold">Plattea</span>
            </a>
            <div className="grid gap-2">
              <Link href="/nosotros" className="text-sm hover:underline">
                Sobre Nosotros
              </Link>
              <Link href="/Plattea.pdf" target="_blank" className="text-sm hover:underline">
                Manual de Usuario
              </Link>
              <Link href="/terminosycondiciones" className="text-sm hover:underline">
                Términos y condiciones del sitio
              </Link>
              <Link href="/workwithus" className="text-sm hover:underline">
              Vende en Plattea
            </Link>
            </div>
          </div>
          <div className="flex flex-col items-start gap-4">
            <h3 className="text-lg font-bold">Contáctanos</h3>
            <Dialog>
                <DialogTrigger asChild>
                  <span className="text-sm cursor-pointer hover:underline">
                    Feedback y Sugerencias
                  </span>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">           
                  <div className="flex flex-col items-center justify-center gap-4 py-8">
                  <DialogTitle>Feedback y Sugerencias</DialogTitle>
                  <DialogDescription>
                    Proporcione sus comentarios y sugerencias para ayudarnos a mejorar.
                  </DialogDescription>
                    <form action="https://formsubmit.co/platteaonline@gmail.com" method="POST" className="grid w-full gap-4">
                      <label htmlFor="email" className="text-sm font-medium">Email</label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        placeholder="Email"
                        readOnly
                        name="Email"
                      />
                      <label htmlFor="name" className="text-sm font-medium">Asunto</label>
                      <Input id="name" type="text" placeholder="Asunto" name="Asunto" required />
                      <label htmlFor="feedback" className="text-sm font-medium">Comentarios</label>
                      <Textarea id="feedback" placeholder="Feedback y Sugerencias" name="comentario" required/>
                      <input type="hidden" name="_captcha" value="false"/>
                      <input type="hidden" name="_template" value="table"/>
                      <input type="hidden" name="_next" value="http://localhost:3000/"></input>
                      <Button type="submit">Enviar</Button>
                    </form>
                  </div>
                </DialogContent>
              </Dialog>
          </div>
          <div className="flex flex-col items-start gap-4">
            <h3 className="text-lg font-bold">Síguenos</h3>
            <div className="flex gap-4">
              <a href="https://x.com/Plattea_Online" target="_blank" className="text-muted-foreground hover:text-primary">
                <TwitterXIcon className="h-6 w-6" />
              </a>
              <a href="https://www.facebook.com/profile.php?id=61565242752834" className="text-muted-foreground hover:text-primary" target="_blank">
                <FacebookIcon className="h-6 w-6" />
              </a>
              <a href="https://www.instagram.com/platteaonline/" target="_blank" className="text-muted-foreground hover:text-primary">
                <InstagramIcon className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-2 text-sm" style={{ right: '18px' }}>
          Copyright © {new Date().getFullYear()} Plattea Todos los derechos reservados
        </div>
      </footer>
    );
  }
//Usuario logeado
  return (
    <footer className="bg-plattea1 py-8 md:py-5 text-white relative">
      <div className="container mx-auto grid grid-cols-1 gap-8 px-4 md:grid-cols-3 md:gap-12">
        <div className="flex flex-col items-start gap-4">
          <a href="#" className="flex items-center">
            <PlatteaIcon className="h-9 w-8" />
            <span className="ml-2 text-lg font-bold">Plattea</span>
          </a>
          <div className="grid gap-2">
            <Link href="/nosotros" className="text-sm hover:underline">
              Sobre Nosotros
            </Link>
            <Link href="/Plattea.pdf" target="_blank" className="text-sm hover:underline">
              Manual de Usuario
            </Link>
            <Link href="/terminosycondiciones" className="text-sm hover:underline">
              Términos y condiciones del sitio
            </Link>
            <Link href="/workwithus" className="text-sm hover:underline">
              Vende en Plattea
            </Link>

          </div>
        </div>
        <div className="flex flex-col items-start gap-4">
          <h3 className="text-lg font-bold">Contáctanos</h3>
          <Dialog>
                <DialogTrigger asChild>
                  <span className="text-sm cursor-pointer hover:underline">
                    Feedback y Sugerencias
                  </span>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">           
                  <div className="flex flex-col items-center justify-center gap-4 py-8">
                  <DialogTitle>Feedback y Sugerencias</DialogTitle>
                  <DialogDescription>
                    Proporcione sus comentarios y sugerencias para ayudarnos a mejorar.
                  </DialogDescription>
                    <form action="https://formsubmit.co/platteaonline@gmail.com" method="POST" className="grid w-full gap-4">
                      <label htmlFor="email" className="text-sm font-medium">Email</label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        placeholder="Email"
                        readOnly
                        name="Email"
                      />
                      <label htmlFor="name" className="text-sm font-medium">Asunto</label>
                      <Input id="name" type="text" placeholder="Asunto" name="Asunto" required />
                      <label htmlFor="feedback" className="text-sm font-medium">Comentarios</label>
                      <Textarea id="feedback" placeholder="Feedback y Sugerencias" name="comentario" required/>
                      <input type="hidden" name="_captcha" value="false"/>
                      <input type="hidden" name="_template" value="table"/>
                      <input type="hidden" name="_next" value="http://localhost:3000/"></input>
                      <Button type="submit">Enviar</Button>
                    </form>
                  </div>
                </DialogContent>
              </Dialog>
        </div>
        <div className="flex flex-col items-start gap-4">
          <h3 className="text-lg font-bold">Síguenos</h3>
          <div className="flex gap-4">
            <a href="https://x.com/Plattea_Online"  target="_blank" className="text-muted-foreground hover:text-primary">
              <TwitterXIcon className="h-6 w-6" />
            </a>
            <a href="https://www.facebook.com/profile.php?id=61565242752834" className="text-muted-foreground hover:text-primary" target="_blank">
              <FacebookIcon className="h-6 w-6" />
            </a>
            <a href="https://www.instagram.com/platteaonline/" target="_blank" className="text-muted-foreground hover:text-primary">
              <InstagramIcon className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
      <div className="absolute bottom-2 text-sm" style={{ right: '18px' }}>
        Copyright © {new Date().getFullYear()} Plattea Todos los derechos reservados
      </div>
    </footer>
  );
}

function FacebookIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h2z" />
    </svg>
  );
}

function InstagramIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="3" />
      <line x1="17" y1="7" x2="17.01" y2="7" />
    </svg>
  );
}


function PlatteaIcon(props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="500"
      height="500"
      viewBox="0 0 375 375"
      preserveAspectRatio="xMidYMid meet"
      version="1.0"
    >
      <defs>
        <clipPath id="b21ddd5b3f">
          <path d="M 146 204 L 172 204 L 172 298.1875 L 146 298.1875 Z M 146 204 " clipRule="nonzero"/>
        </clipPath>
        <clipPath id="56fe638cd2">
          <path d="M 87.855469 76.9375 L 287.355469 76.9375 L 287.355469 229 L 87.855469 229 Z M 87.855469 76.9375 " clipRule="nonzero"/>
        </clipPath>
      </defs>
      <g clipPath="url(#b21ddd5b3f)">
        <path fill="#FFFFFF" d="M 146.160156 298.03125 L 171.722656 298.03125 L 171.722656 225.054688 C 162.449219 219.5 153.875 212.402344 146.160156 204.746094 Z M 146.160156 298.03125 " fillOpacity="1" fillRule="nonzero"/>
      </g>
      <g clipPath="url(#56fe638cd2)">
        <path fill="#FFFFFF" d="M 211.917969 79.765625 L 146.160156 79.765625 L 146.160156 138.328125 C 152.976562 149.121094 161.871094 161.652344 171.722656 172.289062 L 171.722656 105.789062 L 212.460938 105.789062 C 239.34375 105.789062 261.128906 127.574219 261.128906 154.457031 C 261.128906 161.394531 259.648438 167.851562 257.03125 173.667969 C 249.238281 191.015625 230.746094 202.527344 211.898438 203.128906 C 197.367188 203.589844 184.617188 194.832031 174.324219 185.398438 C 158.613281 170.96875 145.878906 153.519531 135.285156 135.089844 C 133.988281 132.851562 118.757812 105.46875 115.71875 100.273438 L 121.953125 96.675781 L 104.925781 86.820312 L 87.894531 76.964844 L 87.855469 116.300781 L 93.871094 112.84375 C 114.960938 150.882812 135.828125 194.875 174.683594 217.917969 C 179.71875 220.917969 185.035156 223.4375 190.59375 225.296875 C 210.941406 232.152344 232.804688 228.414062 250.996094 217.421875 C 258.890625 212.664062 265.925781 206.507812 271.621094 199.25 C 281.316406 186.898438 287.132812 171.527344 287.113281 154.398438 C 287.09375 113.085938 253.234375 79.765625 211.917969 79.765625 Z M 211.917969 79.765625 " fillOpacity="1" fillRule="nonzero"/>
      </g>
    </svg>
  );
}




function TwitterXIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 30 30">
  <path d="M26.37,26l-8.795-12.822l0.015,0.012L25.52,4h-2.65l-6.46,7.48L11.28,4H4.33l8.211,11.971L12.54,15.97L3.88,26h2.65 l7.182-8.322L19.42,26H26.37z M10.23,6l12.34,18h-2.1L8.12,6H10.23z" fill="currentColor"/>
</svg>

  );
}
