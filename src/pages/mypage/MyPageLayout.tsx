import { Outlet } from 'react-router'
import { MyPageApiLogPanel } from './components/MyPageApiLogPanel/MyPageApiLogPanel'

export function MyPageLayout() {
  return (
    <>
      <Outlet />
      <MyPageApiLogPanel />
    </>
  )
}
