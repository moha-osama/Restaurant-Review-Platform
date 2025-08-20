import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="text-center">
        <div
          className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"
          style={{ borderColor: "var(--selective-yellow)" }}
        ></div>
        <p
          className="mt-4 text-base font-medium"
          style={{ color: "var(--dim-gray)" }}
        >
          Loading ...
        </p>
      </div>
    </div>
  );
};

export default Loading;
