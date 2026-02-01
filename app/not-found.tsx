import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileQuestion } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 text-center">
      <div className="bg-white p-12 rounded-2xl border border-gray-200 shadow-sm max-w-md w-full flex flex-col items-center gap-6">
        {/* Icon matches your clean UI */}
        <div className="p-4 bg-blue-50 rounded-full">
          <FileQuestion size={48} className="text-blue-600" />
        </div>

        <div className="space-y-2">
          <h1 className="text-36 font-bold text-gray-900 tracking-tight">404</h1>
          <h2 className="text-20 font-semibold text-gray-700">Halaman Tidak Dijumpai</h2>
          <p className="text-14 text-gray-500 font-normal">
            Maaf, halaman yang anda cari tidak wujud atau telah dialihkan.
          </p>
        </div>

        <Link href="/" className="w-full">
          <Button className="form-btn w-full">
            Kembali ke Dashboard
          </Button>
        </Link>
      </div>
    </div>
  )
}