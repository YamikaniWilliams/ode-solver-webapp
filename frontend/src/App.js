import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import SolverPage from "./pages/SolverPage";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* HOME PAGE */}
        <Route path="/" element={<Home />} />

        {/* SOLVER PAGE */}
        <Route path="/solver" element={<SolverPage />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;