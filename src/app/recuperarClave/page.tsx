"use client"

import React from 'react';


import{ RecuperarClave } from '@/components/component/recuperar-clave';


function page() {
  return (
    <div className="flex flex-col min-h-screen">
       <main className="flex-grow">
        <RecuperarClave />
        </main>
    </div>
  )
}

export default page