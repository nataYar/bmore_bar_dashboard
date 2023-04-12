import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Menu from './components/Menu';
import { Events } from './components/Events';
import { Hours } from './components/Hours';
import { Gallery } from './components/Gallery';
import './index.css';
import './styles.css';
import UserContext from './components/UserContext';
import { Dashboard } from './components/Dashboard';

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  const value = {
    user,
    setUser,
  };
  
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

function App() {
  const routes = [
    {
      path: '/',
      element: <Login />
    },
    {
      path: '/dashboard',
      element: <Dashboard />
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
    },
    {
      path: '/gallery',
      element: <Gallery />
    }
  ];

  const routeComponents = routes.map(({path, element}, key) => 
    <Route exact path={path} element={element} key={key} />);
  
    return (
      <UserProvider>
          <Routes>
            {routeComponents} 
          </Routes>
      </UserProvider>
  );
}

export default App;
