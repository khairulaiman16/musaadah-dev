'use client'

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { sidebarLinks } from "@/constants"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Footer from "./Footer"

const MobileNav = ({ user }: MobileNavProps) => {
  const pathname = usePathname();
  const isAdmin = user?.role === 'admin';

  return (
    <section className="w-full max-w-[264px]">
      <Sheet>
        <SheetTrigger>
          <Image
            src="/icons/hamburger.svg"
            width={30}
            height={30}
            alt="menu"
            className="cursor-pointer"
          />
        </SheetTrigger>
        <SheetContent side="left" className="border-none bg-white">
          {/* Reduced padding and tighter top layout for cleanliness */}
          <Link href="/" className="cursor-pointer flex items-center gap-1 px-4 mb-4">
            <Image 
              src="/icons/logo.svg"
              width={54}
              height={54}
              alt="Musaadah logo"
            />
            <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">Musa'adah</h1>
          </Link>

          <div className="mobilenav-sheet">
            <SheetClose asChild>
              <nav className="flex h-full flex-col gap-2 pt-8 text-white">
                {sidebarLinks.map((item) => {
                  const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`)

                  if (item.label === 'Ahli Jawatankuasa' && !isAdmin) return null;

                  return (
                    <div key={item.label} className="flex flex-col">
                      <SheetClose asChild>
                        <Link href={item.route}
                          className={cn('mobilenav-sheet_close w-full', { 'bg-bank-gradient': isActive })}
                        >
                          <Image 
                            src={item.imgURL}
                            alt={item.label}
                            width={20}
                            height={20}
                            className={cn({
                              'brightness-[3] invert-0': isActive
                            })}
                          />
                          <p className={cn("text-16 font-semibold text-black-2", { "text-white": isActive })}>
                            {item.label}
                          </p>
                        </Link>
                      </SheetClose>

                      {/* Nested Sub-sections: Always visible for easier mobile access */}
                      {item.subLinks && (
                        <div className="flex flex-col ml-12 border-l-2 border-gray-100 mt-1 mb-2">
                          {item.subLinks.map((sub) => {
                             const isSubActive = pathname === sub.route.split('#')[0];
                             
                             return (
                              <SheetClose asChild key={sub.label}>
                                <Link 
                                  href={sub.route}
                                  className={cn(
                                    "flex py-2 pl-6 pr-4 text-14 transition-all font-medium",
                                    isSubActive ? "text-blue-600" : "text-gray-500"
                                  )}
                                >
                                  {sub.label}
                                </Link>
                              </SheetClose>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </nav>
            </SheetClose>

            <Footer user={user} type="mobile" />
          </div>
        </SheetContent>
      </Sheet>
    </section>
  )
}

export default MobileNav