import React from "react";

const PageLoader: React.FC = () => {
  return (
     <div className="w-full h-screen flex flex-col items-center justify-center bg-white gap-4">

        <h1 className="text-4xl font-black text-[#ff5722]">
          Nibuy
        </h1>

        <div className="w-10 h-10 border-4 border-gray-300 border-t-[#ff5722] rounded-full animate-spin"></div>

      </div>
  );
};

export default PageLoader;