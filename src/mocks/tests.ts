import QuestionDotIcon from "@/components/icons/QuestionDotIcon";
import { ClipboardList, Video } from "lucide-react";

export type TestStatus = 'pending' | 'not_finished' | 'completed';

export type Test = {
  id: string;
  title: string;
  icon: React.ElementType;
  duration: number; // em minutos
  type: string;
  typeIcon: React.ElementType;
  description: string;
  status: TestStatus;
  startTo?: string;
};

export const selectionProcessTests: Test[] = [
  {
    id: '1',
    title: 'Questionário',
    icon: QuestionDotIcon,
    duration: 20,
    type: 'Múltipla escolha',
    typeIcon: ClipboardList,
    description: 'Perguntas sobre experiência e perfil.',
    status: 'pending',
    startTo: "/questionario/intro", 
  },
  {
    id: '2',
    title: 'Matemática',
    icon: QuestionDotIcon,
    duration: 30,
    type: 'Múltipla escolha',
    typeIcon: ClipboardList,
    description: 'Teste de conhecimentos em matemática.',
    status: 'pending',
    startTo: "/logico/intro",
  },
  {
    id: '3', // Novo ID
    title: 'Retenção Visual',
    icon: QuestionDotIcon,
    duration: 30,
    type: 'Múltipla escolha',
    typeIcon: ClipboardList,
    description: 'Teste de memória e reprodução visual.',
    status: 'pending',
    startTo: "/retencao-visual/",
  },
  {
    id: '4',
    title: 'Português',
    icon: QuestionDotIcon,
    duration: 5,
    type: 'Vídeo',
    typeIcon: Video,
    description: 'Teste de conhecimentos em língua portuguesa.',
    status: 'pending',
    startTo: "/portugues/",
  },
  {
    id: '5',
    title: 'Entrevista de Vídeo',
    icon: QuestionDotIcon,
    duration: 10,
    type: 'Vídeo',
    typeIcon: Video,
    description: 'Perguntas sobre experiência e perfil.',
    status: 'pending',
    startTo: "/entrevista/",
  },
];