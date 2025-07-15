"use client";

import { Authenticated } from "convex/react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return <Authenticated>{children}</Authenticated>;
};
export default layout;
