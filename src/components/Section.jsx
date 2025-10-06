export default function Section({ title, children }) {
  return (
    <section className="bg-white rounded-2xl shadow p-4 md:p-6 border border-gray-100">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </section>
  );
}