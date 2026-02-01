// components/CommitteeList.tsx
import { User, Mail, Phone, Calendar } from 'lucide-react'

export default function CommitteeList({ members }: { members: any[] }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-bold text-gray-900">Senarai Lantikan Aktif</h3>
        <span className="text-11 bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold uppercase tracking-tight">
          Sah Sehingga 2026
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-25 border-b border-gray-100">
              <th className="px-6 py-4 text-12 font-bold text-gray-500 uppercase">Ahli Jawatankuasa</th>
              <th className="px-6 py-4 text-12 font-bold text-gray-500 uppercase">Jawatan</th>
              <th className="px-6 py-4 text-12 font-bold text-gray-500 uppercase">Hubungi</th>
              <th className="px-6 py-4 text-12 font-bold text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {members.length > 0 ? members.map((member) => (
              <tr key={member.$id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                      {member.nama[0]}
                    </div>
                    <div>
                      <p className="text-14 font-bold text-gray-900">{member.nama}</p>
                      <p className="text-11 text-gray-500 font-mono italic">ID: {member.$id.slice(-6).toUpperCase()}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-13 font-medium text-gray-700">{member.jawatan}</span>
                </td>
                <td className="px-6 py-4 text-gray-500">
                   <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-12">
                        <Phone size={12} /> {member.noTel || 'Tiada No'}
                      </div>
                      <div className="flex items-center gap-2 text-12">
                        <Calendar size={12} /> Lantikan: {new Date(member.tarikhLantikan).toLocaleDateString('en-GB')}
                      </div>
                   </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-11 font-bold bg-green-100 text-green-700">
                    Aktif
                  </span>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic text-14">
                  Tiada rekod lantikan ditemui.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}