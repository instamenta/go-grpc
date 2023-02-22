import { GuestGuard } from './guards/GuestGuard';
import { UserGuard } from './guards/UserGuard';
import { Routes, Route } from 'react-router-dom';
import { Home } from './components/Home/Home';
import './App.css';
import { Navbar } from './components/Navbar/Navbar';
import { Login } from './components/Login/Login';
import { Register } from './components/Register/Register';
import { Catalog } from './components/Catalog/Catalog';



function App() {
  return (
    <div className="App">
      <Navbar></Navbar>

    <main className='main'>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/user/login' element={<Login/>}></Route>
        <Route path='/user/register' element={<Register/>}></Route>

        <Route path='/catalog' element={<Catalog/>}></Route>

      </Routes>

      
    </main>
    </div>
  );
}

export default App;
