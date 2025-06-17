'use client';

import { useState, useEffect } from 'react';
import { getAllUsers, getUserByAccountId } from '@/lib/actions/user.action';
import { getPermissionByUserId, updatePermission } from '@/lib/actions/permission.action';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { useParams } from 'next/navigation';

const ALL_PERMISSIONS = [
  'Dashboard', 'Appointment', 'Medical Report', 'Prescription',
  'Invoice', 'Patient', 'Medicine', 'Medicine Type',
  'Work Schedule', 'Employees', 'Import', 'Profile', 'Change', 'Permissions'
];

const PermissionsPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isadmin, setIsAdmin] = useState(false);
  const params = useParams();
    const fetchUserRole = async () => {
    try {
      const user = await getUserByAccountId(params?.accountId as string);
      if (user?.role === "admin") {
        setIsAdmin(true);
      }
    } catch (err) {
      console.error("Lỗi khi fetch user:", err);
    }}
  useEffect(() => {
    const fetchUsers = async () => {
      const res = await getAllUsers();
      setUsers(res || []);
    };
    fetchUsers();
    fetchUserRole();
  }, []);

  const handleUserSelect = async (userId: string) => {
    setSelectedUserId(userId);
    const res = await getPermissionByUserId(userId);
    setUserPermissions(res);
  };

  const togglePermission = (perm: string, checked: boolean) => {
    setUserPermissions((prev) =>
      checked ? [...prev, perm] : prev.filter((p) => p !== perm)
    );
  };

  const handleSave = async () => {
    if (!selectedUserId) return;
    setIsSaving(true);
    try {
      await updatePermission(selectedUserId, userPermissions);
      toast.success('Successfully saved permissions');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save permissions');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex w-full gap-6 p-6">
      {/* Sidebar danh sách người dùng */}
      <div className="w-1/4 bg-white border rounded-xl shadow-sm p-4 h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">User</h2>
        <ul className="space-y-1">
          {users.map((user) => (
            <li
              key={user._id}
              className={`cursor-pointer px-3 py-2 rounded-lg transition-colors duration-200
                ${
                  selectedUserId === user._id
                    ? 'bg-blue-500 text-white font-semibold'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              onClick={() => handleUserSelect(user._id)}
            >
              {user.name} <span className="text-sm text-gray-400">({user.role})</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Khu vực phân quyền */}
      <div className="w-3/4 bg-white border rounded-xl shadow-sm p-6 min-h-[80vh]">
        <h2 className="text-xl font-semibold mb-6 text-gray-700">Permission</h2>

        {selectedUserId ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {ALL_PERMISSIONS.map((perm) => (
                <label
                  key={perm}
                  className="flex items-center gap-3 px-3 py-2 border rounded-lg hover:bg-blue-50 transition"
                >
                  <Checkbox
                    checked={userPermissions.includes(perm)}
                    onCheckedChange={(value) =>
                      togglePermission(perm, value === true)
                    }
                    className="border-gray-400 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white"
                  />
                  <span className="text-gray-700">{perm}</span>
                </label>
              ))}
            </div>
            <div className="pt-2">
              <Button
                onClick={handleSave}
                disabled={isSaving||!isadmin}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
              >
                {isSaving ? 'Saving...' : '💾 Save'}
              </Button>
            </div>
          </div>
        ) : (
          <p className="italic text-gray-500">
            Pick one
          </p>
        )}
      </div>
    </div>
  );
};

export default PermissionsPage;
