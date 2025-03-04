import './App.css';
import SmmCards from './components/SmmCards';
import SideNav from './components/SideNav';

function App() {
  return (
    <div className="App">
      <div className='flex'>
        <SideNav />
        <SmmCards />
      </div>
    </div>
  );
}

export default App;
