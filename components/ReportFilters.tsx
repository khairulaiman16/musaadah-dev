'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Button } from './ui/button'
import { Download, Search } from 'lucide-react'

export default function ReportFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`?${params.toString()}`);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-xl border shadow-sm items-end">
      <div className="space-y-2">
        <label className="text-12 font-bold text-gray-500 uppercase">Tarikh Mula</label>
        <Input type="date" onChange={(e) => handleFilter('start', e.target.value)} />
      </div>
      <div className="space-y-2">
        <label className="text-12 font-bold text-gray-500 uppercase">Tarikh Tamat</label>
        <Input type="date" onChange={(e) => handleFilter('end', e.target.value)} />
      </div>
      <div className="space-y-2">
        <label className="text-12 font-bold text-gray-500 uppercase">Kategori</label>
        <Select onValueChange={(v) => handleFilter('kategori', v)}>
          <SelectTrigger>
            <SelectValue placeholder="Semua Kategori" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all">Semua</SelectItem>
            <SelectItem value="Individu">Individu</SelectItem>
            <SelectItem value="Syarikat">Syarikat</SelectItem>
            <SelectItem value="Pendidikan">Pendidikan</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button className="bg-gray-900 text-white gap-2 hover:bg-gray-800">
        <Download size={18} /> Export CSV
      </Button>
    </div>
  )
}