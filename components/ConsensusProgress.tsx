import { cn } from "@/lib/utils"

interface ConsensusProgressProps {
  approvedCount: number; // This will be the length of the approvals array
  rejectedCount?: number; // Added for the rejection logic
  className?: string;
}

export default function ConsensusProgress({ approvedCount, rejectedCount = 0, className }: ConsensusProgressProps) {
  // We ensure it never exceeds 10 for the UI segments
  const totalVotes = Math.min(approvedCount + rejectedCount, 10);
  const isFullyApproved = approvedCount >= 10;

  return (
    <div className={cn("flex flex-col gap-2 w-full", className)}>
      <div className="flex justify-between items-end">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
          Status Konsensus BOD
        </p>
        <p className={cn(
          "text-14 font-black",
          isFullyApproved ? "text-green-600" : (rejectedCount > 0 ? "text-orange-600" : "text-blue-600")
        )}>
          {approvedCount + rejectedCount}<span className="text-gray-300 text-12">/10</span>
        </p>
      </div>

      {/* The 10-Segment Progress Bar */}
      <div className="flex gap-1 h-2.5 w-full">
        {[...Array(10)].map((_, i) => {
          // Logic to determine segment color
          let segmentColor = "bg-gray-100";
          if (i < approvedCount) {
            segmentColor = "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]";
          } else if (i < approvedCount + rejectedCount) {
            segmentColor = "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]";
          }

          return (
            <div
              key={i}
              className={cn(
                "flex-1 rounded-sm transition-all duration-500 ease-out",
                segmentColor
              )}
            />
          );
        })}
      </div>

      {!isFullyApproved && (
        <p className="text-[10px] text-gray-400 italic">
          {rejectedCount > 0 
            ? `${rejectedCount} penolakan direkodkan. Masih memerlukan ${10 - approvedCount} kelulusan.`
            : `${10 - approvedCount} lagi kelulusan diperlukan untuk pengesahan automatik.`
          }
        </p>
      )}
    </div>
  )
}