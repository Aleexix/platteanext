"use client";
import NextCrypto from 'next-crypto'
import * as React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useParams, useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Tipos
type Pedido = {
  IdPedido: number;
  Nombre: string;
  CorreoPersona: string;
  TelefonoPersona: string;
  Direccion: string;
  Cantidad: string;
  FechaPedido: string;
};

type ProductoPedido = {
  IdProducto: number;
  NombreProducto: string;
  Cantidad: number;
  Total: number;
};

export function HistorialComprasButtonComponent() {
  const params = useParams();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [selectedComprador, setSelectedComprador] = React.useState<Pedido | null>(null);
  const [pedidos, setPedidos] = React.useState<Pedido[]>([]);
  const [productosPedidos, setProductosPedidos] = React.useState<ProductoPedido[]>([]);
  const encryptedIdTienda = params.IdTienda as string;
  const crypto = new NextCrypto('secret key');
  // Cambiar el idTienda según el valor real que necesites
  const idTienda = 32;

  // Obtener pedidos de la API
  React.useEffect(() => {
    async function fetchPedidos() {
      try {
        const safeIdTienda = encryptedIdTienda.replace(/_/g, '/').replace(/-/g, '+');
        const decryptedId = await crypto.decrypt(decodeURIComponent(safeIdTienda));
        const pedidosResponse = await fetch(
          `http://localhost:4000/api/tienda/pedidos/${decryptedId}`
        );
        const pedidosData = await pedidosResponse.json();
        setPedidos(pedidosData);
      } catch (error) {
        console.error("Error al cargar los datos de pedidos:", error);
      }
    }

    fetchPedidos();
  }, [idTienda]);

  // Obtener productos de la API cuando se selecciona un comprador
  React.useEffect(() => {
    async function fetchProductos() {
      if (selectedComprador) {
        try {
          const safeIdTienda = encryptedIdTienda.replace(/_/g, '/').replace(/-/g, '+');
          const decryptedId = await crypto.decrypt(decodeURIComponent(safeIdTienda));
          const productosResponse = await fetch(

           `http://localhost:4000/api/tienda/pedidos/productos/${decryptedId}/${selectedComprador.IdPedido}`
          );
          const productosData = await productosResponse.json();
          setProductosPedidos(productosData);
        } catch (error) {
          console.error("Error al cargar los datos de productos:", error);
        }
      }
    }

    fetchProductos();
  }, [selectedComprador]);

  const handleCompradorSelect = (comprador: Pedido) => {
    setSelectedComprador(comprador);
  };

  const handleCloseModal = () => {
    setSelectedComprador(null);
  };

  return (
    <>
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button variant="outline">Historial de Compras</Button>
        </SheetTrigger>
        <SheetContent side="right" className="p-0 w-[300px]">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Compradores</h2>
            </div>
            <ScrollArea className="flex-1">
              <ul className="divide-y divide-gray-200">
                {pedidos.map((pedido) => (
                  <li
                    key={pedido.IdPedido}
                    className="p-4 hover:bg-gray-100 cursor-pointer transition-colors"
                    onClick={() => handleCompradorSelect(pedido)}
                  >
                    <div className="flex justify-between">
                      <div className="text-sm font-medium text-gray-900">
                        {pedido.Nombre}
                      </div>
                      <div className="text-sm text-gray-500">
                        {pedido.FechaPedido}
                      </div>
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      {pedido.Direccion}
                    </div>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>

      <Dialog
        open={selectedComprador !== null}
        onOpenChange={handleCloseModal}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalles de Compra</DialogTitle>
          </DialogHeader>
          {selectedComprador && (
            <div className="mt-4">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Datos del Comprador
                  </h3>
                  <p>
                    <strong>Nombre:</strong> {selectedComprador.Nombre}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedComprador.CorreoPersona}
                  </p>
                  <p>
                    <strong>Teléfono:</strong> {selectedComprador.TelefonoPersona}
                  </p>
                  <p>
                    <strong>Dirección:</strong> {selectedComprador.Direccion}
                  </p>
                  <p>
                    <strong>Fecha de Compra:</strong> {selectedComprador.FechaPedido}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Resumen de Compra
                  </h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Producto</TableHead>
                        <TableHead className="text-right">Cantidad</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {productosPedidos.map((producto) => (
                        <TableRow key={producto.IdProducto}>
                          <TableCell>{producto.NombreProducto}</TableCell>
                          <TableCell className="text-right">
                            {producto.Cantidad}
                          </TableCell>
                          <TableCell className="text-right">
                            ${producto.Total.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="mt-4 text-right font-semibold">
                    Total: $
                    {productosPedidos
                      .reduce((sum, producto) => sum + producto.Total, 0)
                      .toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
