import PortugueseTestRunRoute from '@/pages/PortugueseTestRunRoute'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/portugues/gravar')({
  component: PortugueseTestRunRoute,
})
