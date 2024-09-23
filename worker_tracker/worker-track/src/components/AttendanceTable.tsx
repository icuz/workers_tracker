import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { format, parseISO } from 'date-fns';

interface AttendanceData {
  _id: string;
  workerId: string;
  createdAt: string;
  location?: { lat: number; lng: number };
  checkInImage: string;
  checkOutImage?: string;
}

interface AttendanceTableProps {
  workerId: string;
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({ workerId }) => {
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/attendance/user/${workerId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setAttendanceData(data);
      } catch (error) {
        setError('Failed to fetch attendance data');
        console.error('Error fetching attendance data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [workerId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date & Time</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Check-In Photo</TableCell>
            <TableCell>Check-Out Photo</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {attendanceData.map((row) => {
            const parsedDate = parseISO(row.createdAt);
            return (
              <TableRow key={row._id}>
                <TableCell>{isNaN(parsedDate.getTime()) ? 'Invalid Date' : format(parsedDate, 'PPpp')}</TableCell>
                <TableCell>
                  {row.location ? `Lat: ${row.location.lat}, Lng: ${row.location.lng}` : 'Location not available'}
                </TableCell>
                <TableCell>
                  {row.checkInImage ? <img src={row.checkInImage} alt="Check-In" width="100" height="100" /> : 'No Check-In Image'}
                </TableCell>
                <TableCell>
                  {row.checkOutImage ? <img src={row.checkOutImage} alt="Check-Out" width="100" /> : 'No Check-Out Image'}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AttendanceTable;