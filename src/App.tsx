import './App.css';
import MainBlock from "./components/MainBlock"
import Sidebar from './components/Sidebar';

function App() {
  return (
    <div className="App w-full h-full">
      <div className='flex h-full'>
      <Sidebar></Sidebar>
      <MainBlock></MainBlock>
      </div>
    </div>
  );
}

export default App;
