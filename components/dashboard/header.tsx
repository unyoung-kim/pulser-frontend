'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { Search, Package2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  children?: React.ReactNode;
  showSearch?: boolean;
}

export function Header({ children, showSearch = false }: HeaderProps) {
  const pathname = usePathname();

  return (
    <header className="flex h-20 items-center gap-6 border-b bg-white px-6 lg:h-[70px] lg:px-8">
      {children}
      {pathname === '/' && (
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Package2 className="h-6 w-6 text-indigo-600" />
          <span className="text-indigo-600 text-sm">Pulser</span>
        </Link>
      )}
      <div className="w-full flex-1 flex items-center justify-between">
        {showSearch && (
          <form className="w-full md:w-2/3 lg:w-1/3">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="search"
                placeholder="Search pulsers..."
                className="w-full appearance-none text-xs bg-gray-50 pl-10 py-1 shadow-none focus:ring-indigo-500"
              />
            </div>
          </form>
        )}
        <div className={`flex gap-2 ${showSearch ? 'ml-2' : 'ml-auto'}`}>
          <UserButton />
        </div>
      </div>
    </header>
  );
}
