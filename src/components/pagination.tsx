import React from "react";

interface Props {
  page: number;
  setPage: (_: number) => void;
}

function Pagination({page, setPage}: Props) {
  return (
    <div className="flex justify-between items-center">
      <button
        className="bg-indigo-700 transition duration-150 ease-in-out hover:bg-indigo-600 rounded text-white px-6 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-indigo-600"
        onClick={() => setPage(page - 1)}
      >
        Decrement page
      </button>
      <button
        className="bg-indigo-700 transition duration-150 ease-in-out hover:bg-indigo-600 rounded text-white px-6 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-indigo-600"
        onClick={() => setPage(page + 1)}
      >
        Increment page
      </button>
    </div>
  )
}

export {Pagination}