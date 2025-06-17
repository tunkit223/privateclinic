"use client";

import { IUser } from "@/database/user.model";
import { getUserByAccountId, updateUser } from "@/lib/actions/user.action";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import ImageUploader from "@/components/forms/ImageUploader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ChangePassWord from "@/components/forms/ChangePassWordForm";

const ProfilePage = () => {
  const params = useParams();
  const accountId = params?.accountId as string;

  const [user, setUser] = useState<IUser | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      const userData = await getUserByAccountId(accountId);
      setUser(userData);
    }
    fetchUser();
  }, []);

  const handleImageUploadComplete = (url: string) => {
    if (!user) return;
    setUser({ ...user, image: url });
  };

  const handleSaveUser = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await updateUser(accountId, user);
      toast.success("User information updated successfully.");
    } catch {
      toast.error("Failed to update user information.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">👤 Profile</h2>

      {user && (
        <div className="flex flex-col lg:flex-row gap-10 bg-white rounded-xl shadow-md p-6">
          {/* Left: Profile Info */}
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="flex flex-col items-center gap-4">
              <div className="w-[160px] h-[160px] rounded-full overflow-hidden border">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt="Avatar"
                    width={160}
                    height={160}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="bg-gray-200 w-full h-full flex items-center justify-center text-gray-500">
                    No Avatar
                  </div>
                )}
              </div>
              <ImageUploader onUploadComplete={handleImageUploadComplete} />
            </div>

            <div>
              <label className="text-gray-700 font-semibold">Full Name</label>
              <Input
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                placeholder="Full name"
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-gray-700 font-semibold">Username</label>
              <Input
                value={user.username}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
                placeholder="Username"
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-gray-700 font-semibold">Role</label>
              <Input value={user.role} disabled className="mt-1 bg-gray-100" />
            </div>

            <div>
              <label className="text-gray-700 font-semibold">Phone Number</label>
              <Input
                value={user.phone}
                onChange={(e) => setUser({ ...user, phone: Number(e.target.value) })}
                placeholder="Phone number"
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-gray-700 font-semibold">Address</label>
              <Input
                value={user.address || ""}
                onChange={(e) => setUser({ ...user, address: e.target.value })}
                placeholder="Address"
                className="mt-1"
              />
            </div>

            <Button
              onClick={handleSaveUser}
              disabled={isSaving}
              className="w-full text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white mt-4"
            >
              {isSaving ? "Saving..." : "💾 Save Changes"}
            </Button>
          </div>

          {/* Right: Change Password */}
          <div className="w-full lg:w-1/2">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">🔐 Change Password</h3>
            <div className=" rounded-xl r p-6">
              <ChangePassWord />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
