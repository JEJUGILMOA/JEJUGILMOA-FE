import { createBrowserRouter } from 'react-router'
import { AppLayout, type RouteHandle } from '@/components/layout/AppLayout/AppLayout'
import { HomePage } from '@/pages/home/HomePage'
import { MapPage } from '@/pages/map/MapPage'
import { PlacePage } from '@/pages/place/PlacePage'
import { PopularPlacesPage } from '@/pages/places/PopularPlacesPage'
import { CourseListPage } from '@/pages/courses/CourseListPage'
import { CourseDetailPage } from '@/pages/courses/CourseDetailPage'
import { SearchPage } from '@/pages/search/SearchPage'
import { PlanPage } from '@/pages/plan/PlanPage'
import { PlanCreatePage } from '@/pages/plan/create/PlanCreatePage'
import { PlanWaypointsPage } from '@/pages/plan/waypoints/PlanWaypointsPage'
import { PlanSearchPage } from '@/pages/plan/search/PlanSearchPage'
import { PlanMapAddPage } from '@/pages/plan/map-add/PlanMapAddPage'
import { PlanItineraryPage } from '@/pages/plan/itinerary/PlanItineraryPage'
import { PlanBudgetPage } from '@/pages/plan/budget/PlanBudgetPage'
import { PlanPreviewPage } from '@/pages/plan/preview/PlanPreviewPage'
import { RecordPage } from '@/pages/record/RecordPage'
import { RecordCreatePage } from '@/pages/record/create/RecordCreatePage'
import { RecordDetailPage } from '@/pages/record/detail/RecordDetailPage'
import { RecordEditPage } from '@/pages/record/edit/RecordEditPage'
import { RecordPlanPage } from '@/pages/record/plan/RecordPlanPage'
import { MyPage } from '@/pages/mypage/MyPage'
import { ProfilePage } from '@/pages/mypage/profile/ProfilePage'
import { ProfileEditPage } from '@/pages/mypage/profile-edit/ProfileEditPage'
import { SettingsPage } from '@/pages/mypage/settings/SettingsPage'
import { TripsPage } from '@/pages/mypage/trips/TripsPage'
import { TripDetailPage } from '@/pages/mypage/trip-detail/TripDetailPage'
import { FavoritesPage } from '@/pages/mypage/favorites/FavoritesPage'
import { BadgesPage } from '@/pages/mypage/badges/BadgesPage'
import { SharedRecordsPage } from '@/pages/mypage/shared-records/SharedRecordsPage'
import { NoticesPage } from '@/pages/mypage/notices/NoticesPage'
import { NoticeDetailPage } from '@/pages/mypage/notices/NoticeDetailPage'
import { SupportPage } from '@/pages/mypage/support/SupportPage'
import { SupportInquiryPage } from '@/pages/mypage/support/SupportInquiryPage'
import { TermsPage } from '@/pages/mypage/terms/TermsPage'
import { TermDetailPage } from '@/pages/mypage/terms/TermDetailPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { TestPageJinsung } from '@/pages/test/TestPageJinsung'
import { TestPageSuji } from '@/pages/test/TestPageSuji'
import { ROUTES } from '@/constants'

export type { RouteHandle }

