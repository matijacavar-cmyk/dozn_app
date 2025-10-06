export default function LabeledInput({ label, children }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-gray-700">{label}</span>
      {children}
    </label>
  );
}