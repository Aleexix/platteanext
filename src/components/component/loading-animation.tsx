'use client'

import { useState, useEffect } from 'react'

export function LoadingAnimation() {
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prevRotation) => (prevRotation + 10) % 720)
    }, 50)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div
        className="w-32 h-32 transition-transform duration-300 ease-linear"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          width="100%"
          height="100%"
          viewBox="0 0 375 374.999991"
          preserveAspectRatio="xMidYMid meet"
          version="1.0"
        >
          <defs>
            <clipPath id="b21ddd5b3f">
              <path d="M 146 204 L 172 204 L 172 298.1875 L 146 298.1875 Z M 146 204 " clipRule="nonzero" />
            </clipPath>
            <clipPath id="56fe638cd2">
              <path
                d="M 87.855469 76.9375 L 287.355469 76.9375 L 287.355469 229 L 87.855469 229 Z M 87.855469 76.9375 "
                clipRule="nonzero"
              />
            </clipPath>
          </defs>
          <g clipPath="url(#b21ddd5b3f)">
            <path
              fill="#1C2833" // Cambiado a plattea1
              d="M 146.160156 298.03125 L 171.722656 298.03125 L 171.722656 225.054688 C 162.449219 219.5 153.875 212.402344 146.160156 204.746094 Z M 146.160156 298.03125 "
              fillOpacity="1"
              fillRule="nonzero"
            />
          </g>
          <g clipPath="url(#56fe638cd2)">
            <path
              fill="#1C2833" // Cambiado a plattea1
              d="M 211.917969 79.765625 L 146.160156 79.765625 L 146.160156 138.328125 C 152.976562 149.121094 161.871094 161.652344 171.722656 172.289062 L 171.722656 105.789062 L 212.460938 105.789062 C 239.34375 105.789062 261.128906 127.574219 261.128906 154.457031 C 261.128906 161.394531 259.648438 167.851562 257.03125 173.667969 C 249.238281 191.015625 230.746094 202.527344 211.898438 203.128906 C 197.367188 203.589844 184.617188 194.832031 174.324219 185.398438 C 158.613281 170.96875 145.878906 153.519531 135.285156 135.089844 C 133.988281 132.851562 118.757812 105.46875 115.71875 100.273438 L 121.953125 96.675781 L 104.925781 86.820312 L 87.894531 76.964844 L 87.855469 116.300781 L 93.871094 112.84375 C 114.960938 150.882812 135.828125 194.875 174.683594 217.917969 C 179.71875 220.917969 185.035156 223.4375 190.59375 225.296875 C 210.941406 232.152344 232.804688 228.414062 250.996094 217.421875 C 258.890625 212.664062 265.925781 206.507812 271.621094 199.25 C 281.316406 186.898438 287.132812 171.527344 287.113281 154.398438 C 287.09375 113.085938 253.234375 79.765625 211.917969 79.765625 Z M 211.917969 79.765625 "
              fillOpacity="1"
              fillRule="nonzero"
            />
          </g>
        </svg>
      </div>
    </div>
  )
}
