import React from 'react'
import Image from 'next/image'
import RegisterForm from '@/components/forms/RegisterForm'
import LoginForm from '@/components/forms/LoginForm'
import Link from 'next/link'

const Login = () => {
  return (
    <div className=" pt-20">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[600px] flex-1 flex-col py-10 flex items-start justify-center">
          <LoginForm />
          <section className="space-y-6 pt-10">
            <div className="mb-9 space-y-1 text-green-300">
              <Link href="/forgetPassword">Forget your password</Link>
            </div>
          </section>
        </div>
      </section>
    </div>
  )
}

export default Login