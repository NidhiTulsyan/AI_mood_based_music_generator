// In your main App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage.js';
import MoodInput from './components/MoodInput.js';
import Login from './components/Login.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/try" element={<MoodInput />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}
export default App;