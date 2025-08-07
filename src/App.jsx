import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './components/Main';
import History from './components/History';
import './style.css';

function App() {
  return (
    <div className='w-96 min-h-[450px] bg-white p-4 z-10 relative'>
      <Router>
        <Routes>
          <Route path='/' element={<Main />} />
          <Route path='/history' element={<History />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
