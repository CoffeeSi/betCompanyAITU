import { Route, Routes } from "react-router-dom"
import { ROUTES } from "./routePaths";
import HomePage from "@/pages/HomePage/HomePage"
import EventPage from "@/pages/EventPage/EventPage";
import ProfilePage from "@/pages/ProfilePage/ProfilePage";
import LoginPage from "@/pages/LoginPage/LoginPage";
import RegisterPage from "@/pages/RegisterPage/RegisterPage";
import NotFoundPage from "@/pages/NotFoundPage/NotFoundPage";

export const AppRouter = () => (
    <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />}/>
        <Route path={ROUTES.EVENT} element={<EventPage />}/>
        <Route path={ROUTES.PROFILE} element={<ProfilePage />}/>
        <Route path={ROUTES.LOGIN} element={<LoginPage />}/>
        <Route path={ROUTES.REGISTER} element={<RegisterPage />}/>
        <Route path="*" element={<NotFoundPage />}/>
    </Routes>
);