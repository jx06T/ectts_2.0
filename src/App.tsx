import './App.css';
import { NotifyProvider } from './context/NotifyContext';
import { useNotify } from './context/NotifyContext';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import WordLayout from './page/WordLayout';
import Home from './page/Home';

function NotifyBlock() {
  const { notify, aboutToDisappear } = useNotify();

  if (notify === "") {
    return null
  }

  return <div className=' z-40 fixed top-2 w-full flex flex-grow justify-center'>
    <div className={` ${aboutToDisappear ? " opacity-0" : " opacity-100"} bg-stone-700 w-[min(96%,36rem)] rounded-full px-4 transition-opacity duration-200 text-center`} >
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
          <Route path="/:setId" element={
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
