'use client'

import { QRCodeSVG } from 'qrcode.react'
import { useState, useEffect } from 'react'

export default function QRCodeComponent() {
    const [appUrl, setAppUrl] = useState('')

    useEffect(() => {
        // Replace this with your actual app download URL
        setAppUrl(`https://storage.appilix.com/uploads/app-apk-67fe1f26d2306-1744707366.apk`)
    }, [])

    return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Download</h2>
                <div className="flex justify-center mb-4">
                    <QRCodeSVG value={appUrl} size={200} />
                </div>
                <p className="text-gray-600 text-center mb-4">
                    Scan the QR code above to download our app on your mobile device.
                </p>
                <div className="flex justify-center">
                    <a
                        href={appUrl}
                        className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
                    >
                        Download App
                    </a>
                </div>
            </div>
        </div>
    )
}

