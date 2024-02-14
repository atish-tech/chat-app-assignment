import React from 'react'
import logo from "../../Assect/logo.png"
export const Welcome = () => {
  return (
    <div className='welcome-page'>
    <h1 className='font-mono text-6xl text-slate-600'>Welcome!</h1>
      <img className='no-message-img' src={logo} alt='wecome' />
    </div>
  )
}
