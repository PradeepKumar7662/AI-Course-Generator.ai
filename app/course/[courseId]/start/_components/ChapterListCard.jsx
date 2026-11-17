
import React from "react";
import { FaRegClock } from "react-icons/fa6";

function ChapterListCard({ chapter, index }) {
  const chapterName =
    chapter?.chapterName ||
    chapter?.["Chapter Name"] ||
    chapter?.title ||
    chapter?.name ||
    `Chapter ${index + 1}`;

  const duration =
    chapter?.duration ||
    chapter?.Duration ||
    "";

  return (
    <div className="grid grid-cols-5 items-center border-b p-4">
      <div>
        <h2 className="flex h-8 w-8 items-center justify-center rounded-full bg-primary p-1 text-center text-white">
          {index + 1}
        </h2>
      </div>

      <div className="col-span-4 min-w-0">
        <h2 className="break-words font-medium">
          {String(chapterName).replace(/^#+\s*/, "")}
        </h2>

        {duration && (
          <h2 className="flex items-center gap-2 text-sm text-primary">
            <FaRegClock />
            {duration}
          </h2>
        )}
      </div>
    </div>
  );
}

export default ChapterListCard;
