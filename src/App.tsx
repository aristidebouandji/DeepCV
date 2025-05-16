import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import InputPage from './pages/InputPage';
import ProcessingPage from './pages/ProcessingPage';
import ResultsPage from './pages/ResultsPage';
import SummaryPage from './pages/SummaryPage';
import { useCVContext } from './context/CVContext';

function App() {
  const { state } = useCVContext();
  const { originalCV, jobOffer } = state;

  // Routing logic with simple guards
  const hasInputs = !!originalCV && !!jobOffer;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/input" element={<InputPage />} />
          <Route 
            path="/processing" 
            element={
              hasInputs ? <ProcessingPage /> : <Navigate to="/input" replace />
            } 
          />
          <Route 
            path="/summary" 
            element={
              state.optimizedCV ? <SummaryPage /> : <Navigate to="/" replace />
            } 
          />
          <Route 
            path="/results" 
            element={
              state.optimizedCV ? <ResultsPage /> : <Navigate to="/" replace />
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;