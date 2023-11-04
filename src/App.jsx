import './App.css'
import { BrowserRouter as Router } from "react-router-dom";
import { HeaderNav } from './components/HeaderNav';
import { MyRoutes } from './components/MyRoutes';

function App() {

  return (
    <>
    <Router>
      <HeaderNav/>
      <div className="bk">
        <MyRoutes/>
      </div>
    </Router>
    </>
  )
}

export default App
