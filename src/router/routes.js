import { RootRoute, Route, redirect } from "@tanstack/react-router";
import RootLayout from "../pages/RootLayout";
import LoginPage from "../pages/LoginPage/LoginPage";
import RegisterPage from "../pages/RegisterPage/RegisterPage";
import ProductListPage from "../pages/ProductListPage/ProductListPage";
import ProductDetailPage from "../pages/ProductDetailPage/ProductDetailPage";

export const rootRoute = new RootRoute({
    component: RootLayout,
});

export const indexRoute = new Route({
    getParentRoute: () => rootRoute,
    path: "/",
    beforeLoad: () => {
        throw redirect({
            to: "/login",
        });
    },
});

export const loginRoute = new Route({
    getParentRoute: () => rootRoute,
    path: "/login",
    component: LoginPage,
});

export const registerRoute = new Route({
    getParentRoute: () => rootRoute,
    path: "/register",
    component: RegisterPage,
});

export const productsRoute = new Route({
    getParentRoute: () => rootRoute,
    path: "/products",
    component: ProductListPage,
});

export const productDetailRoute = new Route({
    getParentRoute: () => rootRoute,
    path: "/product/$slug",
    component: ProductDetailPage,
});
