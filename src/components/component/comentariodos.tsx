import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SVGProps, useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import NextCrypto from 'next-crypto'; // Importar el módulo de encriptación

interface ComentariosProps {
  idProducto: string;
}

interface Comentario {
  NombrePersona: string;
  FechaAprobacion: string;
  ComentarioAprobacion: string;
  FotoPersonaURL: string;
  CalificacionAprobacion: number;
}

interface DecodedToken {
  IdPersona: string;
}

export function Comentariodos({ idProducto }: ComentariosProps) {
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [comentario, setComentario] = useState('');
  const [calificacion, setCalificacion] = useState(0);
  const [idPersona, setIdPersona] = useState<number | null>(null);
  const [nombrePersona, setNombrePersona] = useState<string>('');
  const [fotoPersonaURL, setFotoPersonaURL] = useState<string>('');
  const [decryptedIdProducto, setDecryptedIdProducto] = useState<string | null>(null); // Estado para el ID desencriptado
  const crypto = new NextCrypto('secret key'); // Instancia de NextCrypto

  useEffect(() => {
    const fetchProductId = async () => {
      try {
        // Desencriptar el ID del producto
        const decodedId = decodeURIComponent(idProducto);
        const decrypted = await crypto.decrypt(decodedId);
        setDecryptedIdProducto(decrypted);
      } catch (error) {
        console.error("Error al desencriptar el ID del producto:", error);
      }
    };

    fetchProductId();
  }, [idProducto]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: DecodedToken = jwtDecode(token);
        const userId = Number(decodedToken.IdPersona);
        setIdPersona(userId);

        const fetchProfile = async () => {
          try {
            const response = await axios.get<{ NombrePersona: string, FotoPersonaURL: string }>(`http://localhost:4000/api/persona/${userId}`);
            setNombrePersona(response.data.NombrePersona);
            setFotoPersonaURL(response.data.FotoPersonaURL);
          } catch (error) {
            console.error('Error al obtener el perfil de la persona:', error);
          }
        };

        fetchProfile();
      } catch (error) {
        console.error('Error al decodificar el token:', error);
      }
    } else {
      setIdPersona(null); // Asegurarse de que el estado esté actualizado si no hay token
    }
  }, []);

  useEffect(() => {
    const fetchComentarios = async () => {
      if (decryptedIdProducto) {
        try {
          const response = await axios.get<{ [key: string]: Comentario }>(`http://localhost:4000/api/aprobacion/${decryptedIdProducto}`);
          const comentariosArray = Object.values(response.data);
          setComentarios(comentariosArray);
        } catch (error) {
          console.error('Error al obtener los comentarios:', error);
        }
      }
    };
  
    fetchComentarios();
  }, [decryptedIdProducto]);

  const handleComentarioChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComentario(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!idPersona || !decryptedIdProducto) {
      console.warn('No se puede enviar el comentario, falta idPersona o idProducto');
      return;
    }

    try {
      await axios.post('http://localhost:4000/api/aprobacion/', {
        ComentarioAprobacion: comentario,
        CalificacionAprobacion: calificacion,
        IdPersonaFK: idPersona,
        IdProductoFK: Number(decryptedIdProducto)
      });

      const nuevoComentario: Comentario = {
        NombrePersona: nombrePersona,
        FechaAprobacion: new Date().toISOString(),
        ComentarioAprobacion: comentario,
        FotoPersonaURL: fotoPersonaURL,
        CalificacionAprobacion: calificacion
      };
      setComentarios([...comentarios, nuevoComentario]);

      setComentario('');
      setCalificacion(0);
    } catch (error) {
      console.error('Error al enviar el comentario:', error);
    }
  };

  const handleRatingChange = (newRating: number) => {
    if (idPersona) {
      setCalificacion(newRating);
    }
  };

  return (
    <Card className="px-4 md:px-6 py-8 w-full max-w-[1600px] m-auto">

      {/* Puntuacion Section */}
      <div className="w-full p-6">
        <div className="grid gap-4 sm:gap-6">
          <div className="grid gap-2">
            <CardTitle className="text-2xl font-bold">Reseña del producto</CardTitle>
            <CardDescription className="text-muted-foreground">
              Comparte tus pensamientos sobre este producto.
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className={`p-2 rounded-full transition-colors ${star <= calificacion ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"} ${!idPersona ? "cursor-not-allowed opacity-50" : ""}`}
                onClick={() => handleRatingChange(star)}
                disabled={!idPersona}
              >
                <StarIcon className="w-6 h-6" />
              </button>
            ))}
            {calificacion > 0 && <span className="text-2xl font-bold">{calificacion} / 5</span>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="review">Tu reseña</Label>
            <form onSubmit={handleSubmit}>
              <Textarea
                id="review"
                placeholder={idPersona ? "Describe tu experiencia con el producto..." : "Inicia sesión para agregar un comentario..."}
                rows={3}
                value={comentario}
                onChange={handleComentarioChange}
                className="min-h-[100px] resize-none"
                disabled={!idPersona}
              />
              <div className="flex justify-end mt-4">
                <Button type="submit" disabled={!idPersona}>Enviar</Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Comentarios Section */}
      {comentarios.length > 0 ? (
        comentarios.map((comentario, index) => (
          <div key={index} className="flex items-start space-x-4 mt-4 ml-4 ">
            <Avatar>
              <AvatarImage src={comentario.FotoPersonaURL || "/placeholder-user.jpg"} alt="Avatar usuario" />
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">{comentario.NombrePersona}</h4>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    {[...Array(5)].map((_, index) => (
                      <StarIcon key={index} className={`w-4 h-4 ${index < comentario.CalificacionAprobacion ? 'text-black' : 'text-gray-300'} fill-current`} />
                    ))}
                    <span><time>{new Date(comentario.FechaAprobacion).toLocaleDateString()}</time></span>
                  </div>
                </div>
              </div>
              <p className="mt-2 text-sm">{comentario.ComentarioAprobacion}</p>
            </div>
          </div>
        ))
      ) : (
        <p></p>
      )}
    </Card>
  );
}

function StarIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
