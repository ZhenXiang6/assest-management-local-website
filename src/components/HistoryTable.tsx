import { HistoricalData } from '@/types';

interface Props {
  historicalData: HistoricalData[];
  onEdit: (data: HistoricalData) => void;
  onDelete: (date: string) => void;
}

export default function HistoryTable({ historicalData, onEdit, onDelete }: Props) {
  const allCategories = Array.from(
    historicalData.reduce((acc, data) => {
      Object.keys(data).forEach(key => {
        if (key !== 'date' && key !== 'totalValue') {
          acc.add(key);
        }
      });
      return acc;
    }, new Set<string>())
  );

  const formatCurrency = (value: number | undefined) => {
    if (value === undefined || value === null) {
      return (0).toLocaleString('en-US', { style: 'currency', currency: 'TWD', minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }
    return value.toLocaleString('en-US', { style: 'currency', currency: 'TWD', minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  return (
    <table className="table table-striped mt-3">
      <thead>
        <tr>
          <th>Date</th>
          <th>Total Value</th>
          {allCategories.map(category => (
            <th key={category}>{category}</th>
          ))}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {historicalData.map((data) => (
          <tr key={data.date}>
            <td>{data.date}</td>
            <td>{formatCurrency(data.totalValue)}</td>
            {allCategories.map(category => (
              <td key={category}>{formatCurrency(data[category] as number | undefined)}</td>
            ))}
            <td>
              <button className="btn btn-sm btn-warning me-2" onClick={() => onEdit(data)}>Edit</button>
              <button className="btn btn-sm btn-danger" onClick={() => onDelete(data.date)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
