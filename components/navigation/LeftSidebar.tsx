import React from 'react'
import NavLinks from './NavLinks'

const LeftSidebar = () => {
  return (
    <section className='custom-scrollbar bg-dark-400 light-border sticky left-0 top-0 h-screen flex flex-col justify-between overflow-y-auto border-r p-6  pt-10 max-sm:hidden lg:w-[215px]'>
      <div className='flex flex-1 flex-col gap-6'>
          <NavLinks />
      </div>
    </section>
  )
}

export default LeftSidebar