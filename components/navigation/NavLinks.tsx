'use client';

import { sidebarLinks } from '@/constants';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface NavLinksProps {
  accountId: string;
  userId: string;
  permissions: string[];
}

const NavLinks = ({ accountId, userId, permissions }: NavLinksProps) => {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <>
      {sidebarLinks.map((item) => {

        const hasParentPermission = permissions.includes(item.label);

        const visibleChildren = item.children?.filter((child) =>
          permissions.includes(child.label)
        );

        if (item.children && item.children.length > 0) {
          if (!visibleChildren || visibleChildren.length === 0) return null;

          const isOpen = openDropdown === item.label;
          const isActive =
            pathname.startsWith(`/${accountId}${item.route}`) ||
            visibleChildren.some((child) =>
              pathname === `/${accountId}${child.route}`
            );

          return (
            <div key={item.label}>
              <button
                onClick={() => setOpenDropdown(isOpen ? null : item.label)}
                className={cn(
                  isActive
                    ? 'bg-blue-400 rounded-lg text-dark-400'
                    : 'text-dark-200',
                  'w-full flex justify-between items-center gap-4 p-4'
                )}
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={item.imgURL}
                    alt={item.label}
                    width={20}
                    height={20}
                    className={cn({ 'invert-color': !isOpen })}
                  />
                  <p className="max-lg:hidden">{item.label}</p>
                </div>
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {isOpen && (
                <div className="ml-6 mt-1 space-y-1">
                  {visibleChildren.map((child) => {
                    const isChildActive =
                      pathname === `/${accountId}${child.route}`;
                    return (
                      <Link
                        key={child.route}
                        href={`/${accountId}${child.route}`}
                        className={cn(
                          isChildActive
                            ? 'text-blue-600 font-semibold'
                            : 'text-dark-200',
                          'block px-4 py-2 hover:bg-blue-100 rounded'
                        )}
                      >
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        }

        // Nếu không có children => hiển thị nếu có quyền
        if (!hasParentPermission) return null;

        const isActive =
          (pathname.includes(item.route) && item.route.length > 1) ||
          pathname === item.route;

        return (
          <Link
            href={`/${accountId}${item.route}`}
            key={item.label}
            className={cn(
              isActive
                ? 'bg-blue-400 rounded-lg text-dark-400'
                : 'text-dark-200',
              'flex justify-start items-center gap-4 p-4'
            )}
          >
            <Image
              src={item.imgURL}
              alt={item.label}
              width={20}
              height={20}
              className={cn({ 'invert-color': !isActive })}
            />
            <p className="max-lg:hidden">{item.label}</p>
          </Link>
        );
      })}
    </>
  );
};

export default NavLinks;
