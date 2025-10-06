import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import List from "./pages/List";
import New from "./pages/New";
import Edit from "./pages/Edit";
import Detail from "./pages/Detail";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <nav className="border-b bg-white">
          <div className="max-w-6xl mx-auto p-4 flex items-center gap-4">
            <Link to="/" className="font-semibold">Doznaka PWA</Link>
            <Link to="/" className="text-sm text-gray-600">Popis</Link>
            <Link to="/nova" className="text-sm text-gray-600">Nova</Link>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<List />} />
          <Route path="/nova" element={<New />} />
          <Route path="/uredi/:id" element={<Edit />} />
          <Route path="/pregled/:id" element={<Detail />} />
          <Route path="*" element={<div className="p-6">404</div>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}