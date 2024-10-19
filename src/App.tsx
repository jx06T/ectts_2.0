import './App.css';
import { NotifyProvider } from './context/NotifyContext';
import { useNotify } from './context/NotifyContext';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import WordLayout from './page/WordLayout';
import Home from './page/Home';

function NotifyBlock() {
  const { notify, aboutToDisappear } = useNotify();

  return <div className=' z-60 fixed w-full flex flex-grow justify-center top-3'>
    <div className={`
          absolute transition-all duration-300 cubic-bezier(0.68, -0.55, 0.27, 1.55) 
          bg-stone-700 w-[min(96%,36rem)] rounded-full px-4 text-center
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
          <Route path="/:setId/:mode?" element={
            <WordLayout />
          } />
          <Route path="/" element={
            <Home />
          } />
        </Routes>
      </NotifyProvider>
    </Router>
  );
}

export default App;
