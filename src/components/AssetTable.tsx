import { Asset } from '@/types';

interface Props {
  assets: Asset[];
  onEdit: (asset: Asset) => void;
  onDelete: (id: string) => void;
}

export default function AssetTable({ assets, onEdit, onDelete }: Props) {
  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th>Name</th>
          <th>Category</th>
          <th>Value</th>
          <th>Currency</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {assets.map((asset) => (
          <tr key={asset.id}>
            <td>{asset.name}</td>
            <td>{asset.category}</td>
            <td>{asset.value}</td>
            <td>{asset.currency}</td>
            <td>{asset.date}</td>
            <td>
              <button className="btn btn-sm btn-warning me-2" data-bs-toggle="modal" data-bs-target="#editAssetModal" onClick={() => onEdit(asset)}>Edit</button>
              <button className="btn btn-sm btn-danger" onClick={() => onDelete(asset.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
