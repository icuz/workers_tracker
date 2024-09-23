import React, { useEffect, useState } from 'react';

interface WorkerInfoProps {
  workerId: string;
}

interface WorkerData {
  _id: {
    $oid: string;
  };
  name: string;
  email: string;
  role: string;
  site: null;
  employeeInfo: {
    jobTitle: string;
    startDate: {
      $date: string;
    };
  };
  createdAt: {
    $date: string;
  };
  __v: number;
}

const WorkerInfo: React.FC<WorkerInfoProps> = ({ workerId }) => {
  const [workerData, setWorkerData] = useState<WorkerData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkerData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/users/${workerId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setWorkerData(data);
      } catch (error) {
        setError('Failed to fetch worker data');
        console.error('Error fetching worker data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkerData();
  }, [workerId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Worker Information</h2>
        <img src="https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png" alt="Static Image" style={{height:'150px'}}/>
      <p><strong>Name:</strong> {workerData?.name}</p>
      <p><strong>Email:</strong> {workerData?.email}</p>
      <p><strong>Role:</strong> {workerData?.role}</p>
      <p><strong>Job Title:</strong> {workerData?.employeeInfo.jobTitle}</p>
    </div>
  );
};

export default WorkerInfo;