import { useEffect, useRef, useState } from 'react';
import './App.css';
import MainBlock from "./components/MainBlock"
import Sidebar from './components/Sidebar';
import { SolarSiderbarBold } from './utils/Icons'
import { NotifyProvider } from './components/NotifyContext';

function App() {
  const rootRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleResize = () => {
      if (rootRef.current) {
        rootRef.current.style.height = `${window.innerHeight}px`;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <NotifyProvider>
      <div ref={rootRef} className={` App w-full h-full flex relative`}>
        <Sidebar ></Sidebar>
        <MainBlock></MainBlock>
      </div>
    </NotifyProvider>
  );
}

export default App;
