export type NavItemPng = {
  key: string;
  label: string;
  to: string;
  iconCollapsed: string; // versão com círculo (para sidebar colapsada)
  iconExpanded: string;  // versão “flat” (para sidebar expandida)
  alt: string;
};

export type Job = {
  id: string;
  title: string;
  tags: { label: string; tone: "brand" | "success" | "neutral" }[];
  publishedAt: string;
  expiresAt: string;
  owner: string;
};

// @/@types.ts
export type Option = { id: string; label: string };

export type Question = {
  id: string;
  prompt: string;
  options: Option[];
  type?: "single" | "multi" | "text"; 
  maxSelections?: number;
  placeholder?: string;  
};

export type Section = {
  id: string;
  title: string;
  questions: Question[];
};
