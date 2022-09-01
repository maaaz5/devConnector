import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Dashboard from "./components/dashboard/Dashboard";
import Alert from "./components/layout/Alert";
import "./App.css";
import PrivateRoute from "./components/routing/PrivateRoute";
import { Fragment, useEffect } from "react";
import setAuthToken from "./utils/setAuthToken";
//redux
import { Provider } from "react-redux";
import store from "./store";
import { loadUser } from "./actions/auth";
import CreateProfile from "./components/profile-forms/CreateProfile";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
          </Routes>
          <section className="container">
            <Alert />
            <Routes>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/create-profile"
                element={
                  <PrivateRoute>
                    <CreateProfile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
            </Routes>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
}

export default App;
