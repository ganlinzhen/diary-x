import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import Dashboard from '../pages/Dashboard'
import DiaryEdit from '../pages/DiaryEdit'
import TopicList from '../pages/TopicList'
import TopicDetail from '../pages/TopicDetail'
import PlanList from '../pages/PlanList'
import PlanDetail from '../pages/PlanDetail'
import AnniversaryList from '../pages/AnniversaryList'

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="diary" element={<DiaryEdit />} />
          <Route path="diary/:date" element={<DiaryEdit />} />
          <Route path="topics" element={<TopicList />} />
          <Route path="topics/:id" element={<TopicDetail />} />
          <Route path="plans" element={<PlanList />} />
          <Route path="plans/:id" element={<PlanDetail />} />
          <Route path="anniversaries" element={<AnniversaryList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
