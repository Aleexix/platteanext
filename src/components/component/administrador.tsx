"use client";

import { SVGProps, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { PencilIcon, TrashIcon } from "lucide-react";

// Interfaces
interface Profile {
  FotoPersonaURL: string;
  NombrePersona: string;
  ApellidoPersona: string;
  CorreoPersona: string;
  DescripcionPersona: string;
  TelefonoPersona?: string;
  bannerPersonaURL?: string;
  idRolFK: number;
}

interface Tienda {
  IdTienda: string;
  NombreTienda: string;
  DescripcionTienda: string;
  DireccionTienda: string;
  MiniaturaTiendaURL: string;
  CiudadTienda: string;
}

interface Categoria {
  IdCategoria: number;
  NombreCategoria: string;
  FotoCategoria: string;
}

export function Administrador() {
  const [personas, setPersonas] = useState<Profile[]>([]);
  const [tiendas, setTiendas] = useState<Tienda[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPageUser, setCurrentPageUser] = useState(1);
  const [currentPageStore, setCurrentPageStore] = useState(1);
  const [currentPageCategory, setCurrentPageCategory] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Cambiado a estado
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(null);
  const [newCategoria, setNewCategoria] = useState<{ Nombre: string; Foto: File | null }>({ Nombre: "", Foto: null });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const personasResponse = await axios.get("http://localhost:4000/api/persona/");
        setPersonas(personasResponse.data);

        const tiendasResponse = await axios.get("http://localhost:4000/api/tienda/");
        setTiendas(tiendasResponse.data);

        const categoriasResponse = await axios.get("http://localhost:4000/api/categoria/");
        setCategorias(categoriasResponse.data);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }
    };

    fetchData();
  }, []);

  const handleDeleteUser = async (correo: string) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este usuario?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:4000/api/persona/${correo}`);
        setPersonas((prev) => prev.filter((persona) => persona.CorreoPersona !== correo));
      } catch (error) {
        console.error("Error al eliminar el usuario:", error);
      }
    }
  };
  const handleDeleteStore = async (id: string) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta tienda?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:4000/tienda/${id}`);
        setTiendas((prev) => prev.filter((tienda) => tienda.IdTienda !== id));
      } catch (error) {
        console.error("Error al eliminar la tienda:", error);
      }
    }
  };
  const handleDeleteCategoria = async (id: number) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta categoría?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:4000/api/categoria/${id}`);
        setCategorias((prev) => prev.filter((categoria) => categoria.IdCategoria !== id));
      } catch (error) {
        console.error("Error al eliminar la categoría:", error);
      }
    }
  };

  const handleOpenModal = (categoria?: Categoria) => {
    if (categoria) {
      setSelectedCategoria(categoria);
      setNewCategoria({ Nombre: categoria.NombreCategoria, Foto: null });
    } else {
      setSelectedCategoria(null);
      setNewCategoria({ Nombre: "", Foto: null });
    }
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCategoria(null);
    setNewCategoria({ Nombre: "", Foto: null });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewCategoria({ ...newCategoria, Foto: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("NombreCategoria", newCategoria.Nombre);
    if (newCategoria.Foto) {
      formData.append("FotoCategoria", newCategoria.Foto);
    }

    try {
      if (selectedCategoria) {
        // Editar categoría existente
        await axios.put(`http://localhost:4000/api/categoria/${selectedCategoria.IdCategoria}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        // Actualizar la lista de categorías
        setCategorias((prev) =>
          prev.map((categoria) =>
            categoria.IdCategoria === selectedCategoria.IdCategoria
              ? { ...categoria, NombreCategoria: newCategoria.Nombre, FotoCategoria: newCategoria.Foto ? URL.createObjectURL(newCategoria.Foto) : categoria.FotoCategoria }
              : categoria
          )
        );
      } else {
        // Crear nueva categoría
        await axios.post("http://localhost:4000/api/categoria/", formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        // Refrescar la lista de categorías
        const categoriasResponse = await axios.get("http://localhost:4000/api/categoria/");
        setCategorias(categoriasResponse.data);
      }
    } catch (error) {
      console.error("Error al guardar la categoría:", error);
    } finally {
      handleModalClose();
    }
  };

  const truncarTexto = (texto: string, maxLength: number) => {
    return texto.length > maxLength ? texto.substring(0, maxLength) + "..." : texto;
  };

  const filteredPersonas = personas.filter((persona) =>
    `${persona.NombrePersona} ${persona.ApellidoPersona} ${persona.CorreoPersona} ${persona.idRolFK === 2 ? "Administrador" : "Cliente"}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );
  
  const totalPagesUser = Math.ceil(filteredPersonas.length / itemsPerPage);
  const currentPersonas = filteredPersonas.slice((currentPageUser - 1) * itemsPerPage, currentPageUser * itemsPerPage);
  
  const filteredTiendas = tiendas.filter((tienda) =>
    `${tienda.NombreTienda} ${tienda.DireccionTienda} ${tienda.CiudadTienda}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );
  
  const totalPagesStore = Math.ceil(filteredTiendas.length / itemsPerPage);
  const currentTiendas = filteredTiendas.slice((currentPageStore - 1) * itemsPerPage, currentPageStore * itemsPerPage);
  
  const filteredCategorias = categorias.filter((categoria) =>
    categoria.NombreCategoria.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const totalPagesCategory = Math.ceil(filteredCategorias.length / itemsPerPage);
  const currentCategorias = filteredCategorias.slice((currentPageCategory - 1) * itemsPerPage, currentPageCategory * itemsPerPage);
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 items-center justify-center">
      <div className="flex flex-col sm:gap-4 sm:py-4 w-full max-w-6xl">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <div className="relative flex-1">
            <Input
              type="search"
              placeholder="Buscar usuarios o tiendas..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 w-full">
          <Tabs defaultValue="users">
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="users">Usuarios</TabsTrigger>
                <TabsTrigger value="stores">Tiendas</TabsTrigger>
                <TabsTrigger value="category">Categorías</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>Usuarios</CardTitle>
                  <CardDescription>
                    Administra todos los usuarios y su información.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-4">
                    <label className="mr-2">Mostrar:</label>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => setItemsPerPage(Number(e.target.value))}
                      className="border rounded-md p-1"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={15}>15</option>
                      <option value={20}>20</option>
                    </select>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Correo</TableHead>
                        <TableHead>Descripción</TableHead>
                        <TableHead>Teléfono</TableHead>
                        <TableHead>Rol</TableHead>
                        <TableHead>Eliminar</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentPersonas.map((persona) => (
                        <TableRow key={persona.CorreoPersona}>
                          <TableCell className="font-medium">
                            {persona.NombrePersona} {persona.ApellidoPersona}
                          </TableCell>
                          <TableCell>{persona.CorreoPersona}</TableCell>
                          <TableCell>
                            {persona.DescripcionPersona || "NULL"}
                          </TableCell>
                          <TableCell>{persona.TelefonoPersona}</TableCell>
                          <TableCell>
                            {persona.idRolFK === 2 ? "Administrador" : "Cliente"}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              onClick={() => handleDeleteUser(persona.CorreoPersona)}
                            >
                              <TrashIcon className="w-4 h-4" aria-hidden="true" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="flex justify-between mt-4">
                    <Button
                      disabled={currentPageUser === 1}
                      onClick={() => setCurrentPageUser(currentPageUser - 1)}
                    >
                      Anterior
                    </Button>
                    <span>Página {currentPageUser} de {totalPagesUser}</span>
                    <Button
                      disabled={currentPageUser === totalPagesUser}
                      onClick={() => setCurrentPageUser(currentPageUser + 1)}
                    >
                      Siguiente
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
<TabsContent value="stores">
  <Card>
    <CardHeader>
      <CardTitle>Tiendas</CardTitle>
      <CardDescription>
        Administra todas las tiendas y su información.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex items-center mb-4">
        <label className="mr-2">Mostrar:</label>
        <select
          value={itemsPerPage}
          onChange={(e) => setItemsPerPage(Number(e.target.value))}
          className="border rounded-md p-1"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
        </select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Dirección</TableHead>
            <TableHead>Ciudad</TableHead>
            <TableHead>Eliminar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentTiendas.map((tienda) => (
            <TableRow key={tienda.IdTienda}>
              <TableCell className="font-medium">
                {tienda.NombreTienda}
              </TableCell>
              <TableCell>
                {truncarTexto(tienda.DescripcionTienda, 78)}
              </TableCell>
              <TableCell>{tienda.DireccionTienda}</TableCell>
              <TableCell>{tienda.CiudadTienda}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  onClick={() => handleDeleteStore(tienda.IdTienda)} // Conectar el botón de eliminar
                >
                  <TrashIcon className="w-4 h-4" aria-hidden="true" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between mt-4">
        <Button
          disabled={currentPageStore === 1}
          onClick={() => setCurrentPageStore(currentPageStore - 1)}
        >
          Anterior
        </Button>
        <span>Página {currentPageStore} de {totalPagesStore}</span>
        <Button
          disabled={currentPageStore === totalPagesStore}
          onClick={() => setCurrentPageStore(currentPageStore + 1)}
        >
          Siguiente
        </Button>
      </div>
    </CardContent>
  </Card>
</TabsContent>


            <TabsContent value="category">
              <Card>
                <CardHeader>
                  <CardTitle>Categorías</CardTitle>
                  <CardDescription>
                    Administra todas las categorías de las tiendas.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <Button onClick={() => handleOpenModal()}>
                      Agregar Categoría
                    </Button>
                  </div>
                  <div className="flex items-center mb-4">
                    <label className="mr-2">Mostrar:</label>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => setItemsPerPage(Number(e.target.value))}
                      className="border rounded-md p-1"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={15}>15</option>
                      <option value={20}>20</option>
                    </select>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Foto</TableHead>
                        <TableHead>Editar</TableHead>
                        <TableHead>Eliminar</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentCategorias.map((categoria) => (
                        <TableRow key={categoria.IdCategoria}>
                          <TableCell>{categoria.IdCategoria}</TableCell>
                          <TableCell className="font-medium">
                            {categoria.NombreCategoria}
                          </TableCell>
                          <TableCell>
                            <img
                              src={categoria.FotoCategoria}
                              alt={categoria.NombreCategoria}
                              className="h-16 w-16 object-cover"
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              onClick={() => handleOpenModal(categoria)}
                            >
                              <PencilIcon className="w-4 h-4" aria-hidden="true" />
                            </Button>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              onClick={() => handleDeleteCategoria(categoria.IdCategoria)}
                            >
                              <TrashIcon className="w-4 h-4" aria-hidden="true" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="flex justify-between mt-4">
                    <Button
                      disabled={currentPageCategory === 1}
                      onClick={() => setCurrentPageCategory(currentPageCategory - 1)}
                    >
                      Anterior
                    </Button>
                    <span>Página {currentPageCategory} de {totalPagesCategory}</span>
                    <Button
                      disabled={currentPageCategory === totalPagesCategory}
                      onClick={() => setCurrentPageCategory(currentPageCategory + 1)}
                    >
                      Siguiente
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>

        {/* Modal para agregar/editar categoría */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-md shadow-md">
              <h2 className="text-lg font-semibold">
                {selectedCategoria ? "Editar Categoría" : "Agregar Categoría"}
              </h2>
              <form onSubmit={handleSubmit}>
                <Input
                  placeholder="Nombre de la categoría"
                  value={newCategoria.Nombre}
                  onChange={(e) =>
                    setNewCategoria({ ...newCategoria, Nombre: e.target.value })
                  }
                  className="mt-2"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-2"
                />
                <div className="flex justify-end mt-4">
                  <Button type="button" variant="outline" onClick={handleModalClose}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="ml-2">
                    {selectedCategoria ? "Actualizar" : "Agregar"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
