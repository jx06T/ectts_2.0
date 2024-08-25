import { useState } from 'react';
import './App.css';
import MainBlock from "./components/MainBlock"
import Sidebar from './components/Sidebar';
import { SolarSiderbarBold } from './utils/Icons'

function App() {
  const [showSidebar, setShowSidebar] = useState<boolean>(true)
  const handleSidebarClick = (newValue: boolean): void => {
    setShowSidebar(newValue)
  }
  return (
    <div className=" App w-full max-h-screen flex flex-col">
      <div className='flex-grow flex bg-slate-25 overflow-hidden'>
        {/* {!showSidebar && <div className=' fixed h-6 m-2'> */}
        <div className={` ${showSidebar ? "w-0" : "w-4 mt-[0.6rem] m-1 ml-2"} flex h-6 transition-all duration-300 ease-in-out `}>
          <SolarSiderbarBold onClick={() => setShowSidebar(!showSidebar)} />
        </div>
        <Sidebar showSidebar={showSidebar} clickCallback={handleSidebarClick}></Sidebar>
        <MainBlock></MainBlock>
      </div>
      <div className=' flex-shrink-0 h-20 bg-black'>

      </div>
    </div>
  );
}

export default App;
