"use client"
import { IUser } from '@/database/user.model'
import { getUserByAccountId, updateUser } from '@/lib/actions/user.action'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Image from 'next/image'
import ImageUploader from '@/components/forms/ImageUploader'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import ChangePassWord from '@/components/forms/ChangePassWordForm'
const profile = () => {
    const params = useParams()
    const accountId = params?.accountId as string
  
    const [user, setUser] = useState<IUser | null>(null)
   useEffect(() => {
    async function fetchUser() {
      const userData = await getUserByAccountId(accountId)
      setUser(userData)
    }
    fetchUser()
  }, [])
  const handleImageUploadComplete = (url: string) => {
    if (!user) return
    setUser({ ...user, image: url }) 
  }
  const handleSaveUser = async () => {

    if (!user) return
    await updateUser(accountId, user)
    toast.success("Update user information successfully.", {
      position: "top-left",
      duration: 3000,
    });
  }
  return (
    <div className="w-[80%] ml-32 p-20 rounded shadow bg-blue-200">
        <h2 className="text-2xl font-bold mb-4">Profile</h2>

        {user && (
          <div className="space-y-4">
            {/* Ảnh đại diện */}
            <p className='text-18-bold'>Avatar</p>
            <div className='flex items-center gap-4 justify-between mb-4'>
              {user.image && (
                <div className="w-[200px] h-[200px] rounded-full overflow-hidden">
                  <Image
                    src={user.image}
                    alt="Avatar"
                    width={200}
                    height={200}
                    className="object-cover w-full h-full"
                  />
                </div>

              )}
              <ImageUploader onUploadComplete={handleImageUploadComplete} />
            </div>
            <p className='text-18-bold'>Name</p>
            <Input
              placeholder="Name"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              className='p-5'
            />
            <p className='text-18-bold'>UserName</p>
            <Input
              placeholder="UserName"
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              className='p-5'
            />
            <p className='text-18-bold'>Role</p>
            <Input
              placeholder="Role"
              value={user.role}
              disabled
              className="py-5"
            />
            <p className='text-18-bold'>Phone</p>
            <Input
              placeholder="Số điện thoại"
              value={user.phone}
              onChange={(e) => setUser({ ...user, phone: Number(e.target.value) })}
              className='p-5 '
            />
            <p className='text-18-bold'>Address</p>
            <Input
              placeholder="Địa chỉ"
              value={user.address || ''}
              onChange={(e) => setUser({ ...user, address: e.target.value })}
              className='p-5'
            />
            <Button onClick={handleSaveUser} className='mt-5 p-5 w-full text-[24px] font-bold bg-blue-400 hover:bg-blue-300'>Save</Button>
            <div className='pt-20'>
            <ChangePassWord />
          </div>
          </div>
        )}
      </div>
  )
}

export default profile