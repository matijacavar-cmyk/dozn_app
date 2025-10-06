export default function GhostButton({ className = "", ...props }) {
  return (
    <button
      className={`px-3 py-2 rounded-2xl text-sm border border-gray-300 bg-white hover:bg-gray-50 ${className}`}
      {...props}
    />
  );
}