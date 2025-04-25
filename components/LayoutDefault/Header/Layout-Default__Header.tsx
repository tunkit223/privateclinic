import { Input } from "../../ui/input"
import { UserOutlined } from '@ant-design/icons';
import { Avatar, } from 'antd';
import { usePathname } from "next/navigation";
import { sidebarLinks } from "@/constants";


const LayoutDefaultHeader = () => {
  const pathname = usePathname();
  // Split: split string -> array (base on char "/")
  // slice(2): Skip to 2 element
  // join: match elements -> string. Example: ["dashboard"] => dashboard
  const cleanedPathname = pathname.split("/").slice(2).join("/") || "";

  const currentPage = sidebarLinks.find((link) => link.route === `/${cleanedPathname}`)?.label || "Unknown Page";

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
        <div className="mr-11">
          <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
        </div>
      </div>
    </>
  )
}
export default LayoutDefaultHeader;