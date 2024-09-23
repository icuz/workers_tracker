import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import Attendance from './components/Attendance';
import AttendanceTable from './components/AttendanceTable';
import WorkPost from './components/WorkPost';
import Logout from './components/Logout';
import WorkerInfo from './components/WorkerInfo';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <AppBar position="static" style={{borderRadius:'8px'}}>
          <Toolbar className="nav-bar">
            <Typography variant="h6" className='app-name'>Worker Track</Typography>
            <Button color="inherit" component={Link} to="/">Home</Button>
            <Button color="inherit" component={Link} to="/worker/:workerId/attendance">Take Attendance</Button>
            <Button color="inherit" component={Link} to="/worker/:workerId/attendance-table">Attendance Table</Button>
            <Button color="inherit" component={Link} to="/work-post">Post Work</Button>
            <Button color="inherit" component={Link} to="/logout">Logout</Button>
          </Toolbar>
        </AppBar>

        <div className="content">
          <Routes>
            <Route path="/" element={<WorkerInfo workerId='66f110667d541be733b694bb'/>} />
            <Route path="/worker/:workerId/attendance" element={<Attendance />} />
            <Route path="/worker/:workerId/attendance-table" element={<AttendanceTable workerId='66f110667d541be733b694bb'/>} />
            <Route path="/work-post" element={<WorkPost siteId='66f119b51a80d5b3a149634e'/>} />
            <Route path="/logout" element={<Logout />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;