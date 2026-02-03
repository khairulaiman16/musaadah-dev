'use client'

import { sidebarLinks } from '@/constants'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Footer from './Footer'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'


const Sidebar = ({ user }: SiderbarProps) => {
  const pathname = usePathname();
  const role = user?.role; // 'urussetia', 'kj', or 'kp'
  
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <section className="sidebar">
      <nav className="flex flex-col gap-2">
        <Link href="/" className="mb-6 cursor-pointer flex items-center gap-2 px-4">
          <Image src="/icons/logo.svg" width={54} height={54} alt="logo" className="size-[24px]" />
          <h1 className="sidebar-logo">Musa'adah</h1>
        </Link>

        {sidebarLinks.map((item) => {
          const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`)
          const isExpanded = openMenus[item.label] ?? isActive;
          
          // Use the Lucide Icon component we defined in constants
          const Icon = item.icon;

          // ROLE-BASED VISIBILITY LOGIC
          // Only KP sees the Executive Panel and Committee Management
          if (item.label === 'Executive Panel' && role !== 'kp') return null;
          if (item.label === 'Ahli Jawatankuasa' && role !== 'kp') return null;
          
          // Urussetia should not see the Approval (Kelulusan) section
          if (item.label === 'Kelulusan BOD' && role === 'urussetia') return null;

          return (
            <div key={item.label} className="flex flex-col">
              <div className={cn(
                "relative flex items-center transition-all duration-300 rounded-lg pr-2",
                isActive ? "bg-bank-gradient text-white" : "text-gray-700"
              )}>
                <Link 
                  href={item.route} 
                  className={cn(
                    "sidebar-link flex-1 !bg-transparent !shadow-none transition-colors duration-200",
                    !isActive && "hover:bg-gray-100/50"
                  )}
                >
                  <div className="relative size-6 flex items-center justify-center">
                    {/* FIXED: Removed imgURL logic, using Icon component exclusively */}
                    <Icon 
                      size={24} 
                      className={cn({ 'text-white': isActive, 'text-gray-500': !isActive })} 
                    />
                  </div>
                  <p className={cn("sidebar-label", { "!text-white": isActive })}>
                    {item.label}
                  </p>
                </Link>

                {item.subLinks && (
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      toggleMenu(item.label);
                    }}
                    className={cn(
                      "p-1.5 transition-all duration-300 rounded-md z-10",
                      isExpanded ? "rotate-180" : "rotate-0",
                      isActive ? "hover:bg-white/20 text-white" : "hover:bg-gray-200 text-gray-400"
                    )}
                  >
                    <ChevronDown size={18} strokeWidth={isActive ? 3 : 2} />
                  </button>
                )}
              </div>

              {item.subLinks && (
                <div className={cn(
                  "grid transition-all duration-300 ease-in-out overflow-hidden",
                  isExpanded ? "grid-rows-[1fr] opacity-100 my-1" : "grid-rows-[0fr] opacity-0"
                )}>
                  <div className="min-h-0 flex flex-col border-l-2 border-gray-100 ml-9 gap-1">
                    {item.subLinks.map((sub) => {
                      const isSubActive = pathname === sub.route;
                      const SubIcon = sub.icon;
                      
                      return (
                        <Link 
                          key={sub.label} 
                          href={sub.route}
                          className={cn(
                            "py-2.5 pl-4 text-14 transition-all duration-200 rounded-r-md border-l-2 border-transparent flex items-center gap-2 w-full",
                            isSubActive 
                              ? "text-blue-600 font-bold bg-blue-50/50 border-blue-600" 
                              : "text-gray-500 font-medium hover:text-blue-600 hover:bg-gray-50 hover:border-blue-200"
                          )}
                        >
                          {SubIcon && <SubIcon size={14} />}
                          {sub.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </nav>
      <Footer user={user} />
    </section>
  )
}

export default Sidebar;