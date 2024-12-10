import './App.css';
import { NotifyProvider } from './context/NotifyContext';
import { useNotify } from './context/NotifyContext';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

import WordLayout from './page/WordLayout';
import Home from './page/Home';
import Profile from './page/Profile';

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
          <Route path="/account" element={
            <Profile />
          } />
          <Route path="/sets-management" element={
            <Profile />
          } />
          <Route path="/general-settings" element={
            <Profile />
          } />
          <Route path="/guidance" element={
            <Profile />
          } />
          <Route path="/privacy" element={
            <Profile />
          } />
          <Route path="/contact" element={
            <Profile />
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </NotifyProvider>
    </Router>
  );
}

export default App;
