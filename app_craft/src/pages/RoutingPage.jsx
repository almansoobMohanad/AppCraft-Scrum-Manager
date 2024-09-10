import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import AccountPage from './AccountPage';
import SprintBacklog from './SprintBacklog';
import AdminView from './AdminView';
import { NotFoundPage } from './NotFoundPage';

export default function RoutingPage() {
    <Router>
        <Routes>
            <Route path="/" element={<NavigationBar />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/sprint-backlog" element={<SprintBacklog />} />
            <Route path="/admin-view" element={<AdminView />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    </Router>
}