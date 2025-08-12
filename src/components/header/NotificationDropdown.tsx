"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function NotificationDropdown() {
  const [notifying, setNotifying] = useState(true);

  const handleOpen = () => setNotifying(false);

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="relative dropdown-toggle flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
            onClick={handleOpen}
          >
            <span
              className={`absolute right-0 top-0.5 z-10 h-2 w-2 rounded-full bg-orange-400 ${
                !notifying ? "hidden" : "flex"
              }`}
            >
              <span className="absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping"></span>
            </span>
            <svg
              className="fill-current"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="absolute -right-[240px] mt-[17px] flex h-[480px] w-[350px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark sm:w-[361px] lg:right-0"
        >
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-700">
            <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Notification
            </h5>
          </div>
          <ul className="flex flex-col h-auto overflow-y-auto custom-scrollbar">
            {/* Example notification items */}
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item, idx) => (
              <li key={idx}>
                <DropdownMenuItem asChild>
                  <a
                    href="#"
                    className="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
                  >
                    <span className="relative block w-full h-10 rounded-full z-1 max-w-10">
                      <Image
                        width={40}
                        height={40}
                        src={`/images/user/user-0${(idx % 5) + 2}.jpg`}
                        alt="User"
                        className="w-full overflow-hidden rounded-full"
                      />
                      <span
                        className={`absolute bottom-0 right-0 z-10 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white ${
                          idx % 5 === 3 ? "bg-error-500" : "bg-success-500"
                        } dark:border-gray-900`}
                      ></span>
                    </span>
                    <span className="block">
                      <span className="mb-1.5 space-x-1 block text-theme-sm text-gray-500 dark:text-gray-400">
                        <span className="font-medium text-gray-800 dark:text-white/90">
                          {
                            [
                              "Terry Franci",
                              "Alena Franci",
                              "Jocelyn Kenter",
                              "Brandon Philips",
                              "Terry Franci",
                              "Alena Franci",
                              "Jocelyn Kenter",
                              "Brandon Philips",
                            ][idx]
                          }
                        </span>
                        <span>requests permission to change</span>
                        <span className="font-medium text-gray-800 dark:text-white/90">
                          Project - Nganter App
                        </span>
                      </span>
                      <span className="flex items-center gap-2 text-gray-500 text-theme-xs dark:text-gray-400">
                        <span>Project</span>
                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                        <span>
                          {
                            [
                              "5 min ago",
                              "8 min ago",
                              "15 min ago",
                              "1 hr ago",
                              "5 min ago",
                              "8 min ago",
                              "15 min ago",
                              "1 hr ago",
                            ][idx]
                          }
                        </span>
                      </span>
                    </span>
                  </a>
                </DropdownMenuItem>
              </li>
            ))}
          </ul>
          <DropdownMenuSeparator />
          <Link
            href="/"
            className="block px-4 py-2 mt-3 text-sm font-medium text-center text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            View All Notifications
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
