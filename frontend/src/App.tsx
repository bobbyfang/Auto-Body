import './App.css'

import Login from './components/Login/Login';
import useToken from './hooks/useToken';
import DashboardLayout from './layouts/dashboard';

function App() {
    const { token, setToken } = useToken();

    if(!token) {
      return (
      <>
        <Login setToken={setToken}/>
      </>)
    }
    return (
      <>
          <DashboardLayout token={token} setToken={setToken} />
      </>
    )
}

export default App
