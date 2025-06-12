import clsx from 'clsx'
import Image from 'next/image'
import React from 'react'
import {StatusIcon} from '@/constants'
const StatusBadge = ({status}:{status: Status}) => {
  return (
    <div className={clsx('status-badge',{
      'bg-green-600': status === 'confirmed',
      'bg-blue-600': status === 'pending',
      'bg-red-600': status === 'cancelled',
      'bg-emerald-600': status === 'imported',
      'bg-yellow-500': status === 'importing',
    })}>
      <Image
        src={StatusIcon[status]}
        alt={status}
        height={24}
        width={24}    
        className='h-fit w-3'
      />
      <p className={clsx('text-12-semibold capitalize',{
        'text-green-500': status==='confirmed',
        'text-blue-500': status==='pending',
        'text-red-500': status==='cancelled',
      })}>{status}</p>
    </div>

  )
}

export default StatusBadge