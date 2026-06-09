import './App.css';
import Header from './shared/Header';
import Logon from './features/Logon';
import TodosPage from './features/Todos/TodosPage';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <div className="app-container">
        <Header />
        <main>{isAuthenticated ? <TodosPage /> : <Logon />}</main>
      </div>
    </>
  );
}

export default App;
