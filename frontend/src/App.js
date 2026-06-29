import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import SolverPage from "./pages/SolverPage";
import LicensePage from "./pages/LicensePage";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        
        <Route path="/" element={<Home />} />
        <Route path="/license" element={<LicensePage />} />
        
        <Route path="/solver" element={<SolverPage />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;