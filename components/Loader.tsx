import React from "react";

const Loader: React.FC = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-[9999] gap-6">

      <h1 className="text-4xl font-black text-[#ff5722] tracking-wide">
        Nibuy
      </h1>

      <div className="w-10 h-10 border-4 border-gray-300 border-t-[#ff5722] rounded-full animate-spin"></div>

    </div>
  );
};

export default Loader;