import React from 'react'
import ListingsTable from './listingstb'

const page = () => {
  
  return (
    <div className="container">
      <h1 className='font-semibold text-3xl uppercase'>Listing</h1>
      <div className="flex flex-col bg-white border border-gray-200 shadow-sm rounded-xl md:p-5 mt-8">
        <ListingsTable />
      </div>
    </div>

  )
}

export default page
