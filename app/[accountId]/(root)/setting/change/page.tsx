'use client'
import ChangePassWord from '@/components/forms/ChangePassWordForm'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createSetting, getLatestSetting } from '@/lib/actions/setting.action'
import { getUserByAccountId } from '@/lib/actions/user.action'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const change = () => {
   const [maxPatients, setMaxPatients] = useState<number>(40)
    const [examFee, setExamFee] = useState<number>(30000)
    const [diseaseTypes, setDiseaseTypes] = useState<string[]>([]);
    const [newDisease, setNewDisease] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [isadmin, setIsAdmin] = useState(false);
      const params = useParams();
        const fetchUserRole = async () => {
        try {
          const user = await getUserByAccountId(params?.accountId as string);
          if (user?.role === "admin") {
            setIsAdmin(true);
          }
        } catch (err) {
          console.error("Lỗi khi fetch user:", err);
        }}
     useEffect(() => {
        async function fetchChange() {
          const latestSetting = await getLatestSetting();
          if (latestSetting) {
            setMaxPatients(latestSetting.MaxPatientperDay || 40);
            setExamFee(latestSetting.ExamineFee || 30000);
            setDiseaseTypes(latestSetting.DiseaseType || []);
            setEmail(latestSetting.Email || '');
            setPhone(latestSetting.Phone || '');
            setAddress(latestSetting.Address || '');
          }
        }
        fetchChange()
        fetchUserRole()
      }, [])
      const handleAddDisease = () => {
      if (newDisease.trim() && !diseaseTypes.includes(newDisease.trim())) {
        setDiseaseTypes([...diseaseTypes, newDisease.trim()]);
        setNewDisease('');
      }
    };

    const handleRemoveDisease = (disease: string) => {
      setDiseaseTypes(diseaseTypes.filter(d => d !== disease));
    };

      const handleSaveSetting = async () => {
    const res = await createSetting({
      MaxPatientperDay: maxPatients,
      ExamineFee: examFee,
      DiseaseType: diseaseTypes,
      Email: email,
      Phone: phone,
      Address: address
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
    <div className="w-[80%] ml-32 bg-blue-200 p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Change</h2>
        <div className="space-y-4">
          <p className='text-18-bold'>Max patients per day</p>
          <Input
            type="number"
            placeholder="Số bệnh nhân tối đa / ngày"
            value={maxPatients}
            onChange={(e) => setMaxPatients(Number(e.target.value))}
            className='p-5 '
          />
          <p className='text-18-bold'>Examfee</p>
          <Input
            type="number"
            placeholder="Tiền khám"
            value={examFee}
            onChange={(e) => setExamFee(Number(e.target.value))}
            className='p-5 '
          />
          <p className='text-18-bold mt-4'>Disease Types</p>
          <div className="flex gap-2">
            <Input
              value={newDisease}
              onChange={(e) => setNewDisease(e.target.value)}
              placeholder="Add new disease type"
              className="p-3 flex-grow"
            />
            <Button onClick={handleAddDisease} className="bg-blue-400 hover:bg-blue-300">Add</Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {diseaseTypes.map((disease, index) => (
              <div key={index} className="bg-white text-black px-3 py-1 rounded-full flex items-center gap-2 shadow">
                <span>{disease}</span>
                <button onClick={() => handleRemoveDisease(disease)} className="text-red-500 hover:text-red-700">✕</button>
              </div>
            ))}
          </div>
          <p className='text-18-bold'>Email</p>
          <Input
            type="string"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='p-5 '
          />
          <p className='text-18-bold'>Phone</p>
          <Input
            type="string"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className='p-5 '
          />
          <p className='text-18-bold'>Address</p>
          <Input
            type="string"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className='p-5 '
          />
          <Button onClick={handleSaveSetting} disabled={!isadmin} className='mt-5 p-5 w-full text-[24px] font-bold bg-blue-400 hover:bg-blue-300'>Save</Button>
          
        </div>
      </div>
  )
}

export default change