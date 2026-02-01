'use client';

import CountUp from 'react-countup';

const AnimatedCounter = ({ amount }: { amount: number }) => {
  return (
    <div className="w-full">
      <CountUp 
        duration={2}
        decimals={2}
        decimal="."         // Standard Malaysian decimal (point)
        separator=","       // Standard Malaysian thousand separator
        prefix="RM "        // Changed from "$" to "RM "
        end={amount} 
      />
    </div>
  )
}

export default AnimatedCounter