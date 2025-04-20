import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard/Dashboard';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import supabase from './utils/supabase';
import './App.css';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for active session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };

    checkSession();

    // Set up listener for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="app-container">
        <Navbar session={session} />
        <main className="main-content">
          <div className="container">
            <Routes>
              <Route path="/register" element={!session ? <Register /> : <Navigate to="/dashboard" />} />
              <Route path="/login" element={!session ? <Login /> : <Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={session ? <Dashboard /> : <Navigate to="/login" />} />
              <Route path="/" element={<Navigate to={session ? "/dashboard" : "/login"} />} />
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;