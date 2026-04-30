const variantClasses = {
  default: "bg-slate-900 text-white shadow hover:bg-slate-800",
  outline: "border border-slate-200 bg-white text-slate-900 shadow-sm hover:bg-slate-100",
}

export function Button({ className = "", variant = "default", children, ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${variantClasses[variant] ?? variantClasses.default} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
