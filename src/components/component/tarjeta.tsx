"use client";
import Select from 'react-select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import NextCrypto from 'next-crypto';
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PasarelaPagos } from "./pasarela-pagos";

interface Ciudad {
  id: number;
  ciudad: string;
}

interface JWTDecoded {
  IdPersona: number;
}

export function Tarjeta() {
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
  const [address, setAddress] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCVC] = useState("");
  const [encryptedId, setEncryptedId] = useState<string | null>(null);
  const router = useRouter();
  const crypto = new NextCrypto('secret key');

  useEffect(() => {
    const fetchCiudades = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/ciudades");
        setCiudades(response.data);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    fetchCiudades();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar todos los campos
    if (!cardNumber || cardNumber.length < 16) {
      alert("Por favor ingresa un número de tarjeta válido.");
      return;
    }

    if (!expiryDate || expiryDate.length < 5) {
      alert("Por favor ingresa una fecha de vencimiento válida.");
      return;
    }

    if (!cvc || cvc.length < 3) {
      alert("Por favor ingresa un CVC válido.");
      return;
    }

    if (!address) {
      alert("Por favor ingresa una dirección.");
      return;
    }

    if (selectedCityId === null) {
      alert("Por favor selecciona una ciudad.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No se encontró el token");
      }

      const decodedToken: JWTDecoded = jwtDecode(token);
      const IdPersona = decodedToken.IdPersona;

      const response = await axios.post("http://localhost:4000/api/pedido", {
        IdPersonaFK: IdPersona,
        Direccion: address,
        Ciudad: selectedCityId, 
      });

      const tiendaId = response.data.idPedido;
      const encryptedId = await crypto.encrypt(tiendaId.toString());
      const safeEncryptedId = encodeURIComponent(encryptedId.replace(/\//g, '_').replace(/\+/g, '-'));
      setEncryptedId(safeEncryptedId);

      router.push(`/resumendecompra/${safeEncryptedId}`);

    } catch (error) {
      console.error("Error al crear el pedido:", error);
      alert("Hubo un error al crear el pedido. Inténtalo de nuevo.");
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); 
    setCardNumber(value.substring(0, 16)); 
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); 
  
    if (value.length >= 2) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4);
    }
    
    setExpiryDate(value);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, nextFieldId: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const nextField = document.getElementById(nextFieldId);
      if (nextField) {
        nextField.focus(); 
      }
    }
  };
    

  const handleCVCChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); 
    setCVC(value.substring(0, 4)); 
  };

  const cityOptions = ciudades.map(ciudad => ({
    value: ciudad.id,
    label: ciudad.ciudad,
  }));

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-9">
      <div className="flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Agregar Tarjeta de Crédito</CardTitle>
            <CardDescription>Ingresa tu información de pago.</CardDescription>
            <PasarelaPagos />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="card-number">Número de Tarjeta <span className="text-red-500">*</span></Label>
              <Input
                id="card-number"
                placeholder="Ingresa el número de tu tarjeta"
                type="text"
                value={cardNumber}
                onChange={handleCardNumberChange}
                onKeyDown={(e) => handleKeyDown(e, 'expiry-date')}
                maxLength={16}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry-date">Fecha de Vencimiento <span className="text-red-500">*</span></Label>
                <Input
                  id="expiry-date"
                  placeholder="MM/AA"
                  type="text"
                  value={expiryDate}
                  onChange={handleExpiryDateChange}
                  onKeyDown={(e) => handleKeyDown(e, 'cvc')} 
                  maxLength={5}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvc">CVC <span className="text-red-500">*</span></Label>
                <Input
                  id="cvc"
                  placeholder="CVC"
                  type="text"
                  value={cvc}
                  onChange={handleCVCChange}
                  onKeyDown={(e) => handleKeyDown(e, 'city')}
                  maxLength={4}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Ciudad <span className="text-red-500">*</span></Label>
              <Select
                id="city"
                options={cityOptions}
                onChange={(selectedOption) => setSelectedCityId(selectedOption?.value || null)}
                placeholder="Selecciona tu ciudad"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Dirección <span className="text-red-500">*</span></Label>
              <Input
                id="address"
                placeholder="Ingresa tu dirección"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link
              href="/carrito"
              className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              prefetch={false}
            >
              Volver
            </Link>
            <Button
              id="submit-button"
              className="ml-auto"
              onClick={handleSubmit}
            >
              Agregar Tarjeta
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
