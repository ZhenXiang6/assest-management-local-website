'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Asset, HistoricalData } from '@/types';
import AssetTable from '@/components/AssetTable';
import CategoryChart from '@/components/CategoryChart';
import HistoryChart from '@/components/HistoryChart';
import HistoryTable from '@/components/HistoryTable';
import AddAssetModal from '@/components/AddAssetModal';
import EditAssetModal from '@/components/EditAssetModal';
import EditHistoryModal from '@/components/EditHistoryModal';
import EditRatesModal from '@/components/EditRatesModal';

export default function Home() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [editingHistoricalData, setEditingHistoricalData] = useState<HistoricalData | null>(null);
  const [displayCurrency, setDisplayCurrency] = useState('TWD');

  // Modal refs
  const addAssetModalRef = useRef<any>(null);
  const editAssetModalRef = useRef<any>(null);
  const editHistoryModalRef = useRef<any>(null);
  const editRatesModalRef = useRef<any>(null);

  const totalValue = useMemo(() => {
    const usdToTwdRate = exchangeRates['USD'] || 1;
    const totalInUsd = assets.reduce((acc, asset) => {
      let valueInUsd: number;
      if (asset.currency === 'USD') {
        valueInUsd = asset.value;
      } else if (asset.currency === 'TWD') {
        valueInUsd = usdToTwdRate > 0 ? asset.value / usdToTwdRate : 0;
      } else if (asset.currency === 'CNY') {
        const cnyToTwdRate = exchangeRates['CNY'] || 0;
        valueInUsd = usdToTwdRate > 0 ? (asset.value * cnyToTwdRate) / usdToTwdRate : 0;
      } else {
        valueInUsd = asset.value * (exchangeRates[asset.currency] || 0);
      }
      return acc + valueInUsd;
    }, 0);

    if (displayCurrency === 'USD') {
      return totalInUsd;
    }
    return totalInUsd * usdToTwdRate;
  }, [assets, exchangeRates, displayCurrency]);

  const categoryData = useMemo(() => {
    const categoryTotals: Record<string, number> = {};
    const usdToTwdRate = exchangeRates['USD'] || 1;
    assets.forEach((asset) => {
      let valueInTwd: number;
      if (asset.currency === 'USD') {
        valueInTwd = asset.value * usdToTwdRate;
      } else if (asset.currency === 'TWD') {
        valueInTwd = asset.value;
      } else if (asset.currency === 'CNY') {
        valueInTwd = asset.value * (exchangeRates['CNY'] || 0);
      } else {
        valueInTwd = asset.value * (exchangeRates[asset.currency] || 0) * usdToTwdRate;
      }
      if (!categoryTotals[asset.category]) {
        categoryTotals[asset.category] = 0;
      }
      categoryTotals[asset.category] += valueInTwd;
    });
    return {
      labels: Object.keys(categoryTotals),
      values: Object.values(categoryTotals),
    };
  }, [assets, exchangeRates]);

  const fetchData = async () => {
    try {
      const [assetsRes, historicalRes, ratesRes] = await Promise.all([
        fetch('/api/assets'),
        fetch('/api/historical-data'),
        fetch('/api/exchange-rates'),
      ]);
      const assetsData = await assetsRes.json();
      const historicalData = await historicalRes.json();
      const rates = await ratesRes.json();
      setAssets(assetsData);
      setHistoricalData(historicalData);
      setExchangeRates(rates);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const bootstrap = require('bootstrap');
      const setupModal = (ref: React.RefObject<any>, fetchDataOnHidden: boolean = false) => {
        if (ref.current && !ref.current.modalInstance) {
          const modal = new bootstrap.Modal(ref.current);
          ref.current.modalInstance = modal;
          if (fetchDataOnHidden) {
            ref.current.addEventListener('hidden.bs.modal', () => {
              fetchData();
            });
          }
        }
      };
      setupModal(addAssetModalRef, true);
      setupModal(editAssetModalRef, true);
      setupModal(editHistoryModalRef, true);
      setupModal(editRatesModalRef, true);
    }
  }, []);

  useEffect(() => {
    if (editingAsset && editAssetModalRef.current?.modalInstance) {
      editAssetModalRef.current.modalInstance.show();
    }
  }, [editingAsset]);

  useEffect(() => {
    if (editingHistoricalData && editHistoryModalRef.current?.modalInstance) {
      editHistoryModalRef.current.modalInstance.show();
    }
  }, [editingHistoricalData]);

  const handleAddAsset = async (asset: Omit<Asset, 'id'>) => {
    const newAsset = { ...asset, id: new Date().toISOString() };
    await fetch('/api/assets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAsset),
    });
    // The data-bs-dismiss attribute on the button will handle hiding the modal.
    // The hidden.bs.modal event listener will then trigger fetchData.
  };

  const handleEditAsset = (asset: Asset) => {
    setEditingAsset(asset);
  };

  const handleUpdateAsset = async (updatedAsset: Asset) => {
    await fetch('/api/assets', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedAsset),
    });
    setEditingAsset(null);
  };

  const handleDeleteAsset = async (id: string) => {
    await fetch('/api/assets', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchData();
  };

  const handleUpdateRates = async (newRates: Record<string, number>) => {
    await fetch('/api/exchange-rates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRates),
    });
  };

  const handleEditHistoricalData = (data: HistoricalData) => {
    setEditingHistoricalData(data);
  };

  const handleUpdateHistoricalData = async (updatedData: HistoricalData) => {
    await fetch('/api/historical-data', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
    });
    setEditingHistoricalData(null);
  };

  const handleDeleteHistoricalData = async (date: string) => {
    await fetch('/api/historical-data', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date }),
    });
    fetchData();
  };

  const handleRecordSnapshot = async () => {
    const usdToTwdRate = exchangeRates['USD'] || 1;
    const totalInTwd = assets.reduce((acc, asset) => {
      let valueInUsd: number;
      if (asset.currency === 'USD') {
        valueInUsd = asset.value;
      } else if (asset.currency === 'TWD') {
        valueInUsd = usdToTwdRate > 0 ? asset.value / usdToTwdRate : 0;
      } else if (asset.currency === 'CNY') {
        const cnyToTwdRate = exchangeRates['CNY'] || 0;
        valueInUsd = usdToTwdRate > 0 ? (asset.value * cnyToTwdRate) / usdToTwdRate : 0;
      } else {
        valueInUsd = asset.value * (exchangeRates[asset.currency] || 0);
      }
      return acc + valueInUsd * usdToTwdRate;
    }, 0);

    const newSnapshot: HistoricalData = {
      date: selectedDate,
      totalValue: totalInTwd,
    };

    assets.forEach((asset) => {
      let valueInTwd: number;
      const usdToTwdRate = exchangeRates['USD'] || 1;
      if (asset.currency === 'USD') {
        valueInTwd = asset.value * usdToTwdRate;
      } else if (asset.currency === 'TWD') {
        valueInTwd = asset.value;
      } else if (asset.currency === 'CNY') {
        valueInTwd = asset.value * (exchangeRates['CNY'] || 0);
      } else {
        valueInTwd = asset.value * (exchangeRates[asset.currency] || 0) * usdToTwdRate;
      }
      if (!newSnapshot[asset.category]) {
        newSnapshot[asset.category] = 0;
      }
      (newSnapshot[asset.category] as number) += valueInTwd;
    });

    await fetch('/api/historical-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSnapshot),
    });
    fetchData();
  };

  return (
    <main className="container mt-5">
      <h1 className="text-center mb-4">Asset Management Dashboard</h1>
      <div className="row mb-4 align-items-center">
        <div className="col-md-6">
          <div className="d-flex align-items-center">
            <h2 className="mb-0 me-3">Total Asset Value: {totalValue.toLocaleString('en-US', { style: 'currency', currency: displayCurrency, minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
            <select className="form-select w-auto" value={displayCurrency} onChange={(e) => setDisplayCurrency(e.target.value)}>
              <option value="TWD">TWD</option>
              <option value="USD">USD</option>
            </select>
          </div>
        </div>
        <div className="col-md-6 text-end">
          <input type="date" className="form-control w-auto d-inline-block me-2" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
          <button className="btn btn-info me-2" data-bs-toggle="modal" data-bs-target="#editRatesModal">Edit Rates</button>
          <button className="btn btn-primary me-2" data-bs-toggle="modal" data-bs-target="#addAssetModal">Add Asset</button>
          <button className="btn btn-secondary" onClick={handleRecordSnapshot}>Record Snapshot</button>
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-md-12">
          <h3>Exchange Rates</h3>
          <ul className="list-inline">
            {Object.entries(exchangeRates).map(([currency, rate]) => (
              <li className="list-inline-item" key={currency}>
                <strong>{currency}:</strong> {rate}
                <small className="text-muted">
                  {currency === 'USD' || currency === 'CNY' ? ' (to TWD)' : ' (to USD)'}
                </small>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="row">
        <div className="col-md-8">
          <h3>Asset List</h3>
          <AssetTable assets={assets} onEdit={handleEditAsset} onDelete={handleDeleteAsset} />
        </div>
        <div className="col-md-4">
          <h3>Asset Categories</h3>
          <CategoryChart categoryData={categoryData} />
        </div>
      </div>
      <div className="mt-5">
        <h3>Historical Performance</h3>
        <HistoryChart historicalData={historicalData} />
        <HistoryTable historicalData={historicalData} onEdit={handleEditHistoricalData} onDelete={handleDeleteHistoricalData} />
      </div>
      <AddAssetModal ref={addAssetModalRef} onAdd={handleAddAsset} />
      <EditAssetModal ref={editAssetModalRef} asset={editingAsset} onUpdate={handleUpdateAsset} />
      <EditHistoryModal ref={editHistoryModalRef} data={editingHistoricalData} onUpdate={handleUpdateHistoricalData} />
      <EditRatesModal ref={editRatesModalRef} rates={exchangeRates} onUpdate={handleUpdateRates} />
    </main>
  );
}
