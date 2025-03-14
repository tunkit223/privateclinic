'use client'
import { sidebarLinks } from '@/constants'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'


const NavLinks = ({accountId}:{accountId:string}) => {
  const pathname = usePathname();
  return <>
    {sidebarLinks.map((item)=>{
      const isActive = (pathname.includes(item.route)
                        &&item.route.length>1)
                        ||pathname===item.route;

      const LinkComponent =(
        <Link href={`/${accountId}`+item.route} key={item.label} className={cn(
          isActive
          ? 'bg-green-700 rounded-lg text-light-200'
          : 'text-dark-600'
          ,'flex justify-start items-center gap-4 p-4')}>
          <Image src={item.imgURL} alt={item.label} 
                 width={20} height={20}
                 className={cn({'invert-color': !isActive})}
          />
          <p className='max-lg:hidden'>{item.label}</p>
        </Link>
      )
      return <React.Fragment key={item.route}>{LinkComponent}</React.Fragment>;
    })}
  </>

}

export default NavLinks