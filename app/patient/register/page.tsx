// Trang này được gọi ngay sau khi đã tạo user và
// có userid

import React from 'react'
import Image from 'next/image'
import RegisterForm from '@/components/forms/RegisterForm'

const Register =  () => {
  return (
    <div className="flex h-screen max-h-screen bg-blue-100">
      {/* TODO: OTP Verification | PasskeyModal <>?*/}

      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[780px] flex-1 flex-col py-10">
          <Image
            src = "/assets/icons/logo-full.svg"
            height = {1000}
            width = {1000}
            alt = "patinent"
            className="mb-12 h-10 w-fit"
          />

          <RegisterForm />

          <p className="copy-right py-10">
               © 2025 CarePulse
          </p>      
        </div>
      </section>

    </div>
  )
}

export default Register