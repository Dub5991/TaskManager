// AnalyticsCharts.tsx - Task Analytics Charts
import React from 'react';
import { Card } from 'react-bootstrap';
import { Bar, Pie } from 'react-chartjs-2';
import type { Task } from '../types';

// Chart.js registration for react-chartjs-2 v4+ and Chart.js v3+
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
);

interface AnalyticsChartsProps {
  tasks: Task[];
}

const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ tasks }) => {
  // Calculate completed and pending tasks
  const completed = tasks.filter(t => t.completed).length;
  const pending = tasks.length - completed;
  const categories = Array.from(new Set(tasks.map(t => t.category).filter(Boolean)));

  // Pie chart data for completion
  const pieData = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        data: [completed, pending],
        backgroundColor: ['#28a745', '#ffc107'],
        borderWidth: 1,
      },
    ],
  };

  // Bar chart data for categories
  const barData = {
    labels: categories,
    datasets: [
      {
        label: 'Tasks per Category',
        data: categories.map(cat => tasks.filter(t => t.category === cat).length),
        backgroundColor: '#007bff',
        borderRadius: 6,
      },
    ],
  };

  // Pie chart options (fix legend position type)
  const pieOptions = {
    plugins: {
      legend: {
        display: true,
        position: "bottom" as const, // TypeScript expects a string literal
      },
      title: {
        display: true,
        text: 'Task Completion',
        font: { size: 18 },
      },
    },
    animation: { animateScale: true },
    maintainAspectRatio: false,
  };

  // Bar chart options
  const barOptions = {
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Tasks by Category', font: { size: 16 } },
    },
    scales: {
      x: { title: { display: true, text: 'Category' } },
      y: { title: { display: true, text: 'Tasks' }, beginAtZero: true, precision: 0 },
    },
    animation: { duration: 800 },
    maintainAspectRatio: false,
  };

  return (
    <Card className="mb-4">
      <Card.Header as="h5">Your Progress</Card.Header>
      <Card.Body>
        {tasks.length === 0 ? (
          <div className="text-center text-muted">No tasks to display analytics.</div>
        ) : (
          <>
            <div className="mb-4" style={{ maxWidth: 350, height: 250 }}>
              <Pie data={pieData} options={pieOptions} />
            </div>
            <div style={{ maxWidth: 500, height: 300 }}>
              <Bar data={barData} options={barOptions} />
            </div>
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default AnalyticsCharts;