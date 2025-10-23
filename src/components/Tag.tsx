import { cn } from "@/lib/utils";

const Tag = ({
  tone = "neutral",
  children,
}: {
  tone?: "brand" | "success" | "neutral";
  children: React.ReactNode;
}) => {
  const styles =
    tone === "brand"
      ? "bg-[#E6F0FB] text-[#2D5DB3] border border-[#C7DBF7]"
      : tone === "success"
      ? "bg-[#EAF7E9] text-[#2F9E44] border border-[#D3F0D0]"
      : "bg-[#EEF1F4] text-[#5B6470] border border-[#E2E6EB]";
  return <span className={cn("text-[11px] px-2 py-1 rounded-md", styles)}>{children}</span>;
};

export default Tag;