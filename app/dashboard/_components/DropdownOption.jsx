
"use client";

import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { FaRegTrashAlt } from "react-icons/fa";
import { BookOpen, Info, X } from "lucide-react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function DropdownOption({ children, handleOnDelete }) {
  const [openAlert, setOpenAlert] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const onDeleteClick = async () => {
    try {
      setDeleting(true);
      await handleOnDelete();
      setOpenAlert(false);
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {children}
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="w-44 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl"
        >
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setOpenAlert(true);
            }}
            className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 focus:bg-red-50 focus:text-red-600"
          >
            <FaRegTrashAlt size={14} />
            Delete Course
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={openAlert}
        onOpenChange={(open) => {
          if (!deleting) setOpenAlert(open);
        }}
      >
        <AlertDialogContent className="w-[calc(100%-32px)] max-w-[430px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 shadow-2xl">

          {/* Header */}
          <div className="px-6 pt-5">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-2.5">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50">
                  <BookOpen
                    size={21}
                    className="text-purple-600"
                  />
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    AI COURSE GENERATOR
                  </p>

                  <p className="text-sm font-bold text-slate-800">
                    Course Management
                  </p>
                </div>

              </div>

              <button
                type="button"
                disabled={deleting}
                onClick={() => setOpenAlert(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>

            </div>

          </div>

          {/* Main content */}
          <div className="px-6 pb-5 pt-7">

            <div className="flex flex-col items-center text-center">

              <div className="flex h-[68px] w-[68px] items-center justify-center rounded-2xl border border-purple-100 bg-purple-50 shadow-sm">
                <FaRegTrashAlt
                  size={26}
                  className="text-purple-600"
                />
              </div>

              <AlertDialogHeader className="mt-5 space-y-2">

                <AlertDialogTitle className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                  Delete this course?
                </AlertDialogTitle>

                <AlertDialogDescription className="text-sm leading-6 text-slate-500">
                  Are you sure you want to permanently delete this course?
                  Please review this action before continuing.
                </AlertDialogDescription>

              </AlertDialogHeader>

            </div>

            {/* Information */}
            <div className="mt-6 rounded-xl border border-purple-100 bg-purple-50/70 p-3.5">

              <div className="flex items-start gap-2.5">

                <Info
                  size={18}
                  className="mt-0.5 shrink-0 text-purple-600"
                />

                <div>

                  <p className="text-sm font-semibold text-purple-900">
                    Please note
                  </p>

                  <p className="mt-1 text-xs leading-5 text-purple-700">
                    All course chapters and related learning content
                    will also be deleted. This action cannot be undone.
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* Footer */}
          <AlertDialogFooter className="flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/80 px-6 py-4 sm:flex-row sm:justify-end">

            <AlertDialogCancel
              disabled={deleting}
              className="mt-0 w-full rounded-xl border border-slate-200 bg-white px-5 font-semibold text-slate-700 hover:bg-slate-100 sm:w-auto"
            >
              Cancel
            </AlertDialogCancel>

            <button
              type="button"
              disabled={deleting}
              onClick={onDeleteClick}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-purple-200 transition-all hover:-translate-y-0.5 hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              <FaRegTrashAlt size={13} />
              {deleting ? "Deleting..." : "Delete Course"}
            </button>

          </AlertDialogFooter>

        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default DropdownOption;
