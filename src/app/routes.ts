import { createHashRouter } from "react-router";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import LocationSelection from "./pages/LocationSelection";
import HistorySelection from "./pages/HistorySelection";
import LocationWork from "./pages/LocationWork";
import AdminPanel from "./pages/AdminPanel";
import QueueWork from "./pages/QueueWork";

export const router = createHashRouter([
  {
    path: "/",
    Component: Login,
  },
  {
    path: "/dashboard",
    Component: Dashboard,
  },
  {
    path: "/location-selection",
    Component: LocationSelection,
  },
  {
    path: "/history-selection",
    Component: HistorySelection,
  },
  {
    path: "/location-work",
    Component: LocationWork,
  },
  {
    path: "/queue-work",
    Component: QueueWork,
  },
  {
    path: "/admin",
    Component: AdminPanel,
  },
]);
