"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { JSX, SVGProps } from "react"

export function FiltroProductos() {
  const categories = ["Ropa", "Calzado", "Accesorios"]
  const priceRanges = [
    [0, 50],
    [50, 100],
    [100, 200],
    [200, 500],
  ]

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Buscar productos..."
          className="w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary"
        />
      </div>
      <div className="mb-6">
        <div className="flex items-center overflow-x-auto pb-4 border-b border-gray-300">
          {categories.map((category) => (
            <Button
              key={category}
              variant="outline"
              className="mr-4 flex items-center"
            >
              <ShoppingBagIcon className="w-5 h-5 mr-2" />
              {category}
            </Button>
          ))}
        </div>
      </div>
      <div className="mb-6">
        <div className="flex items-center overflow-x-auto pb-4 border-b border-gray-300">
          {priceRanges.map(([min, max]) => (
            <Button
              key={`${min}-${max}`}
              variant="outline"
              className="mr-4"
            >
              ${min} - ${max}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

function ShoppingBagIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}
