import { Navigate, RouterProvider, createBrowserRouter } from 'react-router'

import { ProtectedRoute } from '@/app/router/protected_route'
import { FeaturePlaceholder } from '@/components/feedback/feature_placeholder'
import { LoginPage } from '@/features/auth/pages/login_page'
import { CurriculumListPage } from '@/features/curriculums'
import { DashboardPage } from '@/features/dashboard/pages/dashboard_page'
import { LanguageDetailPage, LanguageListPage } from '@/features/languages'
import { LessonCreatePage, LessonDetailPage, LessonListPage } from '@/features/lessons'
import { LevelDetailPage, LevelListPage } from '@/features/levels'
import { LearningReportPage } from '@/features/reports'
import { SystemSettingsPage } from '@/features/settings'
import { TopicDetailPage, TopicListPage } from '@/features/topics'
import { UserDetailPage, UserListPage } from '@/features/users'
import { VocabularyListPage } from '@/features/vocabularies'
import { AdminLayout } from '@/layouts/admin/admin_layout'
import { AuthLayout } from '@/layouts/auth/auth_layout'

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [{ path: '/login', element: <LoginPage /> }],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/curriculums', element: <CurriculumListPage /> },
          { path: '/languages', element: <LanguageListPage /> },
          { path: '/languages/:id', element: <LanguageDetailPage /> },
          { path: '/levels', element: <LevelListPage /> },
          { path: '/levels/:id', element: <LevelDetailPage /> },
          { path: '/topics', element: <TopicListPage /> },
          { path: '/topics/:id', element: <TopicDetailPage /> },
          { path: '/lessons', element: <LessonListPage /> },
          { path: '/lessons/new', element: <LessonCreatePage /> },
          { path: '/lessons/:id', element: <LessonDetailPage /> },
          { path: '/vocabularies', element: <VocabularyListPage /> },
          { path: '/grammars', element: <FeaturePlaceholder title="Ngữ pháp" /> },
          { path: '/quizzes', element: <FeaturePlaceholder title="Bài kiểm tra" /> },
          { path: '/users', element: <UserListPage /> },
          { path: '/users/:id', element: <UserDetailPage /> },
          { path: '/reports', element: <LearningReportPage /> },
          { path: '/settings', element: <SystemSettingsPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
