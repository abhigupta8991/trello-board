import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import ProjectBoard from './components/pages/project';
import BoardWrapper from './components/pages/boards';
import SignUp from './components/pages/signUp';
import PrivateRoute from './components/pages/PrivateRoute';
import Login from './components/pages/logIn';

import Header from './components/molecules/header';
import AuthProvider from './firebase/AuthProvider';

import './App.css';

const App = () => {
  const router = createBrowserRouter([
    {
      path: '/trello-board/',
      element: <Header />,
      children: [
        {
          path: '/login/trello-board/',
          element: <Login />
        },
        {
          path: '/signup/trello-board/',
          element: <SignUp />
        },
        {
          path: '/trello-board/',
          element: (
            <PrivateRoute>
              <BoardWrapper />
            </PrivateRoute>
          )
        },
        {
          path: 'trello-board//projects/*',
          element: (
            <PrivateRoute>
              <ProjectBoard />
            </PrivateRoute>
          )
        },
      ],
    },
  ]);
  
  return (
    <div>
      <AuthProvider>
        <DndProvider backend={HTML5Backend}>
          <RouterProvider router={router} />;
        </DndProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
