"use client"
import { Input } from "../../ui/input"
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Form, Image, } from 'antd';
import { usePathname } from "next/navigation";
import { sidebarLinks } from "@/constants";

import React, { useState, useEffect, use } from 'react';
import { Modal, Row } from 'antd';
import { getCookieParsed } from "@/lib/utils";

function LayoutDefaultHeader() {
  const pathname = usePathname();
  const cleanedPathname = pathname.split("/").slice(2).join("/") || "";
  const mainRoute = '/' + cleanedPathname.split('/')[0];


  let currentPage = sidebarLinks.find(link => link.route === mainRoute)?.label || "Unknown page"
  if (cleanedPathname.endsWith("create")) {
    currentPage = `Create ${currentPage}`
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<any>({});
  const [form] = Form.useForm();


  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };


  useEffect(() => {
    const fetchUser = async () => {
      const cookie = getCookieParsed("user");

      if (cookie && cookie._id) {
        try {
          const response = await fetch(`/api/user/${cookie._id}`);
          if (response.ok) {
            const data = await response.json();
            if (!data) return;
            setUser(data);
          } else {
            console.error("Error fetching:", response.statusText);
          }
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      }
    };
    fetchUser();
  }, []);
  // console.log("úe", user)



  return (
    <>
      <div className="flex justify-between items-center mt-5 border-b-2 border-gray-200 pb-5">
        <div className="text-[25px] font-[600] text-black ml-11">{currentPage}</div>
        <div className="flex gap-2">
          <Input
            placeholder="Search"
            className="w-[600px] text-black py-5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
        <div className="mr-11 cursor-pointer ">
          <Avatar
            style={{ backgroundColor: user.image ? "transparent" : "#87d068" }}
            onClick={showModal} src={user.image} alt="Personal profile" />
        </div>
      </div>
      <Modal title="Personal profile" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <div className="profile">
          <div className="profile__picture flex items-center gap-10">
            <div className="profile__picture__avatar" >
              <Image className="profile__picture__avatar--image rounded-full" width={100} height={100} src={user.image || "fallback.jpg"}></Image>
            </div>

          </div>
          <Form layout="vertical" className="profile__form"
            form={form}
          >

            <Form.Item label="ID" name="_id">
              <div className="rounded-md border-[1px] p-2">{user.accountId || "N/A"}</div>
            </Form.Item>
            <Form.Item label="Name" name="name" >
              <div className="rounded-md border-[1px] p-2">{user.name || "N/A"}</div>
            </Form.Item>
            <Form.Item label="Username" name="username" >
              <div className="rounded-md border-[1px] p-2">{user.username || "N/A"}</div>
            </Form.Item>
            <Form.Item label="Address" name="address" >
              <div className="rounded-md border-[1px] p-2">{user.address || "N/A"}</div>
            </Form.Item>
            <Form.Item label="Phone" name="phone" >
              <div className="rounded-md border-[1px] p-2">{user.phone || "N/A"}</div>
            </Form.Item>


          </Form>
        </div>
      </Modal>
    </>
  )
}
export default LayoutDefaultHeader;