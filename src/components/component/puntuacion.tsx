"use client"

import { JSX, SetStateAction, SVGProps, useState } from "react"
import { Card, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export function Puntuacion() {
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState("")
  const handleRatingChange = (newRating: SetStateAction<number>) => {
    setRating(newRating)
  }
  const handleReviewChange = (event: { target: { value: SetStateAction<string> } }) => {
    setReview(event.target.value)
  }
  return (
    <div className="w-full">
      <Card className="w-full p-6">
        <div className="grid gap-4 sm:gap-6">
          <div className="grid gap-2">
            <CardTitle className="text-2xl font-bold">Reseña del producto</CardTitle>
            <CardDescription className="text-muted-foreground">
              Comparte tus pensamientos sobre este producto.
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className={`
                  p-2 rounded-full transition-colors
                  ${
                    star <= rating
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }
                `}
                onClick={() => handleRatingChange(star)}
              >
                <StarIcon className="w-6 h-6" />
              </button>
            ))}
            {rating > 0 && <span className="text-2xl font-bold">{rating} / 5</span>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="review">Tu reseña</Label>
            <Textarea
              id="review"
              placeholder="Describe tu experiencia con el producto..."
              value={review}
              onChange={handleReviewChange}
              className="min-h-[100px] resize-none"
            />
          </div>
          <div className="flex justify-end">
            <Button>Enviar</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

function StarIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}
