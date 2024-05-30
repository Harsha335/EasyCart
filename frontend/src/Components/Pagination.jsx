import React from "react";

const Pagination = ({ currPage, setSearchParams, totalPages, size }) => {
    // alert(totalPages);
  return (
    <div className="flex items-center justify-center gap-4 ">
      <button
        className="w-9 h-10 border-black border-2 rounded-md font-bold text-2xl"
        onClick={() =>
          setSearchParams((prev) => {
            prev.set("page", 1);
            prev.set("size",size);
            return prev;
          })
        }
      >
        {"«"}
        {/* &#171; */}
      </button>
      <button
        className={`w-9 h-10 border-black border-2 rounded-md font-bold text-2xl ${currPage-1 === 0 && 'bg-zinc-500 cursor-default'}`}
        onClick={() =>
            (currPage-1 !== 0) &&
          setSearchParams((prev) => {
            prev.set("page", currPage - 1);
            prev.set("size",size);
            return prev;
          })
        }
      >
        {"‹"}
      </button>


      {currPage-1 > 0 && <button
        className="w-9 h-10 border-black border-2 font-bold"
        onClick={() =>
          setSearchParams((prev) => {
            prev.set("page", currPage-1);
            prev.set("size",size);
            return prev;
          })
        }
      >
        {`${currPage-1}`}
      </button>}

      <button
        className="w-9 h-10 border-black border-2 font-bold bg-orange-500"
        onClick={() =>
          setSearchParams((prev) => {
            prev.set("page", 1);
            prev.set("size",size);
            return prev;
          })
        }
      >
        {`${currPage}`}
      </button>

      {(currPage+1 <= totalPages)  && <button
        className="w-9 h-10 border-black border-2 font-bold"
        onClick={() =>
          setSearchParams((prev) => {
            prev.set("page", currPage+1);
            prev.set("size",size);
            return prev;
          })
        }
      >
        {`${currPage+1}`}
      </button>}

      <button
        className={`w-9 h-10 border-black border-2 rounded-md font-bold text-2xl ${((currPage+1) > totalPages) && 'bg-zinc-500 cursor-default'}`}
        onClick={() =>
            (currPage+1 <= totalPages) &&
          setSearchParams((prev) => {
            prev.set("page", currPage + 1);
            prev.set("size",size);
            return prev;
          })
        }
      >
        {/* {"❯"} */}
        {"›"}
      </button>
      <button
        className="w-9 h-10 border-black border-2 rounded-md font-bold text-2xl"
        onClick={() =>
          setSearchParams((prev) => {
            prev.set("page", totalPages);
            prev.set("size",size);
            return prev;
          })
        }
      >
        {"»"}
        {/* &#187; */}
      </button>
    </div>
  );
};

export default Pagination;
