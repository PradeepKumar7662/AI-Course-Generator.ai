
"use client";
import React, { useState } from "react";
import SideBar from "./_components/SideBar";
import Header from "./_components/Header";
import { UserCourseListContext } from "../_context/UserCourseListsContext";

function DashboardLayout({ children }) { 
  const [UserCourseList, setUserCourseList] = useState([]);

  return (
    <UserCourseListContext.Provider 
      value={{ UserCourseList, setUserCourseList }}
    >
      <div className="min-h-screen bg-slate-50">
        <SideBar />

        <div className="min-w-0 md:pl-64">
          <Header />

          <main className="min-h-[calc(100vh-4rem)] px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
            <div className="mx-auto w-full max-w-7xl dashboard-enter">
              {children}
            </div>
          </main>
        </div>
      </div>
    </UserCourseListContext.Provider>
  );
}

export default DashboardLayout;
