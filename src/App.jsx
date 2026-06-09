import './App.css';
import Header from './shared/Header';
import Logon from './features/Logon';
import TodosPage from './features/Todos/TodosPage';
import { Routes, Route } from 'react-router';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <div className="app-container">
        <Header />
        <Routes></Routes>
      </div>
    </>
  );
}

export default App;
