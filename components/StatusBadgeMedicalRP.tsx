import clsx from 'clsx'
import Image from 'next/image'
import React from 'react'
import {MedicalStatusIcon} from '@/constants'
const StatusBadgeMedical = ({status}:{status: MedicalStatus}) => {
  return (
   <div className={clsx('status-badge',{
        'bg-green-600': status === 'examined',
        'bg-blue-600': status === 'examining',
        'bg-red-600': status === 'unexamined',
      })}>
        <Image
          src={MedicalStatusIcon[status]}
          alt={status}
          height={24}
          width={24}    
          className='h-fit w-3'
        />
        <p className={clsx('text-12-semibold capitalize',{
          'text-green-500': status==='examined',
          'text-blue-500': status==='examining',
          'text-red-500': status==='unexamined',
        })}>{status}</p>
      </div>

  )
}

export default StatusBadgeMedical