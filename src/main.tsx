import "@arco-design/web-react/dist/css/arco.css";
import ReactDOM from 'react-dom/client'
import './index.scss';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import SignIn from './pages/auth/SignIn.tsx';
import SignUp from './pages/auth/SignUp.tsx';
import ErrorPage from './pages/Error.tsx';
import Editor from './pages/Editor.tsx';
import Home from './pages/home.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/sign-in",
    element: <SignIn />,
  },
  {
    path: "/sign-up",
    element: <SignUp />,
  },
  {
    path: "/editor/:id",
    element: <Editor />,
  },
  {
    path: "*",
    element: <ErrorPage />
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
)
