import { Route, Routes } from 'react-router-dom';
import './App.css';
import ChatContainer from './Container/ChatArea/ChatContainer';
import { Login } from './Container/Login/Login';
import Register from './Container/Login/Register';
import { useSelector } from 'react-redux';
import { GetAllUsers } from './Container/AllUser/GetAllUsers';

function App() {
  const toogleTheam = useSelector((state) => state.toogle.value);
  return (
    <div className="App">
      <header className={`App-header ${ toogleTheam ? " white-bg1" : ""}`}>
          <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/home' element={<ChatContainer />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
          </Routes>
      </header>
    </div>
  );
}

export default App;
