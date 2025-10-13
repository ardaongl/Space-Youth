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
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:grid lg:grid-cols-[16rem_1fr]">
      {/* Left rail: sticks to far left from very top */}
      <div className="hidden lg:block">
        {left}
      </div>

      {/* Right side: header + content */}
      <div className="min-h-screen flex flex-col flex-1">
        <Header />
        {hasRight ? (
          <div className="flex flex-col lg:grid lg:grid-cols-[1fr_24rem] gap-6 px-2 sm:px-4 flex-1">
            <main className="pb-20 w-full max-w-full overflow-x-hidden">{children}</main>
            <div className="hidden lg:block">
              {right}
            </div>
          </div>
        ) : (
          <main className="pb-20 px-2 sm:px-4 w-full max-w-full overflow-x-hidden flex-1">{children}</main>
        )}
      </div>
    </div>
  );
}
