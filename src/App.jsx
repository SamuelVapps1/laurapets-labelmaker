import { NavLink, Route, Routes, Navigate } from "react-router-dom";
import NewLabel from "./pages/NewLabel.jsx";
import Library from "./pages/Library.jsx";
import PrintView from "./pages/Print.jsx";

const linkClass = ({ isActive }) =>
  `px-3 py-2 rounded-md text-sm font-medium ${
    isActive ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-200"
  }`;

export default function App() {
  return (
    <div className="min-h-screen">
      <header className="no-print sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold text-slate-900">
              LabelMaker
            </div>
            <div className="text-xs text-slate-500">Offline shelf labels</div>
          </div>
          <nav className="flex items-center gap-2">
            <NavLink to="/new" className={linkClass}>
              New Label
            </NavLink>
            <NavLink to="/library" className={linkClass}>
              Library
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <Routes>
          <Route path="/" element={<Navigate to="/new" replace />} />
          <Route path="/new" element={<NewLabel />} />
          <Route path="/library" element={<Library />} />
          <Route path="/print" element={<PrintView />} />
        </Routes>
      </main>
    </div>
  );
}
