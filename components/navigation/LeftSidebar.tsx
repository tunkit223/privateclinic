'use client';

import React, { useEffect, useState } from 'react';
import NavLinks from './NavLinks';
import { getUserByAccountId } from '@/lib/actions/user.action';
import { getPermissionByUserId } from '@/lib/actions/permission.action';
import { useParams } from 'next/navigation';

const LeftSidebar = () => {
  const params = useParams();
  const accountId = params?.accountId as string;

  const [userId, setUserId] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);

  useEffect(() => {
    const fetchUserAndPermissions = async () => {
      if (!accountId) return;

      const user = await getUserByAccountId(accountId);
      if (user && user._id) {
        setUserId(user._id);
        const userPermissions = await getPermissionByUserId(user._id);
        setPermissions(userPermissions || []);
      }
    };

    fetchUserAndPermissions();
  }, [accountId]);

  if (!userId) return null; // Có thể show skeleton/loading ở đây

  return (
    <section className="custom-scrollbar bg-blue-200 text-black sticky left-0 top-0 h-screen flex flex-col justify-between overflow-y-auto border-r p-6 pt-10 max-sm:hidden lg:w-[215px]">
      <div className="flex flex-1 flex-col gap-6">
        <NavLinks accountId={accountId} userId={userId} permissions={permissions} />
      </div>
    </section>
  );
};

export default LeftSidebar;
