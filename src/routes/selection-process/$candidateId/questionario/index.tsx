import { createFileRoute } from '@tanstack/react-router'
import QuestionnairePage from '@/pages/QuestionnairePage'

export const Route = createFileRoute('/selection-process/$candidateId/questionario/')({
  component: QuestionnairePage,
})