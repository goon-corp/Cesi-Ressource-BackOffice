import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../../pages/login";
import Detail from "../../pages/detail";
import { HeaderLayout } from "./HeaderLayout";
import ForgotPassword from "../../pages/forgotPassword";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        (
        <>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
		  <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/detail" element={<HeaderLayout />}>
            <Route index element={<Detail />} />
          </Route>
        </>
        )
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
