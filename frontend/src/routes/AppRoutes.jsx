import { Route, Routes } from "react-router-dom"
import { ROUTES } from "./routePaths";
import HomePage from "@/pages/HomePage/Home"

export const AppRoutes = () => (
    <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />}/>
    </Routes>
);