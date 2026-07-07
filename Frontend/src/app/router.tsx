import { createBrowserRouter, Navigate } from 'react-router';
import { AppLayout } from '@/shared/layout/AppLayout';
import { AuthGuard, GuestGuard } from '@/features/auth/AuthGuard';
import { ROUTES } from '@/shared/constants/routes';

import LandingPage from '@/pages/landing/LandingPage';
import LoginPage from '@/pages/auth/LoginPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import FinanceOverviewPage from '@/pages/finance/FinanceOverviewPage';
import TransactionsPage from '@/pages/finance/TransactionsPage';
import BudgetsPage from '@/pages/finance/BudgetsPage';
import DebtsPage from '@/pages/debts/DebtsPage';
import DebtPeoplePage from '@/pages/debts/DebtPeoplePage';
import DebtCalculatorPage from '@/pages/debts/DebtCalculatorPage';
import TodosPage from '@/pages/todos/TodosPage';
import GoalsPage from '@/pages/goals/GoalsPage';
import TimelinePage from '@/pages/timeline/TimelinePage';
import JournalPage from '@/pages/journal/JournalPage';
import JournalEditorPage from '@/pages/journal/JournalEditorPage';
import MediaLibraryPage from '@/pages/media/MediaLibraryPage';
import AlbumsPage from '@/pages/media/AlbumsPage';
import InterestsPage from '@/pages/interests/InterestsPage';
import LearningDashboardPage from '@/pages/learning/LearningDashboardPage';
import VocabularyPage from '@/pages/learning/VocabularyPage';
import FlashcardsPage from '@/pages/learning/FlashcardsPage';
import MockTestsPage from '@/pages/learning/MockTestsPage';
import StudyPlanPage from '@/pages/learning/StudyPlanPage';
import ProfilePage from '@/pages/profile/ProfilePage';
import BiographyPage from '@/pages/profile/BiographyPage';
import SettingsPage from '@/pages/settings/SettingsPage';
import NotFoundPage from '@/pages/NotFoundPage';

function PrivateLayout() {
  return (
    <AuthGuard>
      <AppLayout />
    </AuthGuard>
  );
}

export const router = createBrowserRouter([
  { path: ROUTES.LANDING, element: <LandingPage /> },
  {
    path: ROUTES.LOGIN,
    element: (
      <GuestGuard>
        <LoginPage />
      </GuestGuard>
    ),
  },
  {
    element: <PrivateLayout />,
    children: [
      { path: ROUTES.DASHBOARD, element: <DashboardPage /> },
      { path: ROUTES.FINANCE, element: <FinanceOverviewPage /> },
      { path: ROUTES.FINANCE_TRANSACTIONS, element: <TransactionsPage /> },
      { path: ROUTES.FINANCE_BUDGETS, element: <BudgetsPage /> },
      { path: ROUTES.DEBTS, element: <DebtsPage /> },
      { path: ROUTES.DEBTS_PEOPLE, element: <DebtPeoplePage /> },
      { path: ROUTES.DEBTS_CALCULATOR, element: <DebtCalculatorPage /> },
      { path: ROUTES.TODOS, element: <TodosPage /> },
      { path: ROUTES.GOALS, element: <GoalsPage /> },
      { path: ROUTES.TIMELINE, element: <TimelinePage /> },
      { path: ROUTES.JOURNAL, element: <JournalPage /> },
      { path: ROUTES.JOURNAL_NEW, element: <JournalEditorPage /> },
      { path: `${ROUTES.JOURNAL}/:id`, element: <JournalEditorPage /> },
      { path: ROUTES.MEDIA, element: <MediaLibraryPage /> },
      { path: ROUTES.MEDIA_ALBUMS, element: <AlbumsPage /> },
      { path: ROUTES.INTERESTS, element: <InterestsPage /> },
      { path: ROUTES.LEARNING, element: <LearningDashboardPage /> },
      { path: ROUTES.LEARNING_VOCABULARY, element: <VocabularyPage /> },
      { path: ROUTES.LEARNING_FLASHCARDS, element: <FlashcardsPage /> },
      { path: ROUTES.LEARNING_MOCK_TESTS, element: <MockTestsPage /> },
      { path: ROUTES.LEARNING_STUDY_PLAN, element: <StudyPlanPage /> },
      { path: ROUTES.PROFILE, element: <ProfilePage /> },
      { path: ROUTES.PROFILE_BIOGRAPHY, element: <BiographyPage /> },
      { path: ROUTES.SETTINGS, element: <SettingsPage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);
