"use client";
import { ReactNode, useEffect, useState } from "react";
import LeftSidebar from "@/components/navigation/LeftSidebar";
import { useParams } from "next/navigation";
import { Flex, Layout } from 'antd';
import LayoutDefaultHeader from "@/components/LayoutDefault/Header/Layout-Default__Header";

const { Header, Footer, Sider, Content } = Layout;

const Root = ({ children }: { children: ReactNode }) => {
  const params = useParams();
  const [accountId, setAccountId] = useState<string | null>(null);

  useEffect(() => {
    console.log("Params from useParams():", params); // ✅ Debug useParams()
    if (params?.accountId) {
      setAccountId(params.accountId as string);
    }
  }, [params]);

  if (!accountId) {
    return <div>Loading...</div>; // 🔹 Nếu không có accountId, hiển thị loading
  }

  return (
    <>
      {/* <div className="flex">
        <LeftSidebar accountId={accountId} />

        <section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-36 max-md:pb-1 sm:px-1">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </section>
      </div> */}

      <Layout className="bg-[#F9FBFC]">
        <Sider width={215}>
          <LeftSidebar accountId={accountId} />
        </Sider>
        <Layout className="bg-[#F9FBFC]">
          <header><LayoutDefaultHeader /></header>
          <Content className="m-6 bg-transparent">{children}</Content>
          <footer >Footer</footer>
        </Layout>
      </Layout>
    </>
  );
};

export default Root;
