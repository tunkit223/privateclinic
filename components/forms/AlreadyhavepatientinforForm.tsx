"use client"
import React, { useState } from 'react'
import CustomFormField from '../CustomFormField'
import { FormFieldType } from './PatientForm'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import { checkPatientByEmail } from '@/lib/actions/patient.actions'


const AlreadyhavepatientinforForm = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const patient = await checkPatientByEmail(email)
      if (patient) {
        router.push(`/patient/register?patientId=${patient._id}`)
      } else {
        setError('Không tìm thấy bệnh nhân với email này.')
      }
    } catch (err) {
      console.error(err)
      setError('Đã có lỗi xảy ra.')
    } finally {
      setLoading(false)
    }
  }
  return (
      <form onSubmit={handleSubmit} className="space-y-4 w-full mx-auto mt-6">
      <p className="font-semibold text-lg">Please enter your email</p>
      <Input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Button type="submit" disabled={loading || !email} className='bg-blue-300 cursor-pointer hover:bg-blue-400'>
        {loading ? 'Checking...' : 'Continue'}
      </Button>
    </form>
  )
}

export default AlreadyhavepatientinforForm