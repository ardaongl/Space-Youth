import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { ReactNode } from "react";

export default function AppLayout({
  left = <Sidebar />,
  right,
  children,
}: {
  left?: ReactNode;
  right?: ReactNode | null;
  children: ReactNode;
}) {
  const hasRight = right !== null && right !== undefined && right !== false;
  return (
    <div className="min-h-screen bg-background text-foreground grid lg:grid-cols-[16rem_1fr]">
      {/* Left rail: sticks to far left from very top */}
      {left}

      {/* Right side: header + content */}
      <div className="min-h-screen flex flex-col">
        <Header />
        {hasRight ? (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_24rem] gap-6 px-4">
            <main className="pb-20">{children}</main>
            {right}
          </div>
        ) : (
          <main className="pb-20 px-4">{children}</main>
        )}
      </div>
    </div>
  );
}
