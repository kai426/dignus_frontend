import { ConsentPage } from '@/pages/ConsentPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/consent')({
  component: ConsentPage,
})