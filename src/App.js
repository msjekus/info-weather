
import './App.css';
import { BrowserRouter, Router, Route, Routes } from 'react-router-dom';
import WeatherForm from './components/WeatherForm';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='' element={<WeatherForm />}></Route>
        {/* <Route path='weather' element={<WeatherForm />}></Route> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
