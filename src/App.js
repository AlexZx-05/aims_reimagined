import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Inbox from "./pages/Inbox";
import Calendar from "./pages/Calendar";
import Dashboard from "./pages/Dashboard";
import Account from "./pages/Account";
import Grades from "./pages/Grades";
import Scholarships from "./pages/Scholarships";
import Favorites from "./pages/Favorites";
import Complaints from "./pages/Complaints";
import Placements from "./pages/Placements";
import Registration from "./pages/Registration";
import CourseRegistration from "./pages/CourseRegistration";
import { getLoggedInUser } from "./utils/auth";

export default function App() {
  const ProtectedRoute = ({ children }) => {
    const user = getLoggedInUser();
    return user ? children : <Login />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/registration"
          element={
            <ProtectedRoute>
              <Registration />
            </ProtectedRoute>
          }
        />

        <Route
          path="/course-registration"
          element={
            <ProtectedRoute>
              <CourseRegistration />
            </ProtectedRoute>
          }
        />


        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />

        <Route
          path="/grades"
          element={
            <ProtectedRoute>
              <Grades />
            </ProtectedRoute>
          }
        />

          <Route
            path="/scholarship"
            element={
              <ProtectedRoute>
                <Scholarships />
              </ProtectedRoute>
            }
          />

          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            }
          />

          <Route
            path="/complaints"
            element={
              <ProtectedRoute>
                <Complaints />
              </ProtectedRoute>
            }
          />

            <Route
              path="/placements"
              element={
                <ProtectedRoute>
                  <Placements />
                </ProtectedRoute>
              }
            />


        <Route
          path="/inbox"
          element={
            <ProtectedRoute>
              <Inbox />
            </ProtectedRoute>
          }
        />

        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <Calendar />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}