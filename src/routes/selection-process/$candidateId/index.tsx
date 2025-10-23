import { createFileRoute } from '@tanstack/react-router';
import SelectionProcessPage from '@/pages/SelectionProcessPage'; 

// Esta rota corresponde à URL /selection-process/$candidateId
export const Route = createFileRoute('/selection-process/$candidateId/')({
  component: SelectionProcessPage,
});