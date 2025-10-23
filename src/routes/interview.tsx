import { createFileRoute } from '@tanstack/react-router'
import VideoInterviewPage from '@/pages/VideoInterviewPage'

export const Route = createFileRoute('/interview')({
  component: VideoInterviewPage,
})