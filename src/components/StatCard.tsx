import { Dot } from "@/lib/dot";

export const StatCard = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div className="rounded-2xl border border-[#E7E7E7] bg-white px-6 py-4 shadow-[0_1px_0_rgba(0,0,0,0.03)]">
    <div className="flex items-center gap-2 text-[13px] text-black/60 mb-1">
      {label}
      <Dot />
    </div>
    <div className="text-[32px] leading-8 font-semibold text-[#2D5DB3]">{value}</div>
  </div>
);