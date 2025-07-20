'use client';

import { useState, useEffect, forwardRef } from 'react';

interface Props {
  rates: Record<string, number>;
  onUpdate: (newRates: Record<string, number>) => void;
}

const EditRatesModal = forwardRef<HTMLDivElement, Props>(({ rates, onUpdate }, ref) => {
  const [editableRates, setEditableRates] = useState<Record<string, string>>({});

  useEffect(() => {
    const stringRates: Record<string, string> = {};
    for (const currency in rates) {
      stringRates[currency] = String(rates[currency]);
    }
    setEditableRates(stringRates);
  }, [rates]);

  const handleRateChange = (currency: string, value: string) => {
    setEditableRates(prev => ({ ...prev, [currency]: value }));
  };

  const handleSubmit = () => {
    const numericRates: Record<string, number> = {};
    for (const currency in editableRates) {
      numericRates[currency] = parseFloat(editableRates[currency]) || 0;
    }
    onUpdate(numericRates);
  };

  return (
    <div className="modal fade" id="editRatesModal" tabIndex={-1} aria-labelledby="editRatesModalLabel" aria-hidden="true" ref={ref}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="editRatesModalLabel">Edit Exchange Rates</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <form>
              {Object.entries(editableRates).map(([currency, rate]) => (
                <div className="mb-3" key={currency}>
                  <label htmlFor={`rate-${currency}`} className="form-label">
                    {currency === 'USD' || currency === 'CNY' ? `${currency} to TWD` : `${currency} to USD`}
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id={`rate-${currency}`}
                    value={rate}
                    onChange={(e) => handleRateChange(currency, e.target.value)}
                  />
                </div>
              ))}
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" className="btn btn-primary" onClick={handleSubmit} data-bs-dismiss="modal">Update Rates</button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default EditRatesModal;
