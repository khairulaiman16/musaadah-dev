import AnimatedCounter from './AnimatedCounter';

const TotalBalanceBox = ({
  totalIn, totalOut, currentBalance 
}: { totalIn: number, totalOut: number, currentBalance: number }) => {
  return (
    <section className="flex w-full flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:flex-row md:items-center">
      
      {/* 1. TOTAL PENERIMAAN */}
      <div className="flex flex-1 flex-col gap-1 border-b border-gray-100 pb-4 md:border-b-0 md:border-r md:pb-0 md:pr-6">
        <p className="text-12 font-bold uppercase tracking-wider text-gray-500">
          Jumlah Dana Masuk
        </p>
        <div className="text-20 font-bold text-green-600">
          {/* Removed manual RM here */}
          <AnimatedCounter amount={totalIn} />
        </div>
        <p className="text-11 text-gray-400 italic leading-tight">Kutipan keseluruhan setakat ini</p>
      </div>

      {/* 2. TOTAL AGIHAN */}
      <div className="flex flex-1 flex-col gap-1 border-b border-gray-100 pb-4 md:border-b-0 md:border-r md:pb-0 md:px-6">
        <p className="text-12 font-bold uppercase tracking-wider text-gray-500">
          Agihan Telah Lulus
        </p>
        <div className="text-20 font-bold text-red-600">
          {/* Removed manual RM here */}
          <AnimatedCounter amount={totalOut} />
        </div>
        <p className="text-11 text-gray-400 italic leading-tight">Dana yang telah dikeluarkan</p>
      </div>

      {/* 3. CURRENT BALANCE */}
      <div className="flex flex-1 flex-col gap-1 md:pl-6">
        <p className="text-12 font-bold uppercase tracking-wider text-blue-700">
          Baki Semasa Tabung
        </p>
        <div className="text-24 font-black text-blue-900">
          {/* Removed manual RM here */}
          <AnimatedCounter amount={currentBalance} />
        </div>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="h-2 w-2 rounded-full bg-blue-500" />
          <p className="text-10 font-bold text-blue-500 uppercase tracking-tighter">Dana Aktif</p>
        </div>
      </div>
    </section>
  )
}

export default TotalBalanceBox;