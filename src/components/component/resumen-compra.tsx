"use client";
import Image from "next/image";
import { ShoppingCart, Truck, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import NextCrypto from "next-crypto";
import axios from "axios";
import { jwtDecode } from "jwt-decode";


interface Producto {
  IdProducto: string;
  NombreProducto: string;
  PrecioProducto: string;
  FotoProductoURL: string;
  cantidad: number;
}

interface JWTDecoded {
  IdPersona: number;
}

export function ResumenCompra() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const params = useParams();
  const encryptedIdPedido = params.IdPedido as string;
  const crypto = new NextCrypto("secret key");
  const router = useRouter();

  const Alert = ({ message, onClose }: { message: string; onClose: () => void }) => {
    const [isExiting, setIsExiting] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          setIsVisible(false);
          onClose();
        }, 300);
      }, 3000);

      return () => clearTimeout(timer);
    }, [onClose]);

    if (!isVisible) return null;

    return (
      <div
        className={`fixed top-4 right-4 bg-platteaGreenv2 text-white p-4 rounded-md shadow-lg z-50 transition-all duration-300 ease-in-out ${
          isExiting ? "animate-fade-out" : "animate-fade-in"
        }`}
      >
        <div className="flex justify-between items-center">
          <span>{message}</span>
          <button
            onClick={() => {
              setIsExiting(true);
              setTimeout(() => {
                setIsVisible(false);
                onClose();
              }, 300);
            }}
            className="text-white ml-2"
          >
            &times;
          </button>
        </div>
      </div>
    );
  };

  const formatPrice = (precio: number | string) => {
    const numero = typeof precio === "string" ? Number(precio) : precio;
    return new Intl.NumberFormat("es-ES").format(numero);
  };

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const safeIdPedido = encryptedIdPedido.replace(/_/g, "/").replace(/-/g, "+");
        const decodedId = decodeURIComponent(safeIdPedido);
        const decryptedId = await crypto.decrypt(decodedId);
        const response = await fetch(`http://localhost:4000/api/pedido/${decryptedId}`);
        const data: Producto[] = await response.json();
        setProductos(data);
      } catch (error) {
        console.error("Error al obtener productos:", error);
        setAlertMessage("Error al obtener los productos");
      }
    };

    if (encryptedIdPedido) {
      fetchProductos();
    }
  }, [encryptedIdPedido]);

  const handleConfirmarCompra = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setAlertMessage("Token no encontrado");
      return;
    }

    const decodedToken: JWTDecoded = jwtDecode(token);
    const IdPersona = decodedToken.IdPersona;

    try {
      if (isProcessing) return;
      setIsProcessing(true);
      const safeIdPedido = encryptedIdPedido.replace(/_/g, "/").replace(/-/g, "+");
      const decodedId = decodeURIComponent(safeIdPedido);
      const decryptedId = await crypto.decrypt(decodedId);

      const subtotal = productos.reduce((acc, item) => acc + Number(item.PrecioProducto) * item.cantidad, 0);
      const shipping = 15000 * productos.length;
      const total = subtotal + shipping;

      const response = await axios.post("http://localhost:4000/api/confirmarpedido", {
        IdPedido: decryptedId,
        Total: total.toFixed(2),
        IdPersona: IdPersona,
      });

      if (response.status === 200) {
        setAlertMessage("Compra confirmada con éxito");
        setTimeout(() => {
          router.push("/");
        }, 3000);
      } else {
        setAlertMessage("Hubo un problema al confirmar la compra");
      }
    } catch (error) {
      console.error("Error al confirmar la compra:", error);
      setAlertMessage("Error al confirmar la compra");
    } finally {
      setIsProcessing(false);
    }
  };

  const subtotal = productos.reduce((acc, item) => acc + Number(item.PrecioProducto) * item.cantidad, 0);
  const shipping = 15000 * productos.length;
  const total = subtotal + shipping;

  return (
    <Card className="w-full max-w-7xl mx-auto mt-12 mb-12">
      {alertMessage && <Alert message={alertMessage} onClose={() => setAlertMessage(null)} />}
      <CardHeader>
        <CardTitle className="text-3xl font-bold flex items-center gap-2">
          <ShoppingCart className="w-8 h-8" />
          Resumen de Compra
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Imagen</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Precio Unitario</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productos.map((producto, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Image
                        src={producto.FotoProductoURL}
                        alt={producto.NombreProducto}
                        width={80}
                        height={80}
                        className="rounded-md"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{producto.NombreProducto}</TableCell>
                    <TableCell>{producto.cantidad}</TableCell>
                    <TableCell>{formatPrice(producto.PrecioProducto)}</TableCell>
                    <TableCell className="font-semibold">
                      {formatPrice(producto.cantidad * Number(producto.PrecioProducto))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1">
                    <Truck className="w-4 h-4" /> Envío:
                  </span>
                  <span className="font-semibold">{formatPrice(shipping)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleConfirmarCompra} className="w-full" size="lg" disabled={isProcessing}>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Confirmar Compra
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
