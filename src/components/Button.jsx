export default function Button({ className = "", ...props }) {
  return (
    <button
      className={`px-3 py-2 rounded-2xl shadow text-sm bg-slate-900 text-white hover:opacity-90 active:scale-[.98] ${className}`}
      {...props}
    />
  );
}