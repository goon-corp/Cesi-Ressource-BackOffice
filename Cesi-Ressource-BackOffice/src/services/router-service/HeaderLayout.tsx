import { Outlet } from "react-router-dom";
import Header from "./Header";

export function HeaderLayout() {
  return (
    <div>
      <Header></Header>
      <Outlet />
    </div>
  );
}
