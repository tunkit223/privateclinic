import React from 'react'
import "./Cart.scss"
import Link from 'next/link';


interface Props {
  background: string,
  count: any
  title: string
  desc: React.ReactNode
  href: string
  icon: React.ReactNode
  colorIcon: string
}
const CartItem = ({ count = 0, title, desc, href, icon, background, colorIcon }: Props) => {
  return (
    <div className='cart' style={{ backgroundColor: background }}>
      <div className='cart__title'>
        <div className='cart__title--text'>{title}</div>
        <Link href={href} className='cart__title--icon' style={{
          color: colorIcon
        }}>{icon}</Link>
      </div>
      <div className='cart__content'>
        <h1 className='cart__content--count'>{count}</h1>
        <div className='cart__content--desc'>{desc}</div>
      </div>
    </div>
  )
}
export default CartItem;