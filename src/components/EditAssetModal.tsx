'use client';

import { useState, useEffect, forwardRef } from 'react';
import { Asset } from '@/types';

interface Props {
  asset: Asset | null;
  onUpdate: (asset: Asset) => void;
}

const EditAssetModal = forwardRef<HTMLDivElement, Props>(({ asset, onUpdate }, ref) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [value, setValue] = useState(0);
  const [currency, setCurrency] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (asset) {
      setName(asset.name);
      setCategory(asset.category);
      setValue(asset.value);
      setCurrency(asset.currency);
      setDate(asset.date || '');
    }
  }, [asset]);

  const handleSubmit = () => {
    if (asset) {
      onUpdate({
        ...asset,
        name,
        category,
        value,
        currency,
        date,
      });
    }
  };

  return (
    <div className="modal fade" id="editAssetModal" tabIndex={-1} aria-labelledby="editAssetModalLabel" aria-hidden="true" ref={ref}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="editAssetModalLabel">Edit Asset</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Name</label>
                <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="mb-3">
                <label htmlFor="category" className="form-label">Category</label>
                <input type="text" className="form-control" id="category" value={category} onChange={(e) => setCategory(e.target.value)} />
              </div>
              <div className="mb-3">
                <label htmlFor="value" className="form-label">Value</label>
                <input type="number" className="form-control" id="value" value={value} onChange={(e) => setValue(parseFloat(e.target.value))} />
              </div>
              <div className="mb-3">
                <label htmlFor="currency" className="form-label">Currency</label>
                <input type="text" className="form-control" id="currency" value={currency} onChange={(e) => setCurrency(e.target.value)} />
              </div>
              <div className="mb-3">
                <label htmlFor="date" className="form-label">Date</label>
                <input type="date" className="form-control" id="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" className="btn btn-primary" onClick={handleSubmit} data-bs-dismiss="modal">Update Asset</button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default EditAssetModal;
