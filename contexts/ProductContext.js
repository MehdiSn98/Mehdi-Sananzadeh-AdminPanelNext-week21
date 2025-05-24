import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import api from "../services/api";

const ProductContext = createContext();
export const useProducts = () => useContext(ProductContext);

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const limit = 10;

  const run = useCallback(async (fn) => {
    setLoading(true);
    try {
      return await fn();
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProducts = useCallback(
    () =>
      run(async () => {
        const res = await api.get("/products", {
          params: { page, limit, name: query },
        });
        setProducts(res.data.data ?? res.data);
      }),
    [page, query, run]
  );

  const addProduct = useCallback(
    (data) =>
      run(async () => {
        const res = await api.post("/products", data);
        const item = res.data.data ?? res.data;
        setProducts((curr) => [item, ...curr]);
        return item;
      }),
    [run]
  );

  const updateProduct = useCallback(
    (id, data) =>
      run(async () => {
        const res = await api.put(`/products/${id}`, data);
        const updated = res.data.data ?? res.data;
        setProducts((curr) => curr.map((p) => (p.id === id ? updated : p)));
        return updated;
      }),
    [run]
  );

  const deleteProduct = useCallback(
    (id) =>
      run(async () => {
        await api.delete(`/products/${id}`);
        setProducts((curr) => curr.filter((p) => p.id !== id));
      }),
    [run]
  );

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        page,
        setPage,
        query,
        setQuery,
        fetchProducts,
        addProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}
