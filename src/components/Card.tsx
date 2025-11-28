export function Card({ children }: { children: React.ReactNode }) {
  return (
    <section className="w-full max-w-[860px] rounded-2xl border border-gray-200 bg-white p-6 shadow-lg md:p-7">
      {children}
    </section>
  );
}
