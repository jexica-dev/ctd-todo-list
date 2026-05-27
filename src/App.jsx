import './App.css';
import { useState } from 'react';
import Header from './shared/Header';
import Logon from './features/Logon';
import TodosPage from './Todos/TodosPage';

function App() {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  return (
    <>
      <div className="app-container">
        <Header />
        <main>
          {token ? (
            <TodosPage token={token} />
          ) : (
            <Logon onSetEmail={setEmail} onSetToken={setToken} />
          )}
        </main>
      </div>
    </>
  );
}

export default App;
