
import { HTMLAttributes } from 'react'

interface PhoneProps extends HTMLAttributes<HTMLDivElement> {
  imgSrc: string
  dark?: boolean
  className?:string
  bg?: string
}

const Phone = ({ imgSrc, className, dark = false, ...props }: PhoneProps) => {
  return (
    <div className={`${className} relative pointer-events-none z-40 overflow-hidden`} {...props}>
      <img
        src={
          dark
            ? '/phone-template-dark-edges.png'
            : '/phone-template-white-edges.png'
        }
        className='pointer-events-none z-50 select-none'
        alt='phone'
      />

      <div className={`absolute -z-10 inset-0  ${props.bg? 'bg-' + props.bg : null}`}>
        <img
          className='object-cover w-full h-full'
          src={imgSrc}
          alt='overlaying phone'
        />
      </div>
    </div>
  )
}

export default Phone