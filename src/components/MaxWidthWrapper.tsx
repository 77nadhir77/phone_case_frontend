import React from 'react'


interface maxWidthWrapperProps {
    children: React.ReactNode,
    className?: string,
}

const MaxWidthWrapper = ({children, className}:maxWidthWrapperProps) => {
  return (
    <div className={`${className} h-full mx-auto w-full max-w-screen-2xl px-2.5 md:px-20`}>
        {children}
    </div>
  )
}

export default MaxWidthWrapper