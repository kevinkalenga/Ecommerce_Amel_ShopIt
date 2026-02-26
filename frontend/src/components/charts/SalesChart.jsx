


import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


export default function SalesChart({ salesDate = [] }) {
  if (!salesDate.length) {
    return <p className="text-center">No sales data</p>;
  }

  const labels = salesDate.map(item =>
    new Date(item._id.date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
    })
  );

  const data = {
    labels,
    datasets: [
      {
        label: 'Sales',
        data: salesDate.map(item => item.totalSales),
        borderColor: '#198753',
      },
      {
        label: 'Orders',
        data: salesDate.map(item => item.numOrder),
        borderColor: 'rgb(220, 52, 69)',
        yAxisID: 'y1',
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        type: 'category',
        ticks: { autoSkip: true },
      },
      y: { position: 'left' },
      y1: {
        position: 'right',
        grid: { drawOnChartArea: false },
      },
    },
  };

  return (
    <div style={{ height: 400 }}>
      <Line data={data} options={options} />
    </div>
  );
}