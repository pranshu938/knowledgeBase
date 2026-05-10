import { Routes, Route } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";
import AppLayout from "./layouts/AppLayout";
import DashboardPage from "./pages/Dashboard";
import NotesPage from "./pages/NotesPage";
import UploadsPage from "./pages/UploadsPage";
import ChatPage from "./pages/ChatPage";
import { ProtectedRoute } from "./ProtectedRoute";
import NoteEditorPage from "./pages/NoteEditorPage";

const App: React.FC = () => {
  return (
    <Routes>
      {/* Public site */}
      <Route element={<RootLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Authenticated app area */}
      <Route element={<ProtectedRoute />}>
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="notes" element={<NotesPage />} />
          <Route path="notes/:id" element={<NoteEditorPage />} />
          <Route path="uploads" element={<UploadsPage />} />
          <Route path="chat" element={<ChatPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
