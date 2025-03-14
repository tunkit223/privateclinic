"use client";
import { ReactNode, useEffect, useState } from "react";
import LeftSidebar from "@/components/navigation/LeftSidebar";
import { useParams } from "next/navigation";

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
    <main>
      <div className="flex">
        <LeftSidebar accountId={accountId} />

        <section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-36 max-md:pb-14 sm:px-14">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </section>
      </div>
    </main>
  );
};

export default Root;
