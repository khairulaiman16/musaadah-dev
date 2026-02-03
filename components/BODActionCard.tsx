'use client'

import { useState } from "react"
import { Button } from "./ui/button"
import { ChevronRight, Users, AlertCircle } from "lucide-react"
import ConsensusProgress from "./ConsensusProgress"
import BODApprovalModal from "./BODApprovalModal"
import { cn } from "@/lib/utils"

export default function BODActionCard({ item, userId }: { item: any, userId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  // Add local state to track approvals instantly
  const [localApprovals, setLocalApprovals] = useState<string[]>(item.approvals || []);
  const [localRejections, setLocalRejections] = useState<string[]>(item.rejections || []);
  const [localStatus, setLocalStatus] = useState(item.status);

  const approvedCount = localApprovals.length;
  const rejectedCount = localRejections.length;

  const isKIV = localStatus === 'kiv';

  return (
    <>
      <div 
        onClick={() => setIsOpen(true)}
        className="group relative flex flex-col md:flex-row items-center gap-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer"
      >
        {/* Status indicator for KIV */}
        {/* {isKIV && (
          <div className="absolute -top-2 left-6 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
            <AlertCircle size={10} />
            DALAM SEMAKAN (KIV)
          </div>
        )} */}

        {/* Basic Info */}
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-bold uppercase">
              {item.kategoriPenerima}
            </span>
            <span className="text-12 text-gray-400 font-mono">#{item.$id.slice(-6).toUpperCase()}</span>
          </div>
          <h4 className="text-18 font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            {item.penerima}
          </h4>
          <p className="text-14 text-gray-500 line-clamp-1">{item.tujuan}</p>
        </div>

        {/* Amount & Progress */}
        <div className="flex flex-col items-end gap-3 min-w-[200px]">
          <span className="text-20 font-black text-blue-900">
            RM {Number(item.jumlah).toLocaleString('en-MY', { minimumFractionDigits: 2 })}
          </span>
          <ConsensusProgress 
            approvedCount={approvedCount} 
            rejectedCount={rejectedCount}
          />
          
        </div>

        <div className="pl-4 border-l border-gray-50 hidden md:block">
          <ChevronRight className="text-gray-300 group-hover:text-blue-500 transition-colors" size={24} />
        </div>
      </div>

      <BODApprovalModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        item={{...item, approvals: localApprovals, rejections: localRejections, status: localStatus}} 
        userId={userId}
        onApproveSuccess={(newApprovals: string[]) => setLocalApprovals(newApprovals)}
        onRejectSuccess={(newStatus: string) => {
          setLocalStatus(newStatus);
          setLocalRejections([...localRejections, userId]);
        }}
      />
    </>
  )
}