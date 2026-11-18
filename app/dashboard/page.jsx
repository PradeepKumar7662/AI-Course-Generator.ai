
import React from "react";
import AddCourse from "./_components/AddCourse";
import UserCourseList from "./_components/UserCourseList";

function Dashboard() {
  return (
    <main className="relative isolate min-h-screen w-full overflow-hidden bg-slate-50/70 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      {/* Subtle grid background */}
   
{/* Same background as Home page */}
<div
  aria-hidden="true"
  className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
>
  {/* Violet glow */}
  <div className="absolute -left-32 top-10 h-80 w-80 rounded-full bg-violet-600/20 blur-[120px]" />

  {/* Blue glow */}
  <div className="absolute -right-20 top-20 h-96 w-96 rounded-full bg-blue-500/20 blur-[130px]" />

  {/* Purple glow */}
  <div className="absolute bottom-0 left-1/2 h-72 w-96 -translate-x-1/2 rounded-full bg-purple-500/10 blur-[110px]" />

  {/* Subtle grid */}
  <div
    className="absolute inset-0 opacity-[0.07]"
    style={{
      backgroundImage:
        "linear-gradient(rgba(255,255,255,.25) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.25) 1px, transparent 1px)",
      backgroundSize: "48px 48px",
    }}
  />
</div>


      {/* Soft ambient color */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 -z-10 h-72 w-72 rounded-full bg-violet-200/30 blur-3xl"
      />

      <div className="mx-auto w-full max-w-7xl">
        {/* Create course section */}
        <section className="dashboard-enter min-w-0">
          <AddCourse />
        </section>

        {/* My courses section */}
        <section className="dashboard-enter dashboard-delay-1 mt-8 min-w-0 sm:mt-10">
          <UserCourseList />
        </section>
      </div>
    </main>
  );
}

export default Dashboard;
