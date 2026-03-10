import { createRouter } from "@tanstack/react-router";
import { rootRoute, indexRoute, loginRoute, registerRoute, productsRoute, productDetailRoute } from "./routes";


const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
  productsRoute,
  productDetailRoute,
]);

const router = createRouter({ routeTree });

export default router;
