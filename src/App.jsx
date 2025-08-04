import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './components/Main';
import History from './components/History';
import './style.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Main />} />
        <Route path='/history' element={<History />} />
      </Routes>
    </Router>
  );
}

export default App;
