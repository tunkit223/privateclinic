'use client'
import SubmitButton from '@/components/SubmitButton'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import Image from 'next/image';
import { Button } from '@/components/ui/button';
const patientHomePage = () => {
  const router = useRouter();
  const [isLoading, setisLoading] = useState(false);

  async function handleClick  () {
    setisLoading(true);
    try { 
     router.push(`/patient/register`);
    } catch (error) {
      console.log(error);
    } 
    setisLoading(false);
  }

  return (
    <div>
       <section className="remove-scrollbar container">
        <div className="sub-container max-w-[1300px] flex-1 flex-col py-10">
          <Image
            src = "/assets/icons/logo-full.svg"
            height = {1000}
            width = {1000}
            alt = "patinent"
            className="mb-12 h-10 w-fit"
          />
          <h1 className="header pb-10">Welcome👋</h1>
          <Button  
            onClick={handleClick}
            className=' bg-green-500 text-white max-w-[600px] mx-auto flex justify-center'
          >
            Schedule your appointmnet
          </Button>
        

          <p className="copy-right py-10">
               © 2025 CarePulse
          </p>      
        </div>
      </section>  
    </div>
  )
}

export default patientHomePage