/** 마이 하위 화면: 하단 탭 숨김 + 페이지 자체 패딩 사용 */
const mySubPageHandle = {
  hideNav: true,
  flush: true,
} as const satisfies Partial<RouteHandle>

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
        path: ROUTES.search.slice(1),
        Component: SearchPage,
        handle: {
          title: '검색',
          hideNav: true,
          flush: true,
        } satisfies RouteHandle,
      },
      {
        path: 'place/:placeId',
        Component: PlacePage,
        handle: {
          title: '장소',
          hideNav: true,
          flush: true,
        } satisfies RouteHandle,
      },
      {
        path: ROUTES.placesPopular.slice(1),
        Component: PopularPlacesPage,
        handle: {
          title: '인기 관광지',
          hideNav: true,
          flush: true,
        } satisfies RouteHandle,
      },
      {
        path: ROUTES.courses.slice(1),
        Component: CourseListPage,
        handle: {
          title: '오늘의 추천 코스',
          hideNav: true,
          flush: true,
        } satisfies RouteHandle,
      },
      {
        path: 'courses/:courseId',
        Component: CourseDetailPage,
        handle: {
          title: '코스 상세',
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
        path: ROUTES.planCreate.slice(1),
        Component: PlanCreatePage,
        handle: { title: '여행 계획 만들기' } satisfies RouteHandle,
      },
      {
        path: 'plan/:planId/edit',
        Component: PlanCreatePage,
        handle: { title: '여행 정보 수정' } satisfies RouteHandle,
      },
      {
        path: 'plan/:planId/waypoints',
        Component: PlanWaypointsPage,
        handle: { title: '경유지 추천' } satisfies RouteHandle,
      },
      {
        path: 'plan/:planId/search',
        Component: PlanSearchPage,
        handle: { title: '장소 검색' } satisfies RouteHandle,
      },
      {
        path: 'plan/:planId/map-add',
        Component: PlanMapAddPage,
        handle: { title: '지도추가' } satisfies RouteHandle,
      },
      {
        path: 'plan/:planId/itinerary',
        Component: PlanItineraryPage,
        handle: { title: '일정편집', hideNav: true, flush: true } satisfies RouteHandle,
      },
      {
        path: 'plan/:planId/budget',
        Component: PlanBudgetPage,
        handle: { title: '예산 입력' } satisfies RouteHandle,
      },
      {
        path: 'plan/:planId/preview',
        Component: PlanPreviewPage,
        handle: { title: '계획 미리보기' } satisfies RouteHandle,
      },
      {
        path: ROUTES.record.slice(1),
        Component: RecordPage,
        handle: { title: '기록' } satisfies RouteHandle,
      },
      {
        path: ROUTES.recordCreate.slice(1),
        Component: RecordCreatePage,
        handle: { title: '기록 작성' } satisfies RouteHandle,
      },
      {
        path: 'record/:recordId',
        Component: RecordDetailPage,
        handle: { title: '기록 상세' } satisfies RouteHandle,
      },
      {
        path: 'record/:recordId/plan',
        Component: RecordPlanPage,
        handle: { title: '여행 계획' } satisfies RouteHandle,
      },
      {
        path: 'record/:recordId/edit',
        Component: RecordEditPage,
        handle: { title: '기록 수정' } satisfies RouteHandle,
      },
      {
        path: ROUTES.my.slice(1),
        handle: { title: '마이' } satisfies RouteHandle,
        children: [
          {
            index: true,
            Component: MyPage,
          },
          {
            path: 'profile',
            Component: ProfilePage,
            handle: { title: '프로필', ...mySubPageHandle } satisfies RouteHandle,
          },
          {
            path: 'profile/edit',
            Component: ProfileEditPage,
            handle: { title: '프로필 수정', ...mySubPageHandle } satisfies RouteHandle,
          },
          {
            path: 'settings',
            Component: SettingsPage,
            handle: { title: '설정', ...mySubPageHandle } satisfies RouteHandle,
          },
          {
            path: 'trips',
            Component: TripsPage,
            handle: { title: '내 여행', ...mySubPageHandle } satisfies RouteHandle,
          },
          {
            path: 'trips/:tripId',
            Component: TripDetailPage,
            handle: { title: '진행중 여행', ...mySubPageHandle } satisfies RouteHandle,
          },
          {
            path: 'favorites',
            Component: FavoritesPage,
            handle: { title: '즐겨찾기', ...mySubPageHandle } satisfies RouteHandle,
          },
          {
            path: 'badges',
            Component: BadgesPage,
            handle: { title: '배지', ...mySubPageHandle } satisfies RouteHandle,
          },
          {
            path: 'shared-records',
            Component: SharedRecordsPage,
            handle: { title: '공유기록', ...mySubPageHandle } satisfies RouteHandle,
          },
          {
            path: 'notices',
            Component: NoticesPage,
            handle: { title: '공지사항', ...mySubPageHandle } satisfies RouteHandle,
          },
          {
            path: 'notices/:noticeId',
            Component: NoticeDetailPage,
            handle: { title: '공지사항', ...mySubPageHandle } satisfies RouteHandle,
          },
          {
            path: 'support',
            Component: SupportPage,
            handle: { title: '고객센터', ...mySubPageHandle } satisfies RouteHandle,
          },
          {
            path: 'support/inquiry',
            Component: SupportInquiryPage,
            handle: { title: '문의하기', ...mySubPageHandle } satisfies RouteHandle,
          },
          {
            path: 'terms',
            Component: TermsPage,
            handle: { title: '약관 및 정책', ...mySubPageHandle } satisfies RouteHandle,
          },
          {
            path: 'terms/:termId',
            Component: TermDetailPage,
            handle: { title: '약관', ...mySubPageHandle } satisfies RouteHandle,
          },
        ],
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
