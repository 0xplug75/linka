import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import FamilyView from './pages/FamilyView';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/famille/:seniorId" element={<FamilyView />} />
      </Routes>
    </BrowserRouter>
  );
}
