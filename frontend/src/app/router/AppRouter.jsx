import { Route, Routes } from "react-router-dom"
import { ROUTES } from "./routePaths";
import HomePage from "@/pages/HomePage/HomePage"
import LoginPage from "@/pages/LoginPage/LoginPage";
import RegisterPage from "@/pages/RegisterPage/RegisterPage";
import BetPage from "@/pages/BetPage/BetPage";

export const AppRouter = () => (
    <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />}/>
        <Route path={ROUTES.LOGIN} element={<LoginPage />}/>
        <Route path={ROUTES.REGISTER} element={<RegisterPage />}/>
        <Route path={ROUTES.BET} element={<BetPage />}/>
    </Routes>
);