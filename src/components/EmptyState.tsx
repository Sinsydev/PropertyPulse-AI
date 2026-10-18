import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[260px] items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center">
      <div className="max-w-md">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-xl text-[var(--color-accent-strong)]">
          •
        </div>
        <h3 className="text-lg font-semibold text-[var(--color-text)]">{title}</h3>
        {description ? (
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            {description}
          </p>
        ) : null}
        {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
      </div>
    </div>
  );
}
