import React from "react";
import { AuthPage } from "./pages/AuthPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Add CSS import
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { GoogleAuthWrapper } from "./Wrapper/GoogleAuthWrapper";
import { Navbar1 } from "./components/navbar1";
import { PageNotFound } from "./pages/PageNotFound";

function App() {
  return (
    <>
      <ToastContainer />
      <Navbar1 />
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route
          path="/login"
          element={
            <GoogleAuthWrapper>
              <AuthPage />
            </GoogleAuthWrapper>
          }
        />
        <Route
          path="/register"
          element={
            <GoogleAuthWrapper>
              <AuthPage />
            </GoogleAuthWrapper>
          }
        />
        <Route
          path="/auth"
          element={
            <GoogleAuthWrapper>
              <AuthPage />
            </GoogleAuthWrapper>
          }
        />
        <Route path="*" element={<PageNotFound/>}/> 
      </Routes>
    </>
  );
}

export default App;
