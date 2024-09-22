import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

interface AttendanceData {
  workerId: string;
  date: string;
  location: { lat: number; lng: number };
  photo: string;
}

const AttendanceTable: React.FC = () => {
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);

  useEffect(() => {
    // Hardcoded data for demonstration
    setAttendanceData([
      {
        workerId: '123',
        date: '2021-09-20T10:00:00Z',
        location: { lat: 37.7749, lng: -122.4194 },
        photo: 'https://randomuser.me/api/portraits/men/37.jpg'
      },
      {
        workerId: '456',
        date: '2021-09-20T11:00:00Z',
        location: { lat: 37.7749, lng: -122.4194 },
        photo: 'https://randomuser.me/api/portraits/men/62.jpg'
      },
      {
        workerId: '789',
        date: '2021-09-20T12:00:00Z',
        location: { lat: 37.7749, lng: -122.4194 },
        photo: 'https://randomuser.me/api/portraits/men/41.jpg'
      }
    ]);
    // // Fetch attendance data from the backend
    // fetch('/api/attendance')
    //   .then(response => response.json())
    //   .then(data => setAttendanceData(data));
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Worker ID</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Photo</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {attendanceData.map((row) => (
            <TableRow key={row.workerId}>
              <TableCell>{row.workerId}</TableCell>
              <TableCell>{new Date(row.date).toLocaleString()}</TableCell>
              <TableCell>{`Lat: ${row.location.lat}, Lng: ${row.location.lng}`}</TableCell>
              <TableCell><img src={row.photo} alt="worker" width="100" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AttendanceTable;
