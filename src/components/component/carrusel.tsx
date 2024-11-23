import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import NextCrypto from "next-crypto";
import Link from "next/link";
import { JSX, SVGProps, useEffect, useState } from "react";

export function Carrusel() {
  const crypto = new NextCrypto('secret key');
  const [encryptedStoreId, setEncryptedStoreId] = useState<string>("");
  const [encryptedStoreIdperro, setEncryptedStoreIdperro] = useState<string>("");
  const [encryptedStoreIdsuper, setEncryptedStoreIdsuper] = useState<string>("");
  const [encryptedStoreIdmoda, setEncryptedStoreIdmoda] = useState<string>("");

  useEffect(() => {
    const encryptStoreId = async () => {
      const encryptedId = await crypto.encrypt("29");
      const safeId = encryptedId.replace(/\//g, '_').replace(/\+/g, '-');
      setEncryptedStoreId(safeId);
    };

    encryptStoreId();
  }, []);

  useEffect(() => {
    const encryptStoreIdperro = async () => {
      const encryptedIdperro = await crypto.encrypt("33");
      const safeId = encryptedIdperro.replace(/\//g, '_').replace(/\+/g, '-');
      setEncryptedStoreIdperro(safeId);
    };

    encryptStoreIdperro();
  }, []);

  useEffect(() => {
    const encryptStoreIdsuper = async () => {
      const encryptedIdsuper = await crypto.encrypt("32");
      const safeId = encryptedIdsuper.replace(/\//g, '_').replace(/\+/g, '-');
      setEncryptedStoreIdsuper(safeId);
    };

    encryptStoreIdsuper();
  }, []);

  useEffect(() => {
    const encryptStoreIdmoda = async () => {
      const encryptedIdmoda = await crypto.encrypt("27");
      const safeId = encryptedIdmoda.replace(/\//g, '_').replace(/\+/g, '-');
      setEncryptedStoreIdmoda(safeId);
    };

    encryptStoreIdmoda();
  }, []);

  return (
    <section className="bg-background py-8 md:py-12 lg:py-8">
      <div className="container mx-auto px-4 md:px-6 lg:px-7">
        <div className="relative">
        <Carousel
          className="w-full"
          autoplay={true}
          infinite={true}
          autoplayInterval={5000}
        >
            <CarouselContent>
              <CarouselItem>
                <div className="relative">
                  <video
                    src="/plattea.mp4" // Ruta al video en la carpeta public
                    width={1200}
                    height={350} // Ajusta el height aquí
                    autoPlay
                    loop
                    muted
                    className="h-[350px] w-full object-cover" // Ajusta la clase aquí
                  />
                </div>
              </CarouselItem>
              <CarouselItem>
                <div className="relative">
                  <img
                    src="/bannermuñecos.jpeg"
                    width={1200}
                    height={350} // Ajusta el height aquí
                    alt="Producto 2"
                    className="h-[350px] w-full object-cover" // Ajusta la clase aquí
                  />
                  <Link
                    href={`/shop/${encryptedStoreId}`}
                    className="bg-plattea1 text-plattea2 absolute bottom-4 right-4 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium focus:outline-none"
                    prefetch={false}
                  >
                    Ver más
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </CarouselItem>
              <CarouselItem>
                <div className="relative">
                  <img
                    src="/bannerperro.jpeg"
                    width={1200}
                    height={350} // Ajusta el height aquí
                    alt="Producto 3"
                    className="h-[350px] w-full object-cover" // Ajusta la clase aquí
                  />
                  <Link
                    href={`/shop/${encryptedStoreIdperro}`}
                    className="bg-plattea1 text-plattea2 absolute bottom-4 right-4 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium focus:outline-none"
                    prefetch={false}
                  >
                    Ver más
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </CarouselItem>
              <CarouselItem>
                <div className="relative">
                  <img
                    src="/bannersuper.jpeg"
                    width={1200}
                    height={350} // Ajusta el height aquí
                    alt="Producto 3"
                    className="h-[350px] w-full object-cover" // Ajusta la clase aquí
                  />
                  <Link
                    href={`/shop/${encryptedStoreIdsuper}`}
                    className="bg-plattea1 text-plattea2 absolute bottom-4 right-4 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium focus:outline-none"
                    prefetch={false}
                  >
                    Ver más
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </CarouselItem>
              <CarouselItem>
                <div className="relative">
                  <img
                    src="/bannermoda.jpeg"
                    width={1200}
                    height={350} // Ajusta el height aquí
                    alt="Producto 3"
                    className="h-[350px] w-full object-cover" // Ajusta la clase aquí
                  />
                  <Link
                    href={`/shop/${encryptedStoreIdmoda}`}
                    className="bg-plattea1 text-plattea2 absolute bottom-4 right-4 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium focus:outline-none"
                    prefetch={false}
                  >
                    Ver más
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/50 p-2 text-primary-foreground focus:outline-none">
              <ChevronLeftIcon className="h-6 w-6" />
            </CarouselPrevious>
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/50 p-2 text-primary-foreground focus:outline-none">
              <ChevronRightIcon className="h-6 w-6" />
            </CarouselNext>
            <div className="mt-8 flex justify-center" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}


function ArrowRightIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
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
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function ChevronLeftIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
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
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
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
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
