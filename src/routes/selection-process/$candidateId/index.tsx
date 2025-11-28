import SelectionProcessPage from '@/pages/SelectionProcessPage'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/selection-process/$candidateId/')({
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: '/' })
    }
  },
  component: SelectionProcessPage,
})