import {Route, Switch, Redirect} from 'react-router-dom'
import LoginForm from './Components/Login'
import Home from './Components/Home'
import AllJobs from './Components/AllJobs'
import AboutJob from './Components/AboutJobItem'
import NotFound from './Components/NotFound'
import ProtectedRoute from './Components/ProtectedRoute'
import './App.css'

const App = () => (
  <Switch>
    <Route exact path="/login" component={LoginForm} />
    <ProtectedRoute exact path="/" component={Home} />
    <ProtectedRoute exact path="/jobs" component={AllJobs} />
    <ProtectedRoute exact path="/jobs/:id" component={AboutJob} />
    <Route path="/not-found" component={NotFound} />
    <Redirect to="not-found" />
  </Switch>
)

export default App
