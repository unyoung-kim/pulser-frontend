import Link from "next/link"
import { MdAccountCircle } from "react-icons/md"
import { RiFileList3Line } from "react-icons/ri"
import { VscWholeWord } from "react-icons/vsc"


export default function SidebarNav() {
  return (
    <div className="hidden border-r bg-background md:block md:w-64">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold text-primary">
            <MdAccountCircle className="h-6 w-6" />
            <span className="">Account</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="flex flex-col items-start px-4 text-sm font-medium">
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary transition-all hover:bg-accent w-full"
            >
              <RiFileList3Line className="h-4 w-4" />
              Your Content
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary transition-all hover:bg-accent w-full"
            >
              <VscWholeWord className="h-4 w-4" />
              Keyword
            </Link>
          </nav>
        </div>
      </div>
    </div>
  )
}
