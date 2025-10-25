import { useEffect, useState } from "react";
import MenuList from "./components/MenuList";
import MenuItem from "./components/MenuItem";
import "./App.css";

const CATEGORIES_API = "https://www.themealdb.com/api/json/v1/1/categories.php";
const MEALS_BY_CATEGORY = "https://www.themealdb.com/api/json/v1/1/filter.php?c=";

// Precio 
function priceFromId(id) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  const n = (h % 1100) / 100;
  return Number((8 + n).toFixed(2));
}

export default function App() {
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Cargar categorías
  useEffect(() => {
    let abort = new AbortController();
    (async () => {
      try {
        setError("");
        const res = await fetch(CATEGORIES_API, { signal: abort.signal });
        if (!res.ok) throw new Error("No se pudieron cargar las categorías.");
        const json = await res.json();
        const list = (json.categories || []).map(c => c.strCategory).sort();
        setCategories(list);
        if (!list.length) return;
        setSelected(list.includes("Seafood") ? "Seafood" : list[0]);
      } catch (e) {
        if (e.name !== "AbortError") setError(e.message || "Error al cargar categorías.");
      }
    })();
    return () => abort.abort();
  }, []);

  // Cargar platos cuando cambia la categoría
  useEffect(() => {
    if (!selected) return;
    let abort = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`${MEALS_BY_CATEGORY}${encodeURIComponent(selected)}`, { signal: abort.signal });
        if (!res.ok) throw new Error("No se pudieron cargar los platos.");
        const json = await res.json();
        const normalized = (json.meals || []).map(m => ({
          id: m.idMeal,
          name: m.strMeal,
          thumb: m.strMealThumb,
          category: selected,
          price: priceFromId(m.idMeal),
        }));
        setItems(normalized);
      } catch (e) {
        if (e.name !== "AbortError") setError(e.message || "Error al cargar los platos.");
      } finally {
        setLoading(false);
      }
    })();
    return () => abort.abort();
  }, [selected]);

  return (
    <div className="app">
      <header className="header">
        <div className="container header__inner">
          <h1 className="brand">🍽️ Menú del Restaurante</h1>
        </div>
      </header>

      <main className="container">
        <MenuList
          categories={categories}
          selected={selected}
          onSelect={setSelected}
        />

        {loading && <p className="status">Cargando…</p>}
        {!!error && !loading && <p className="status status--error">{error}</p>}

        {!loading && !error && (
          <section className="grid" role="list">
            {items.map(item => (
              <MenuItem
                key={item.id}
                name={item.name}
                thumbnail={item.thumb}
                category={item.category}
                price={item.price}
              />
            ))}
          </section>
        )}
      </main>
    </div>
  );
}


