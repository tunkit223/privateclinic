'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { IUser } from '@/database/user.model'
import { useParams } from 'next/navigation'
import { getUserByAccountId, updateUser } from '@/lib/actions/user.action'
import { UploadDropzone } from '@/lib/uploadthing'
import '@uploadthing/react/styles.css'
import toast from 'react-hot-toast'
import { createSetting, getLatestSetting } from '@/lib/actions/setting.action'
import ForgetPasswordForm from '@/components/forms/ForgetPasswordForm'
import ChangePassWord from '@/components/forms/ChangePassWordForm'
import ImageUploader from '@/components/forms/ImageUploader'

const setting = () => {
  const params = useParams()
  const accountId = params?.accountId as string

  const [user, setUser] = useState<IUser | null>(null)
  const [maxPatients, setMaxPatients] = useState<number>(40)
  const [examFee, setExamFee] = useState<number>(30000)
  

  useEffect(() => {
    async function fetchUser() {
      const userData = await getUserByAccountId(accountId)
      setUser(userData)
      const latestSetting = await getLatestSetting();
      if (latestSetting) {
      setMaxPatients(latestSetting.MaxPatientperDay || 40);
      setExamFee(latestSetting.ExamineFee || 30000);
    }
    }
    fetchUser()
  }, [])
   const handleImageUploadComplete = (url: string) => {
    if (!user) return
    setUser({ ...user, image: url }) // cập nhật url ảnh vào user state
  }
  const handleSaveUser = async () => {
    
    if (!user) return
    await updateUser(accountId,user)
    toast.success("Update user information successfully.", {
      position: "top-left",
      duration: 3000,
    });
  }

  const handleSaveSetting = async () => {
  const res = await createSetting({
    MaxPatientperDay: maxPatients,
    ExamineFee: examFee,
  });

  if (res.success) {
    toast.success("Save setting successfully!", {
      position: "top-left",
      duration: 3000,
    });
  } else {
    toast.error("Cannot save setting!", {
      position: "top-left",
      duration: 3000,
    });
  }
};



  return (
    <div className="flex p-6 gap-6">
      {/* Left: User Info */}
      <div className="w-1/2  p-6 rounded shadow bg-blue-200">
        <h2 className="text-2xl font-bold mb-4">Thông tin cá nhân</h2>

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
            <ImageUploader  onUploadComplete={handleImageUploadComplete}/>
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
          </div>
        )}
      </div>

      {/* Right: Settings */}
      <div className="w-1/2 bg-blue-200 p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Cài đặt hệ thống</h2>
        <div className="space-y-4"> 
          <p className='text-18-bold'>Số bệnh nhân tối đa trong ngày</p>
          <Input
            type="number"
            placeholder="Số bệnh nhân tối đa / ngày"
            value={maxPatients}
            onChange={(e) => setMaxPatients(Number(e.target.value))}
            className='p-5 '
          />
          <p className='text-18-bold'>Tiền khám</p>
          <Input
            type="number"
            placeholder="Tiền khám"
            value={examFee}
            onChange={(e) => setExamFee(Number(e.target.value))}
            className='p-5 '
          />
          
          <Button onClick={handleSaveSetting} className='mt-5 p-5 w-full text-[24px] font-bold bg-blue-400 hover:bg-blue-300'>Save</Button>
          <div className='pt-20'>
            <ChangePassWord />  
          </div>
        </div>
      </div>
    </div>
  )
}

export default setting
