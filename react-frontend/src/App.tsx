import { useAuthContext } from "@asgardeo/auth-react";
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';

function App() {
  const { state } = useAuthContext();

  return (
    <>
      {state.isAuthenticated ? <Dashboard /> : <LandingPage />}
    </>
  )
}

export default App
