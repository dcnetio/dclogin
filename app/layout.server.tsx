// app/layout.server.tsx
import type { Metadata } from "next";
import { basePath } from "@/config/define";

export const metadata: Metadata = {
  title: "DC Login",
  description: "DC Login",
  icons: [
    { url: basePath + "/favicon.ico", type: "image/x-icon", sizes: "256x256" },
  ],
};

// 注意：不需要 export default，直接返回组件
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>{children}</> // 这里可以返回 children 或其他组件
  );
}
