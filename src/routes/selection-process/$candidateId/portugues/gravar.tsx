import PortugueseTestRunRoute from '@/pages/PortugueseTestRunRoute'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/selection-process/$candidateId/portugues/gravar')({
  component: PortugueseTestRunRoute,
})
