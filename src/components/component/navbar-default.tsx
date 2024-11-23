import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SVGProps } from "react";

export function NavbarDefault() {
  return (
    <header className="bg-plattea1 flex h-20 w-full shrink-0 items-center px-4 md:px-6">
      <Link href="/" className="mr-6 hidden lg:flex" prefetch={false}>
        <CustomLogo className="h-12 w-12 text-plattea2" /> {/* Color normal */}
        <span className="sr-only">Plattea</span>
      </Link>
      <NavigationMenu className="hidden lg:flex">
        <NavigationMenuList>
          <NavigationMenuLink asChild>
            <Link
              href="/"
              className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-plattea1 px-4 py-2 text-sm font-medium text-plattea2 transition-colors hover:bg-plattea2 hover:text-plattea1 focus:bg-plattea2 focus:text-plattea1 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
              prefetch={false}
            >
              Inicio
            </Link>
          </NavigationMenuLink>
          <NavigationMenuLink asChild>
            <Link
              href="/shops"
              className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-plattea1 px-4 py-2 text-sm font-medium text-plattea2 transition-colors hover:bg-plattea2 hover:text-plattea1 focus:bg-plattea2 focus:text-plattea1 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
              prefetch={false}
            >
              Tiendas
            </Link>
          </NavigationMenuLink>
          <NavigationMenuLink asChild>
            <Link
              href="/products"
              className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-plattea1 px-4 py-2 text-sm font-medium text-plattea2 transition-colors hover:bg-plattea2 hover:text-plattea1 focus:bg-plattea2 focus:text-plattea1 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
              prefetch={false}
            >
              Productos
            </Link>
          </NavigationMenuLink>
        </NavigationMenuList>
      </NavigationMenu>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden bg-plattea1 text-plattea2"
          >
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Menu de navegacion</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="bg-plattea2">
          <Link href="/" prefetch={false}>
            <CustomLogo className="h-12 w-12 bg-plattea1" /> {/* Color responsivo */}
            <span className="sr-only">Plattea</span>
          </Link>
          <div className="grid gap-2 py-6">
            <Link
              href="/"
              className="flex w-full items-center py-2 text-lg font-semibold text-plattea1"
              prefetch={false}
            >
              Inicio
            </Link>
            <Link
              href="/shops"
              className="flex w-full items-center py-2 text-lg font-semibold text-plattea1"
              prefetch={false}
            >
              Tiendas
            </Link>
            <Link
              href="/products"
              className="flex w-full items-center py-2 text-lg font-semibold text-plattea1"
              prefetch={false}
            >
              Productos
            </Link>
          </div>
        </SheetContent>
      </Sheet>
      <div className="ml-auto flex gap-2">
        <Link href="/register" prefetch={false}>
          <Button className="bg-plattea2 text-plattea1 transition-colors duration-300 hover:bg-[#1C2833] hover:text-plattea2">
            Registrarse
          </Button>
        </Link>
        <Link href="/login" prefetch={false}>
          <Button className="bg-plattea2 text-plattea1 transition-colors duration-300 hover:bg-[#1C2833] hover:text-plattea2">
            Iniciar sesión
          </Button>
        </Link>
      </div>
    </header>
  );
}

function MenuIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function CustomLogo(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="64"  // Tamaño ajustado
      height="64" // Tamaño ajustado
      viewBox="0 0 375 375"
      preserveAspectRatio="xMidYMid meet"
      version="1.0"
    >
      <defs>
        <clipPath id="b21ddd5b3f">
          <path d="M 146 204 L 172 204 L 172 298.1875 L 146 298.1875 Z M 146 204 " />
        </clipPath>
        <clipPath id="56fe638cd2">
          <path d="M 87.855469 76.9375 L 287.355469 76.9375 L 287.355469 229 L 87.855469 229 Z M 87.855469 76.9375 " />
        </clipPath>
      </defs>
      <g clipPath="url(#b21ddd5b3f)">
        <path fill="#FFFFFF" d="M 146.160156 298.03125 L 171.722656 298.03125 L 171.722656 225.054688 C 162.449219 219.5 153.875 212.402344 146.160156 204.746094 Z M 146.160156 298.03125 " />
      </g>
      <g clipPath="url(#56fe638cd2)">
        <path fill="#FFFFFF" d="M 211.917969 79.765625 L 146.160156 79.765625 L 146.160156 138.328125 C 152.976562 149.121094 161.871094 161.652344 171.722656 172.289062 L 171.722656 105.789062 L 212.460938 105.789062 C 239.34375 105.789062 261.128906 127.574219 261.128906 154.457031 C 261.128906 161.394531 259.648438 167.851562 257.03125 173.667969 C 249.238281 191.015625 230.746094 202.527344 211.898438 203.128906 C 197.367188 203.589844 184.617188 194.832031 174.324219 185.398438 C 158.613281 170.96875 145.878906 153.519531 135.285156 135.089844 C 133.988281 132.851562 118.757812 105.46875 115.71875 100.273438 L 121.953125 96.675781 L 104.925781 86.820312 L 87.894531 76.964844 L 87.855469 116.300781 L 93.871094 112.84375 C 114.960938 150.882812 135.828125 194.875 174.683594 217.917969 C 179.71875 220.917969 185.035156 223.4375 190.59375 225.296875 C 210.941406 232.152344 232.804688 228.414062 250.996094 217.421875 C 258.890625 212.664062 265.925781 206.507812 271.621094 199.25 C 281.316406 186.898438 287.132812 171.527344 287.113281 154.398438 C 287.09375 113.085938 253.234375 79.765625 211.917969 79.765625 Z M 211.917969 79.765625 " />
      </g>
    </svg>
  );
}