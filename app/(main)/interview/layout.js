import React, { Suspense } from "react";
import { BarLoader } from "react-spinners";

const Layout = ({ children }) => {
  return (
    <div className="px-5">
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="grey" />}
      >
        {children}
      </Suspense>
    </div>
  );
};

export default Layout;
