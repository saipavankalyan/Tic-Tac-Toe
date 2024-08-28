import './App.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import Game from './components/Game';
import Mode from './components/Mode';
import OnlineGame from './components/OnlineGame';
import Board from './components/Board';
import Wait from './components/Wait';
import appStore from './utils/appStore';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TOAST_DURATION } from './utils/constants';

const App = () => {
  const appRouter = createBrowserRouter([
    {
      path: '/',
      element: <Game />,
    },
    {
      path: 'onlineGame',
      element: <OnlineGame />,
    },
    {
      path: 'mode',
      element: <Mode />,
    },
    {
      path: 'wait/:roomId',
      element: <Wait />,
    },
    {
      path: 'board/:roomId',
      element: <Board />,
    },
  ]);
  return (
    <Provider store={appStore}>
      <div className="App">
        <h1 className="title">Tic-Tac-Toe</h1>
        <ToastContainer
          theme="dark"
          pauseOnFocusLoss={false}
          pauseOnHover={false}
          autoClose={TOAST_DURATION}
        />
        <RouterProvider router={appRouter} />
      </div>
    </Provider>
  );
};

export default App;
