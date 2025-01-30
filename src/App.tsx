import React, { Suspense } from 'react';
import './App.css';
import { NotifyProvider } from './context/NotifyContext';
import { useNotify } from './context/NotifyContext';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

import WordLayout from './page/WordLayout';
import Home from './page/Home';
import Profile from './page/Profile';

const Contact = React.lazy(() => import('./page/Contact'));
const General = React.lazy(() => import('./page/General'));
const Guidance = React.lazy(() => import('./page/Guidance'));
const SetsManagement = React.lazy(() => import('./page/SetsManagement'));
const Privacy = React.lazy(() => import('./page/Privacy'));

function NotifyBlock() {
  const { notify, aboutToDisappear } = useNotify();

  return <div className=' z-60 fixed w-full flex flex-grow justify-center top-[10px]'>
    <div className={`
          absolute transition-all duration-300 cubic-bezier(0.68, -0.55, 0.27, 1.55) 
          bg-stone-700 w-[min(78%,36rem)] rounded-full px-4 text-center
          ${notify === "" ? "-translate-y-9" : "translate-y-0"}
        `}>
      <h2 className=" text-white min-w-36 min-h-6">{notify}</h2>
    </div>
  </div>
}


function App() {

  return (
    <Router>
      <NotifyProvider>
        <NotifyBlock />
        <Suspense fallback={<div className=' w-full h-screen bg-blue-50 text-center pt-36 text-4xl'>Loading...</div>}>
          <Routes>
            <Route path="/set/:setId/:mode?" element={
              <WordLayout />
            } />
            <Route path="/set" element={
              <WordLayout home={true} />
            } />
            <Route path="/" element={
              <Home />
            } />
            <Route path="/home" element={
              <Home />
            } />
            <Route path="/profile" element={
              <Profile />
            } />
            <Route path="/sets-management" element={
              <SetsManagement />
            } />
            <Route path="/general-settings" element={
              <General />
            } />
            <Route path="/guidance" element={
              <Guidance />
            } />
            <Route path="/privacy" element={
              <Privacy />
            } />
            <Route path="/contact" element={
              <Contact />
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </NotifyProvider>
    </Router>
  );
}

export default App;
