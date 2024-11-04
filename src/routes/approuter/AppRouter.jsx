import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "../../components/auth/Login";
import SignUp from "../../components/auth/SignUp";
import Home from "../../components/pages/home/Home";
import NotesPage from "../../components/pages/notepage/NotesPage";
import ProtectedRoute from "../protuctedrouter/ProtectedRoute";
import { NotesProvider } from "../../components/context/NoteContext";

const AppRouter = () => {
  return (
    <NotesProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notes"
            element={
              <ProtectedRoute>
                <NotesPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </NotesProvider>
  );
};

export default AppRouter;
