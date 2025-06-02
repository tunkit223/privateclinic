// app/patient/layout.tsx
import { ReactNode } from "react";
import Chat from "@/components/Chat"; // Điều chỉnh lại đường dẫn nếu cần

export default function PatientLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Chat />
    </>
  );
}
