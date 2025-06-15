import React from 'react'
import { Button } from './ui/button'
import Image from 'next/image'


interface ButtonProps{
  isLoading: boolean,
  className?: string,
  disabled?: boolean,
  children: React.ReactNode,
}

const SubmitButton = ({isLoading, disabled = false, className, children}:ButtonProps) => {
  return (
    <Button type='submit' disabled={isLoading|| disabled} className={className ?? 
    'shad-primary-btn w-full text-1xl pt-2' } >
        {isLoading?(
          <div className='flex items-center gap-4'>
              <Image
                  src='/assets/icons/loader.svg'
                  alt='loader'
                  width={24}
                  height={24}
                  className='animate-spin'
              />
              Loading ...
          </div>
        ):children}
    </Button>
  )
}

export default SubmitButton