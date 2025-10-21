import { BrowserRouter, Routes, Route } from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute"
import Login from "./components/Login"
import Home from "./pages/Announcements"
import Create from "./components/Create"
import Layout from "./components/Layout"
import Dashboard from "./pages/Dashboard"
import Colors from "./pages/Colors"
import Schedule from "./pages/Schedule"
import Resources from "./pages/Resources"
import Announcements from "./pages/Announcements"
import TV from "./tv/TV"
import { AuthProvider } from './components/AuthContext';
import "./App.css"

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          {/* <Route element={<ProtectedRoute />}> */}
          <Route path="/" element={<Layout />}>
            <Route element={<Dashboard />} path="/dashboard" />
            <Route element={<Schedule />} path="/schedule" />
            <Route element={<Announcements />} path="/announcements" />
            <Route element={<Colors />} path="/colors" />
            <Route element={<Resources />} path="/resources" />
            {/* <Route element={<Create />} path="/create" /> */}
          </Route>
          <Route element={<TV />} path="/tv"></Route>
          {/* </Route> */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;