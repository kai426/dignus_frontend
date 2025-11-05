import { createFileRoute } from '@tanstack/react-router'
import QuestionnairePage from '@/pages/QuestionnairePage'

export const Route = createFileRoute('/questionnaire')({
  component: QuestionnairePage,
})