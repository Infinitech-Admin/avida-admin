import QRCodeComponent from './qr-code'

export default function DownloadPage() {
    return (
        <div className="h-screen flex justify-center p-4">
            <div className="max-w-md w-full">
                <QRCodeComponent />
            </div>
        </div>
    )
}

