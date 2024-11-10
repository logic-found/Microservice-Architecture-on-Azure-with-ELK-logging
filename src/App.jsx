import React, { useState } from "react";
import "./App.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FrontPage from "./pages/FrontPage/FrontPage";
import NavBar from "./component/NavBar/NavBar";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";
import Home from "./pages/Home/Home";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import store from "./store/store";

function App() {
  const [darkMode, toggleDarkMode] = useState(true);

  return (
    <Provider store={store}>
        <Router>
          <div className={`app ${darkMode ? "darkMode" : ""}`}>
            <Toaster
              position="right-top"
              // containerStyle={{
              //   position: 'absolute',
              //   top: '80px',
              // }}

              toastOptions={{
                duration: 4000,
                style: {
                  background: "#F5F2F2",
                },
                success: {
                  icon: "✅",
                },
                error: {
                  icon: "❌",
                },
              }}
            />
            <NavBar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            <Routes>
              <Route path="/" element={<FrontPage />} />
              <Route path="/signUp" element={<SignUp />} />
              <Route path="/signIn" element={<SignIn />} />
              <Route path="/:username" element={<Home />} />
            </Routes>
          </div>
        </Router>
    </Provider>
  );
}

export default App;
