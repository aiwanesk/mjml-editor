import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { DashboardPage } from "@/pages/DashboardPage";
import { EditorPage } from "@/pages/EditorPage";

export default function App() {
  return (
    <>
      <Toaster position="bottom-right" richColors />
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/editor/:id" element={<EditorPage />} />
      </Routes>
    </>
  );
}
