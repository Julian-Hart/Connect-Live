import React, { Children } from "react";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return <main>{children}</main>;
};

export default RootLayout;
