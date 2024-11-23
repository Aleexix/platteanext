
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { JSX, SVGProps } from "react"

export function Busqueda() {
  return (
    <div className="flex w-full max-w-md m-8">
      <Input
        type="search"
        placeholder="Buscar..."
        className="flex-1 h-10 px-4 py-2 text-sm rounded-l-md border border-r-0 border-input focus:outline-none focus:ring-1 focus:ring-primary"
      />
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        className="h-10 px-3 rounded-r-md border border-input focus:outline-none focus:ring-1 focus:ring-primary"
      >
        <SearchIcon className="w-5 h-5 text-muted-foreground" />
      </Button>
    </div>
  )
}

function SearchIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}
