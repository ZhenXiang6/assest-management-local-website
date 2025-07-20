'use client';

import { useState, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { HistoricalData } from '@/types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface Props {
  historicalData: HistoricalData[];
}

const COLORS = [
  'rgb(255, 99, 132)',
  'rgb(54, 162, 235)',
  'rgb(255, 206, 86)',
  'rgb(75, 192, 192)',
  'rgb(153, 102, 255)',
  'rgb(255, 159, 64)',
];

export default function HistoryChart({ historicalData }: Props) {
  const allCategories = useMemo(() => Array.from(
    historicalData.reduce((acc, data) => {
      Object.keys(data).forEach(key => {
        if (key !== 'date' && key !== 'totalValue') {
          acc.add(key);
        }
      });
      return acc;
    }, new Set<string>())
  ), [historicalData]);

  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Total Value', ...allCategories]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const chartData = useMemo(() => {
    const datasets = selectedCategories.map((category, index) => {
      const isTotal = category === 'Total Value';
      const data = historicalData.map(d => isTotal ? d.totalValue : (d[category] as number || 0));
      const color = isTotal ? 'rgb(0, 0, 0)' : COLORS[allCategories.indexOf(category) % COLORS.length];
      
      return {
        label: category,
        data: data,
        fill: false,
        borderColor: color,
        tension: 0.1,
      };
    });

    return {
      labels: historicalData.map(d => d.date),
      datasets: datasets,
    };
  }, [historicalData, selectedCategories, allCategories]);

  return (
    <div>
      <div className="mb-3">
        <strong>Filter Categories:</strong>
        <div className="form-check form-check-inline ms-2">
          <input
            className="form-check-input"
            type="checkbox"
            id="total-value-check"
            checked={selectedCategories.includes('Total Value')}
            onChange={() => handleCategoryChange('Total Value')}
          />
          <label className="form-check-label" htmlFor="total-value-check">Total Value</label>
        </div>
        {allCategories.map(category => (
          <div className="form-check form-check-inline" key={category}>
            <input
              className="form-check-input"
              type="checkbox"
              id={`${category}-check`}
              checked={selectedCategories.includes(category)}
              onChange={() => handleCategoryChange(category)}
            />
            <label className="form-check-label" htmlFor={`${category}-check`}>{category}</label>
          </div>
        ))}
      </div>
      <Line data={chartData} />
    </div>
  );
}
