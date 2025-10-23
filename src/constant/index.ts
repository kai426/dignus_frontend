import type { Job, NavItemPng } from "@/@types";

import iconVagasCollapsed from "@/assets/BemolRecruta_Assets/48x48/icons/MinhasVagas.png";   // com círculo
import iconCVCollapsed    from "@/assets/BemolRecruta_Assets/48x48/icons//cvAlt.png";         // com círculo
import iconPerfilCollapsed from "@/assets/BemolRecruta_Assets/48x48/icons//profileAlt.png";   // com círculo

import iconVagasExpanded  from "@/assets/BemolRecruta_Assets/48x48/icons//vagasAlt.png";      // sem círculo (glyph/flat)
import iconCVExpanded     from "@/assets/BemolRecruta_Assets/48x48/icons//cv.png";            // sem círculo (glyph/flat)
import iconPerfilExpanded from "@/assets/BemolRecruta_Assets/48x48/icons//Profile.png";   

export const navItems: NavItemPng[] = [
  {
    key: "candidaturas",
    label: "Candidaturas",
    to: "/candidaturas",
    iconCollapsed: iconVagasCollapsed,
    iconExpanded: iconVagasExpanded,
    alt: "Candidaturas",
  },
  {
    key: "curriculo",
    label: "Meu currículo",
    to: "/curriculo",
    iconCollapsed: iconCVCollapsed,
    iconExpanded: iconCVExpanded,
    alt: "Meu currículo",
  },
  {
    key: "perfil",
    label: "Meu perfil",
    to: "/perfil",
    iconCollapsed: iconPerfilExpanded,
    iconExpanded: iconPerfilCollapsed,
    alt: "Meu perfil",
  },
];

export const jobs: Job[] = [
  {
    id: "1",
    title: "Software Engineer III",
    tags: [
      { label: "Bemol Digital", tone: "brand" },
      { label: "Publicado", tone: "success" },
    ],
    publishedAt: "07/09/2025",
    expiresAt: "02/10/2025",
    owner: "Ana Luíza",
  },
  {
    id: "2",
    title: "Analista de Modelagem de Crédito",
    tags: [
      { label: "Bemol Digital", tone: "brand" },
      { label: "Publicado", tone: "success" },
    ],
    publishedAt: "07/09/2025",
    expiresAt: "02/10/2025",
    owner: "Ana Luíza",
  },
  {
    id: "3",
    title: "Assistente de Loja - Bemol Autazes",
    tags: [
      { label: "Bemol S.A.", tone: "neutral" },
      { label: "Encerrada", tone: "neutral" },
    ],
    publishedAt: "07/09/2025",
    expiresAt: "02/10/2025",
    owner: "Ana Luíza",
  },
  {
    id: "4",
    title: "Software Engineer I",
    tags: [
      { label: "BSP", tone: "neutral" },
      { label: "Rascunho", tone: "neutral" },
    ],
    publishedAt: "07/09/2025",
    expiresAt: "02/10/2025",
    owner: "Ana Luíza",
  },
];