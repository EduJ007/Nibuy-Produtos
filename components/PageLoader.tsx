import React from "react";

const PageLoader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 col-span-full">

      <h2 className="text-2xl font-black text-[#ff5722]">
        Nibuy
      </h2>

      <p className="text-gray-600 font-semibold">
        Carregando...
      </p>

    </div>
  );
};

export default PageLoader;