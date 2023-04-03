import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import './index.css';
import './styles.css';

function App() {
  const routes = [
    {
      path: '/',
      element: <Login/>
    }
  ];

  const routeComponents = routes.map(({path, element}, key) => 
    <Route exact path={path} element={element} key={key} />);
  return (
    <>
      <div className='app'>
        <Routes>
          {routeComponents} 
        </Routes>
      </div>
    </>
  );
}

export default App;
