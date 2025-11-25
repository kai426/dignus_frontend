import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
interface MyRouterContext {
  auth: {
    isAuthenticated: boolean
    token: string | null
  }
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <Outlet />
    </>
  ),
})