import { createFileRoute } from '@tanstack/react-router'
import QuestionnaireIntroPage from '@/pages/QuestionnaireIntroPage'

export const Route = createFileRoute('/selection-process/$candidateId/questionario/intro')({
  component: QuestionnaireIntroPage,
})