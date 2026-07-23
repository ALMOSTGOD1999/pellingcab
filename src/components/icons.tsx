import type { SVGProps } from "react";

export function Steering(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="2" />
      <path d="M12 14v7" />
      <path d="M4.5 9c2.5 1 5 1.5 7.5 1.5S17.5 10 20 9" />
    </svg>
  );
}
