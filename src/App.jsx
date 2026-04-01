import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing/Landing';
import Home from './pages/Home/Home';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/developer" element={<Home role="developer" />} />
      <Route path="/designer" element={<Home role="designer" />} />
    </Routes>
  );
}

export default App;
