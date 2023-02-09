import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";

import { Home } from "./pages/home";
import { Demo } from "./pages/demo";
import { Single } from "./pages/single";
import injectContext from "./store/appContext";
import { UserPublic } from "./userComponents/userPublic.jsx";
import { ProfileInfo } from "./userComponents/profileInfo.jsx";
import { ProfileSecurity } from "./userComponents/profileSecurity.jsx";

import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";

//create your first component
const UserLayout = () => {
  //the basename is used when your project is published in a subdirectory and not in the root of the domain
  // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
  const basename = process.env.BASENAME || "";

  return (
    <div>
      <BrowserRouter basename={basename}>
        <ScrollToTop>
          <Navbar />
          <Routes>
            <Route element={<Home />} path="/" />
            <Route element={<UserPublic />} path="/:userid" />
            <Route element={<ProfileInfo />} path="/:userid/profile" />
            <Route element={<UserPublic />} path="/:userid/billing" />
            <Route element={<ProfileSecurity />} path="/:userid/security" />
            <Route element={<UserPublic />} path="/:userid/notifications" />
            <Route element={<Demo />} path="/demo" />
            <Route element={<Single />} path="/single/:theid" />
            <Route element={<h1>Not found!</h1>} />
          </Routes>
          <Footer />
        </ScrollToTop>
      </BrowserRouter>
    </div>
  );
};

export default injectContext(UserLayout);
