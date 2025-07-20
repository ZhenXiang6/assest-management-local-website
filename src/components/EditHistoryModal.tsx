'use client';

import { useState, useEffect, forwardRef } from 'react';
import { HistoricalData } from '@/types';

interface Props {
  data: HistoricalData | null;
  onUpdate: (data: HistoricalData) => void;
}

const EditHistoryModal = forwardRef<HTMLDivElement, Props>(({ data, onUpdate }, ref) => {
  const [totalValue, setTotalValue] = useState(0);
  const [categories, setCategories] = useState<Record<string, number>>({});

  useEffect(() => {
    if (data) {
      setTotalValue(data.totalValue);
      const newCategories: Record<string, number> = {};
      for (const key in data) {
        if (key !== 'date' && key !== 'totalValue') {
          newCategories[key] = data[key] as number;
        }
      }
      setCategories(newCategories);
    }
  }, [data]);

  const handleSubmit = () => {
    if (data) {
      onUpdate({
        ...data,
        totalValue,
        ...categories,
      });
    }
  };

  const handleCategoryChange = (category: string, value: string) => {
    setCategories((prev) => ({
      ...prev,
      [category]: parseFloat(value),
    }));
  };

  return (
    <div className="modal fade" id="editHistoryModal" tabIndex={-1} aria-labelledby="editHistoryModalLabel" aria-hidden="true" ref={ref}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="editHistoryModalLabel">Edit Historical Data for {data?.date}</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="mb-3">
                <label htmlFor="totalValue" className="form-label">Total Value</label>
                <input type="number" className="form-control" id="totalValue" value={totalValue} onChange={(e) => setTotalValue(parseFloat(e.target.value))} />
              </div>
              {Object.entries(categories).map(([category, value]) => (
                <div className="mb-3" key={category}>
                  <label htmlFor={category} className="form-label">{category}</label>
                  <input type="number" className="form-control" id={category} value={value} onChange={(e) => handleCategoryChange(category, e.target.value)} />
                </div>
              ))}
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" className="btn btn-primary" onClick={handleSubmit} data-bs-dismiss="modal">Update Historical Data</button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default EditHistoryModal;
