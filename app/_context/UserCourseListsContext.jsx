
"use client";

import React, { createContext, useEffect, useState } from "react";

export const UserCourseListContext = createContext({
  UserCourseList: [],
  setUserCourseList: () => {},
  loading: true,
  error: "",
});

export function UserCourseListProvider({ children }) {
  const [UserCourseList, setUserCourseList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchCourses() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/courses", {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Courses load nahi ho sake.");
        }

        if (!Array.isArray(data)) {
          throw new Error("API ne courses array return nahi kiya.");
        }

        if (!cancelled) {
          setUserCourseList(data);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("FETCH COURSES ERROR:", err);
          setError(err.message || "Something went wrong.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchCourses();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <UserCourseListContext.Provider
      value={{
        UserCourseList,
        setUserCourseList,
        loading,
        error,
      }}
    >
      {children}
    </UserCourseListContext.Provider>
  );
}
