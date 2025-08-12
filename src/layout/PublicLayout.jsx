import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/public/Header/Header'
import Sidebars from '../components/public/sidebar/Sidebar'

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-white text-black relative">
      
      <Header />
      <div className="flex w-full">
        <Sidebars />
        <Outlet/>
      </div>
    </div>
  )
}

export default PublicLayout
