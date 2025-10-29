import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TeamsPage } from "@/pages/TeamsPage";
import { ExpensesPage } from "@/pages/ExpensesPage";
import "./globals.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TeamsPage />} />
        <Route path="/expenses" element={<ExpensesPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
