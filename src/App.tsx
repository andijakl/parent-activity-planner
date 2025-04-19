import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { initializeCosmosDB } from './services/cosmosService';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Calendar from './pages/Calendar';
import Friends from './pages/Friends';

function App() {
  useEffect(() => {
    // Initialize CosmosDB connection
    initializeCosmosDB().catch(error => {
      console.error('Failed to initialize CosmosDB:', error);
    });
  }, []);

  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route 
                path="/calendar" 
                element={
                  <PrivateRoute>
                    <Calendar />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/friends" 
                element={
                  <PrivateRoute>
                    <Friends />
                  </PrivateRoute>
                } 
              />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;