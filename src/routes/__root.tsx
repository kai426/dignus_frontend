import { createRootRoute, Outlet } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: () => (
    <>
      {/* O Outlet renderizará a rota filha correspondente */}
      <Outlet />
    </>
  ),
})