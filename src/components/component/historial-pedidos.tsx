"use client"

import { useEffect, useState } from "react";
import { Card, CardHeader, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { jwtDecode } from "jwt-decode";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, Package, Truck, CheckCircle, Info } from "lucide-react";

interface Pedido {
  IdPedido: number;
  NumeroPedido: string; // Número del pedido
  Direccion: string;
  FechaPedido: string; 
  EstadoPedido: string; 
  Total: string; 
  articulos?: string; // Cambiado a string para reflejar el resultado de GROUP_CONCAT
}

interface DecodedToken {
  IdPersona: string;
}

export default function HistorialPedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<Pedido | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("No hay token disponible.");
        }

        const decoded: DecodedToken = jwtDecode(token);
        const idPersona = decoded.IdPersona;

        const response = await fetch(`http://localhost:4000/api/pedidopersona/${idPersona}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener los pedidos");
        }

        const data: Pedido[] = await response.json();
        setPedidos(data);
      } catch (error) {
        console.error("Error en fetchPedidos:", error);
        setError("Error al cargar los pedidos");
      }
    };

    fetchPedidos();
  }, []);

  if (error) return <p>Error: {error}</p>;

  const formatPrice = (precio: string) => {
    const numero = Number(precio);
    return new Intl.NumberFormat('es-ES').format(numero);
  };

  const getIconoEstado = (estado: string) => {
    switch (estado) {
      case "Enviado":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "En Proceso":
        return <Truck className="h-5 w-5 text-blue-500" />;
      case "Pendiente":
        return <Package className="h-5 w-5 text-yellow-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="w-full h-full">
      <Card className="h-full mt-8 mb-8 mx-auto w-full max-w-7xl" >
        <CardHeader className="px-7 md:px-10">
          <h1 className="text-2xl font-bold mb-4">Historial de Pedidos</h1>
          <CardDescription>
            Todos tus pedidos realizados.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-full">
          <Table className="h-full w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Número de Pedido</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pedidos.map((pedido) => (
                <TableRow key={pedido.IdPedido} className="cursor-pointer">
                  <TableCell>{pedido.NumeroPedido}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      {new Date(pedido.FechaPedido).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {getIconoEstado(pedido.EstadoPedido)}
                      <span className="ml-2">{pedido.EstadoPedido}</span>
                    </div>
                  </TableCell>
                  <TableCell>${formatPrice(parseFloat(pedido.Total).toFixed(2))}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setPedidoSeleccionado(pedido)}>
                          Ver Detalles
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Detalles del Pedido {pedidoSeleccionado?.NumeroPedido}</DialogTitle>
                          <DialogDescription>
                            Información detallada sobre el pedido seleccionado.
                          </DialogDescription>
                        </DialogHeader>
                        {pedidoSeleccionado && (
                          <div className="mt-4">
                            <p><strong>Fecha:</strong> {pedidoSeleccionado.FechaPedido}</p>
                            <p><strong>Estado:</strong> {pedidoSeleccionado.EstadoPedido}</p>
                            <p><strong>Total:</strong> {pedidoSeleccionado.Total}</p>
                            <p><strong>Dirección:</strong> {pedidoSeleccionado.Direccion}</p>
                            <p><strong>Artículos:</strong></p>
                            {pedidoSeleccionado.articulos ? (
                              pedidoSeleccionado.articulos.split(', ').map((articulo) => (
                                <p key={articulo}>
                                  {articulo}
                                </p>
                              ))
                            ) : (
                              <p>No hay artículos</p>
                            )}
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 