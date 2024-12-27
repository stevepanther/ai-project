"use client"
import Link from "next/link";
import { useState } from "react";
import { HardDriveUpload } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const [selectedMenu, setSelectedMenu] = useState("upload");
  return (
    <div className="h-screen grid grid-cols-[240px_1fr]">
      <nav className="border-r bg-gray-100/40 dark:bg-gray-800/40">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <Link
              className="flex items-center gap-2 font-semibold"
              onClick={() => setSelectedMenu("upload")}
              href="/dashboard"
            >
              <LayoutDashboardIcon className="h-6 w-6" />
              <span className="">Dashboard</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-4 text-sm space-y-4 font-medium">
              <Link
                className={`flex items-center gap-3 rounded-lg px-3 py-2  transition-all  ${selectedMenu === "upload" ? "bg-[#8B5CF6] text-white" : "hover:bg-purple-50"} `}
                href="/dashboard"
                onClick={() => setSelectedMenu("upload")}
              >
                <HardDriveUpload size={14} />
                Upload Video
              </Link>

              <Link
                className={`flex items-center gap-3 rounded-lg px-3 py-2  transition-all  ${selectedMenu === "summaries" ? "bg-[#8B5CF6] text-white" : "hover:bg-purple-50"} `}
                href="/dashboard/summaries"
                onClick={() => setSelectedMenu("summaries")}
              >
                <ViewIcon className="h-4 w-4" />
                Summaries
              </Link>

              <Link
                className={`flex items-center gap-3 rounded-lg px-3 py-2  transition-all  ${selectedMenu === "account" ? "bg-[#8B5CF6] text-white" : "hover:bg-purple-50"} `}
                href="/dashboard/account"
                onClick={() => setSelectedMenu("account")}
              >
                <UsersIcon className="h-4 w-4" />
                Account
              </Link>

              
            </nav>
          </div>
        </div>
      </nav>
      <main className="flex flex-col overflow-scroll bg-gray-100">{children}</main>
    </div>
  );
}

function LayoutDashboardIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  );
}

function PieChartIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
      <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
  );
}

function UsersIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function ViewIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12s2.545-5 7-5c4.454 0 7 5 7 5s-2.546 5-7 5c-4.455 0-7-5-7-5z" />
      <path d="M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
      <path d="M21 17v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2" />
      <path d="M21 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2" />
    </svg>
  );
}