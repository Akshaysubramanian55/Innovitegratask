import { BrowserRouter as Router, Route, Routes, Link, useParams, } from 'react-router-dom';
import SignupForm from './Components/Signup/Signup';
import LoginForm from './Components/Login/Login';
import EmployeeDashboard from './Components/Employeedashboard/Employeedashboard';
import ManagerDashboard from './Components/Managerdashboard/Managerdashboard';
import CreateTeam from './Components/Managerdashboard/Createteam';
import Teams from './Components/Managerdashboard/Teams';
import AdminDashboard from './Components/Admindashboard/Admindashboard';
function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' exact element={<LoginForm />} />
        <Route path='/signup' exact element={<SignupForm />} />
        <Route path='/employeedashboard' exact element={<EmployeeDashboard/>}/>
        <Route path='/managerdashboard' exact element={<ManagerDashboard/>}/>
        <Route path='/createteam' exact element={<CreateTeam/>}/>
        <Route path='/teams' exact element={<Teams/>}/>
        <Route path='/admindashboard' exact element={<AdminDashboard/>}/>
      </Routes>
    </Router>
  )
}

export default App
