import React from 'react'

interface WarningProps {
    message: string;
}
const Warning: React.FC<WarningProps> = ({ message }) => {
    return (
        <div className="absolute top-4 start-1/2 -translate-x-1/2 max-w-xs bg-white border border-gray-200 rounded-xl shadow-lg" role="alert" tabIndex={-1} aria-labelledby="hs-toast-warning-example-label">
            <div className="flex p-4">
                <div className="shrink-0">
                    <svg className="shrink-0 size-4 text-yellow-500 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"></path>
                    </svg>
                </div>
                <div className="ms-3">
                    <p id="hs-toast-warning-example-label" className="text-sm text-gray-700 dark:text-neutral-400">
                       {message}
                    </p>
                </div>
            </div>
        </div>
    )
}


export default Warning
