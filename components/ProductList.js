import { useProducts } from "../contexts/ProductContext";

export default function ProductList({ onEdit, onDelete }) {
  const { products, loading, page } = useProducts();
  if (loading) return <div className="loading">در حال بارگذاری...</div>;

  return (
    <table className="dashboard-table">
      <thead className="table-header">
        <tr>
          <th>ردیف</th>
          <th>نام کالا</th>
          <th>موجودی</th>
          <th>قیمت</th>
          <th>شناسه</th>
          <th>عملیات</th>
        </tr>
      </thead>
      <tbody>
        {products.map((p, i) => (
          <tr key={p.id}>
            <td>{i + 1 + (page - 1) * 10}</td>
            <td>{p.name}</td>
            <td>{p.quantity}</td>
            <td>{p.price}</td>
            <td>{p.id}</td>
            <td>
              <button
                className="action-button edit-button"
                onClick={() => onEdit(p)}
              >
                <img src="/edit.svg" alt="edit" />
              </button>
              <button
                className="action-button delete-button"
                onClick={() => onDelete(p.id)}
              >
                <img src="/trash.svg" alt="delete" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
