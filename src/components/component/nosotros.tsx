import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Rocket, Target, Users, Award, Badge, UserCheck } from "lucide-react";

export default function Nosotros() {
  return (
    <div className="min-h-screen bg-white from-gray-800 to-gray-900 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12 text-plattea1">
          Sobre Nosotros
        </h1>

        <Card className="mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-700 to-gray-800 p-6 text-white">
            <Rocket className="w-12 h-12 mb-4" />
            <h2 className="text-2xl font-semibold mb-2 ">¿Qué es Plattea?</h2>
            <p className="text-lg">Tu mercado en línea, siempre a un clic.</p>
          </div>
          <CardContent className="p-6">
            <p className="text-gray-600 mb-6">
              Plattea es una plataforma de e-commerce innovadora que facilita la
              venta de productos para aquellos que buscan una manera accesible y
              eficiente de comercializar sus artículos. Diseñada para ser
              intuitiva y fácil de usar, nuestra tienda virtual permite a los
              usuarios crear y gestionar sus propias tiendas en línea sin
              complicaciones técnicas.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: <Target className="w-8 h-8 text-gray-400" />,
                  title: "Visión",
                  description: "Ser líderes en plataformas de ventas en linea",
                },
                {
                  icon: <Users className="w-8 h-8 text-gray-400" />,
                  title: "Valores",
                  description: "Colaboración, Integridad y Excelencia",
                },
                {
                  icon: <UserCheck className="w-8 h-8 text-gray-400" />,
                  title: "Equipo",
                  description:
                    "Un equipo apasionado y dedicado a la innovación en comercio electrónico",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center"
                >
                  {item.icon}
                  <h3 className="text-lg font-semibold mt-2 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <h2 className="text-2xl font-bold mb-6 text-center text-plattea1">
          Nuestro Equipo
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              name: "Alexix Orostegui",
              role: "Desarrollador Backend y conexion a fronted",
              image: "/Alexix.jpeg",
              skills: ["Liderazgo", "Estrategia", "Innovación"],
            },
            {
              name: "Andres Suarez",
              role: "Desarrollador Backend y base de datos",
              image: "/Andres.jpeg",
              skills: ["Arquitectura", "Cloud", "IA"],
            },
            {
              name: "Carlos Martinez",
              role: "Desarrollador Frontend y redacion de manual",
              image: "/Carlos.jpeg",
              skills: ["UI/UX", "Prototipado", "Investigación"],
            },
            {
              name: "Danner Arias",
              role: "Desarrollador Frontend",
              image: "/Danner.jpeg",
              skills: ["React", "Node.js", "DevOps"],
            },
          ].map((member) => (
            <Card
              key={member.name}
              className="overflow-hidden transition-transform duration-300 hover:scale-105"
            >
              <div className="aspect-square relative">
                <Avatar className="w-full h-full rounded-none">
                  <AvatarImage
                    src={member.image}
                    alt={member.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-4xl">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {member.role}
                </p>
                <div className="flex flex-wrap gap-2">
                  {member.skills.map((skill) => (
                    <Badge key={skill}>{skill}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
