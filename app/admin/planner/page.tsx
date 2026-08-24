import React from 'react'
import PlannerTable from './plannertb'



const page = () => {
  return (
    <div className="container">
      <h1 className='font-semibold text-3xl uppercase'>Room Planner</h1>
      <ol className="flex items-center whitespace-nowrap">
        <li className="inline-flex items-center">
          <a className="flex items-center text-sm text-gray-500 hover:text-blue-600 focus:outline-none focus:text-blue-600 dark:text-neutral-500 dark:hover:text-blue-500 dark:focus:text-blue-500" href="#">
            Home
          </a>
          <svg className="shrink-0 mx-2 size-4 text-gray-400 dark:text-neutral-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6"></path>
          </svg>
        </li>
        <li className="inline-flex items-center">
          <a className="flex items-center text-sm text-gray-500 hover:text-blue-600 focus:outline-none focus:text-blue-600 dark:text-neutral-500 dark:hover:text-blue-500 dark:focus:text-blue-500" href="#">
            App Center
            <svg className="shrink-0 mx-2 size-4 text-gray-400 dark:text-neutral-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"></path>
            </svg>
          </a>
        </li>
        <li className="inline-flex items-center text-sm font-semibold text-black truncate" aria-current="page">
          Items
        </li>
      </ol>
      <div className="flex flex-col bg-white border border-gray-200 shadow-sm rounded-xl md:p-5 mt-8">
        <PlannerTable />
      </div>
    </div>

  )
}

export default page
