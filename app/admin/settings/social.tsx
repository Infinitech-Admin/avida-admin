import React from 'react'

const SocialProfiles = () => {
  return (
    <div className='grid grid-cols-1 gap-4'>
        <div className="col-span-2">
                    <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">Facebook</label>
                    <input
                        type="text"
                        id="first-name"
                        className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                        placeholder="Enter your first name"
                    />
                </div>

                <div className="col-span-2">
                    <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">Instagram</label>
                    <input
                        type="text"
                        id="first-name"
                        className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                        placeholder="Enter your first name"
                    />
                </div>

                <div className="col-span-2">
                    <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">Telegram</label>
                    <input
                        type="text"
                        id="first-name"
                        className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                        placeholder="Enter your first name"
                    />
                </div>

                <div className="col-span-2">
                    <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">Viber</label>
                    <input
                        type="text"
                        id="first-name"
                        className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                        placeholder="Enter your first name"
                    />
                </div>

                <div className="col-span-2">
                    <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">Whatsapp</label>
                    <input
                        type="text"
                        id="first-name"
                        className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                        placeholder="Enter your first name"
                    />
                </div>
    </div>
  )
}

export default SocialProfiles