import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Menu from './components/Menu';
import { Events } from './components/Events';
import { Hours } from './components/Hours';
import './index.css';
import './styles.css';

function App() {
  const routes = [
    {
      path: '/',
      element: <Login />
    },
    {
      path: '/menu',
      element: <Menu />
    },
    {
      path: '/events',
      element: <Events />
    },
    {
      path: '/hours',
      element: <Hours />
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
