import { Route, Routes } from "react-router-dom"
import { ROUTES } from "./routePaths";
import HomePage from "@/pages/HomePage/HomePage"
import LoginPage from "@/pages/LoginPage/LoginPage";
import RegisterPage from "@/pages/RegisterPage/RegisterPage";
// import ForgotPasswordPage from "@/pages/ForgotPasswordPage/ForgotPasswordPage";

export const AppRoutes = () => (
    <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />}/>
        <Route path={ROUTES.LOGIN} element={<LoginPage />}/>
        <Route path={ROUTES.REGISTER} element={<RegisterPage />}/>
        {/* <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />}/> */}
    </Routes>
);