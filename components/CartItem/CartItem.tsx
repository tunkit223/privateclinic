import React from 'react'
import { BsThreeDots } from "react-icons/bs";
import "./Cart.scss"
import Link from 'next/link';


interface Props {
  count: number
  title: string
  desc: React.ReactNode
  href: string
}
const CartItem = ({ count = 0, title, desc, href }: Props) => {
  return (
    <div className='cart'>
      <div className='cart__title'>
        <div className='cart__title--text'>{title}</div>
        <Link href={href} className='cart__title--icon'><BsThreeDots /></Link>
      </div>
      <div className='cart__content'>
        <h1 className='cart__content--count'>{count}</h1>
        <div className='cart__content--desc'>{desc}</div>
      </div>
    </div>
  )
}
export default CartItem;