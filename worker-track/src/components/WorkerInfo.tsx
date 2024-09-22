import React from 'react';

interface WorkerInfoProps {
    name: string;
    position: string;
    department: string;
}

const WorkerInfo: React.FC<WorkerInfoProps> = ({ name = "Ramesh", position = "Engineer", department = "electrical" }) => {
    return (
        <div>
            <h2>Worker Information</h2>
            <p><strong>Name:</strong> {name}</p>
            <p><strong>Position:</strong> {position}</p>
            <p><strong>Department:</strong> {department}</p>
        </div>
    );
};

export default WorkerInfo;