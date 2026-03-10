import { createRouter } from "@tanstack/react-router";
import { rootRoute, loginRoute, registerRoute, productsRoute, productDetailRoute } from "./routes";


const routeTree = rootRoute.addChildren([
  loginRoute,
  registerRoute,
  productsRoute,
  productDetailRoute,
]);

const router = createRouter({ routeTree });

export default router;
