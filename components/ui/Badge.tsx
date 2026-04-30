export function Badge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "success" | "danger" | "warning";
}) {
  const colors = {
    default: "bg-zinc-700 text-zinc-200",
    success: "bg-emerald-900 text-emerald-300",
    danger: "bg-red-900 text-red-300",
    warning: "bg-amber-900 text-amber-300",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colors[variant]}`}
    >
      {children}
    </span>
  );
}
