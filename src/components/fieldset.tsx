import React from "react";

export function Field({ children }: { children: React.ReactNode }) {
  return <div className="">{children}</div>;
}

export function Label({ children }: { children: React.ReactNode }) {
  return <label className="block mb-2 text-sm font-medium">{children}</label>;
}
