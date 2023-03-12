import { Route, Router, Routes } from "react-router-dom";
import { Homepage, DetailPenagihan } from "./pages";

export const App = () => {
  return (
    <Routes>
      <Route path="/homepage" element={<Homepage />} />
      <Route path="/detail-penagihan" element={<DetailPenagihan />} />
      <Route path="*" element={<h1>Not Found</h1>} />
    </Routes>
  );
};
