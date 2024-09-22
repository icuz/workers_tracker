import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AppBar, Toolbar, Button } from '@mui/material';
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
        <AppBar position="static">
          <Toolbar className="nav-bar">
            <Button color="inherit" component={Link} to="/">Home</Button>
            <Button color="inherit" component={Link} to="/attendance">Take Attendance</Button>
            <Button color="inherit" component={Link} to="/attendance-table">Attendance Table</Button>
            <Button color="inherit" component={Link} to="/work-post">Post Work</Button>
            <Button color="inherit" component={Link} to="/logout">Logout</Button>
          </Toolbar>
        </AppBar>

        <div className="content">
          <Routes>
            <Route path="/" element={<WorkerInfo name="jhon" position='senior engineer' department='Mechanical'/>} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/attendance-table" element={<AttendanceTable />} />
            <Route path="/work-post" element={<WorkPost />} />
            <Route path="/logout" element={<Logout />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
