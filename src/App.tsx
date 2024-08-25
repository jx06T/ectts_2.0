import { useState } from 'react';
import './App.css';
import MainBlock from "./components/MainBlock"
import Sidebar from './components/Sidebar';
import { SolarSiderbarBold } from './utils/Icons'

function App() {
  return (
    <div className=" App w-full xs:h-screen h-full flex">
      <Sidebar ></Sidebar>
      <MainBlock></MainBlock>
    </div>
  );
}

export default App;
