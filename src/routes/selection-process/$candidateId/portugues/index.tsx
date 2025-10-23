import { createFileRoute } from '@tanstack/react-router'
import PortugueseTestIntroRoute from '@/pages/PortugueseTestIntroRoute'

export const Route = createFileRoute('/selection-process/$candidateId/portugues/')({
  component: PortugueseTestIntroRoute,
})