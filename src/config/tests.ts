import QuestionDotIcon from "@/components/icons/QuestionDotIcon";
import { ClipboardList, Video } from "lucide-react";

export type TestStatus = 'pending' | 'not_finished' | 'completed';

// Este tipo agora representa os detalhes estáticos
export interface TestDetails {
  id: string;
  title: string;
  icon: React.ElementType;
  duration: number;
  type: string;
  typeIcon: React.ElementType;
  description: string;
  startTo: string;
}

// Mapeia o 'testType' da API para os detalhes estáticos
const testsConfig: Record<string, TestDetails> = {
  // As chaves DEVEM CORRESPONDER ao `testType` vindo da sua API
  "Portuguese": {
    id: '4',
    title: 'Português',
    icon: QuestionDotIcon,
    duration: 5,
    type: 'Vídeo',
    typeIcon: Video,
    description: 'Teste de conhecimentos em língua portuguesa.',
    startTo: "/selection-process/$candidateId/portugues/",
  },
  "Math": {
    id: '2',
    title: 'Matemática',
    icon: QuestionDotIcon,
    duration: 30,
    type: 'Múltipla escolha',
    typeIcon: ClipboardList,
    description: 'Teste de conhecimentos em matemática.',
    startTo: "/logico/intro",
  },
   "Psychology": {
    id: '1',
    title: 'Questionário',
    icon: QuestionDotIcon,
    duration: 20,
    type: 'Múltipla escolha',
    typeIcon: ClipboardList,
    description: 'Perguntas sobre experiência e perfil.',
    startTo: "/selection-process/$candidateId/questionario/intro", 
  },
  "VisualRetention": {
    id: '3',
    title: 'Retenção Visual',
    icon: QuestionDotIcon,
    duration: 30,
    type: 'Múltipla escolha',
    typeIcon: ClipboardList,
    description: 'Teste de memória e reprodução visual.',
    startTo: "/retencao-visual/",
  },
  "VideoInterview": {
    id: '5',
    title: 'Entrevista de Vídeo',
    icon: QuestionDotIcon,
    duration: 10,
    type: 'Vídeo',
    typeIcon: Video,
    description: 'Perguntas sobre experiência e perfil.',
    startTo: "/entrevista/",
  },
};

// Função para obter os detalhes de um teste pelo seu tipo
export const getTestDetails = (testType: string): TestDetails => {
  // Retorna um objeto padrão caso o tipo não seja encontrado
  return testsConfig[testType] || {
    id: 'unknown',
    title: testType,
    icon: QuestionDotIcon,
    duration: 0,
    type: 'N/A',
    typeIcon: ClipboardList,
    description: 'Teste não configurado.',
    startTo: '#',
  };
};