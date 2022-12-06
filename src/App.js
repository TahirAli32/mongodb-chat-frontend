import { createBrowserRouter, RouterProvider, useRouteError } from "react-router-dom";
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

function ErrorPage(){

  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}

export default App;