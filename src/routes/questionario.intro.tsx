import { createFileRoute } from '@tanstack/react-router'
import QuestionnaireIntroPage from '@/pages/QuestionnaireIntroPage'

export const Route = createFileRoute('/questionario/intro')({
  component: QuestionnaireIntroPage,
})