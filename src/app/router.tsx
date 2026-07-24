import { createBrowserRouter } from 'react-router'
import { AppLayout, type RouteHandle } from '@/components/layout/AppLayout/AppLayout'
import { HomePage } from '@/pages/home/HomePage'
import { MapPage } from '@/pages/map/MapPage'
import { PlacePage } from '@/pages/place/PlacePage'
import { PopularPlacesPage } from '@/pages/places/PopularPlacesPage'
import { CourseListPage } from '@/pages/courses/CourseListPage'
import { CourseDetailPage } from '@/pages/courses/CourseDetailPage'
import { PlanPage } from '@/pages/plan/PlanPage'
import { RecordPage } from '@/pages/record/RecordPage'
import { MyPage } from '@/pages/my/MyPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { TestPageJinsung } from '@/pages/test/TestPageJinsung'
import { TestPageSuji } from '@/pages/test/TestPageSuji'
import { ROUTES } from '@/constants'

export type { RouteHandle }

export const router = createBrowserRouter([
  {
    path: '/',
    Component: AppLayout,
    children: [
      {
        index: true,
        Component: HomePage,
        handle: { title: '홈' } satisfies RouteHandle,
      },
      {
        path: ROUTES.map.slice(1),
        Component: MapPage,
        handle: { title: '지도' } satisfies RouteHandle,
      },
      {
        path: 'place/:placeId',
        Component: PlacePage,
        handle: {
          title: '장소',
          hideHeader: true,
          hideNav: true,
          flush: true,
        } satisfies RouteHandle,
      },
      {
        path: ROUTES.placesPopular.slice(1),
        Component: PopularPlacesPage,
        handle: {
          title: '인기 관광지',
          hideHeader: true,
          hideNav: true,
          flush: true,
        } satisfies RouteHandle,
      },
      {
        path: ROUTES.courses.slice(1),
        Component: CourseListPage,
        handle: {
          title: '오늘의 추천 코스',
          hideHeader: true,
          hideNav: true,
          flush: true,
        } satisfies RouteHandle,
      },
      {
        path: 'courses/:courseId',
        Component: CourseDetailPage,
        handle: {
          title: '코스 상세',
          hideHeader: true,
          hideNav: true,
          flush: true,
        } satisfies RouteHandle,
      },
      {
        path: ROUTES.plan.slice(1),
        Component: PlanPage,
        handle: { title: '계획' } satisfies RouteHandle,
      },
      {
        path: ROUTES.record.slice(1),
        Component: RecordPage,
        handle: { title: '기록' } satisfies RouteHandle,
      },
      {
        path: ROUTES.my.slice(1),
        Component: MyPage,
        handle: { title: '마이' } satisfies RouteHandle,
      },
      {
        path: ROUTES.test[0].slice(1),
        Component: TestPageJinsung,
        handle: { title: '테스트' } satisfies RouteHandle,
      },
      {
        path: ROUTES.test[1].slice(1),
        Component: TestPageSuji,
        handle: { title: '테스트' } satisfies RouteHandle,
      },
      {
        path: '*',
        Component: NotFoundPage,
        handle: { title: '길모아' } satisfies RouteHandle,
      },
    ],
  },
])
