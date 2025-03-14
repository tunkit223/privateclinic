import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import ForgetPasswordForm from '@/components/forms/ForgetPasswordForm'

const forgetPassword =  () => {
  return (
    <div className=" pt-20">

      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[600px] flex-1 flex-col py-10 flex items-start justify-center">        
          <ForgetPasswordForm /> 
        </div>
      </section>

    </div>
  )
}

export default forgetPassword