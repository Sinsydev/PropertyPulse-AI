import type { ReactNode } from "react";

interface AppShellProps {
  children: ReactNode;
  sidebar?: ReactNode;
  topbar?: ReactNode;
  className?: string;
}

export default function AppShell({
  children,
  sidebar,
  topbar,
  className = "",
}: AppShellProps) {
  return (
    <div className={[
      "min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]",
      className,
    ].join(" ")}>
      <div className="mx-auto flex min-h-screen max-w-[1800px]">
        {sidebar ? (
          <aside className="hidden w-72 flex-col border-r border-[var(--color-border)] bg-[var(--color-surface-muted)] px-5 py-6 lg:flex">
            {sidebar}
          </aside>
        ) : null}

        <div className="flex min-h-screen flex-1 flex-col">
          {topbar ? (
            <header className="sticky top-0 z-10 border-b border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 backdrop-blur-sm sm:px-6 lg:px-8">
              {topbar}
            </header>
          ) : null}

          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
