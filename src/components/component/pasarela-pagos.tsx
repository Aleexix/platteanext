/**
* This code was generated by v0 by Vercel.
* @see https://v0.dev/t/q8hef8EL59W
* Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
*/

/** Add fonts into your Next.js project:

import { Inter } from 'next/font/google'

inter({
  subsets: ['latin'],
  display: 'swap',
})

To read more about using these font, please visit the Next.js documentation:
- App Directory: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- Pages Directory: https://nextjs.org/docs/pages/building-your-application/optimizing/fonts
**/
import { Card } from "@/components/ui/card"

export function PasarelaPagos() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-5">
      <Card className="p-2 flex flex-col items-center gap-2 m-2">
        <img
          src="/visa.png"
          alt="Visa"
          width={80}
          height={48}
          style={{ aspectRatio: "80/48", objectFit: "cover" }}
        />
      </Card>
      <Card className="p-2 flex flex-col items-center gap-2 m-2">
        <img
          src="/paypal.png"
          alt="PayPal"
          width={70}
          height={48}
          style={{ aspectRatio: "100/48", objectFit: "cover" }}
        />
      </Card>
      <Card className="p-2 flex flex-col items-center gap-2 m-2">
        <img
          src="/mastercard.png"
          alt="Mastercard"
          width={70}
          height={48}
          style={{ aspectRatio: "70/50", objectFit: "cover" }}
        />
      </Card>
      <Card className="p-2 flex flex-col items-center gap-2 m-2">
        <img
          src="/nequi.png"
          alt="Nequi"
          width={70}
          height={48}
          style={{ aspectRatio: "70/48", objectFit: "cover" }}
        />
      </Card>
    </div>
  )
}
