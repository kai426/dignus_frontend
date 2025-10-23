import { createFileRoute } from '@tanstack/react-router'
import InterviewTestIntroRoute from '@/pages/InterviewTestIntroRoute'

export const Route = createFileRoute('/entrevista/')({
  component: InterviewTestIntroRoute,
})