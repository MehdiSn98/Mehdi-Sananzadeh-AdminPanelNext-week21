import { useState } from "react";
import { useAuth } from "../contexts/AuthContext.js";
import { useProducts } from "../contexts/ProductContext.js";
import SearchBar from "./Searchbar.js";
import UserMenu from "./UserMenu.js";
import Toolbar from "./Toolbar.js";
import ProductList from "./ProductList.js";
import Pagination from "./Pagination.js";
import { AddEditModal, DeleteModal } from "./Modals.js";

export default function DashboardInner() {
  const { user, handleLogout } = useAuth();

  const {
    products,
    loading,
    page,
    setPage,
    query,
    setQuery,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useProducts();

  const [deleteId, setDeleteId] = useState(null);
  const [editData, setEditData] = useState(null);
  const [addEditVisible, setAddEditVisible] = useState(false);

  const handleDeleteConfirm = async () => {
    try {
      await deleteProduct(deleteId);
    } catch (err) {
      console.error("خطا در حذف محصول:", err);
    } finally {
      setDeleteId(null);
    }
  };

  const handleSave = async (data) => {
    try {
      if (data.id) {
        await updateProduct(data.id, data);
      } else {
        await addProduct(data);
      }
      setAddEditVisible(false);
      setEditData(null);
    } catch (err) {
      console.error("خطا در ذخیره محصول:", err);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <SearchBar
          query={query}
          onSearch={(q) => {
            setQuery(q);
            setPage(1);
          }}
        />
        <UserMenu username={user?.username} onLogout={handleLogout} />
      </div>

      <div className="dashboard-title">
        <img className="management-logo" src="/setting.svg" alt="لوگو" />
        <h2 className="p-manage">مدیریت کالا</h2>
      </div>

      <Toolbar
        onAdd={() => {
          setEditData(null);
          setAddEditVisible(true);
        }}
      />

      <ProductList
        products={products}
        loading={loading}
        onEdit={(item) => {
          setEditData(item);
          setAddEditVisible(true);
        }}
        onDelete={setDeleteId}
      />

      <Pagination
        page={page}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => p + 1)}
      />

      <AddEditModal
        isVisible={addEditVisible}
        initialData={editData}
        onConfirm={handleSave}
        onCancel={() => {
          setAddEditVisible(false);
          setEditData(null);
        }}
      />

      <DeleteModal
        isVisible={Boolean(deleteId)}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
