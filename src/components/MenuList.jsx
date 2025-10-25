export default function MenuList({ categories = [], selected, onSelect }) {
    if (!categories.length) {
        return <p className="status">Cargando categorías…</p>;
    }

    return (
        <nav className="chips" aria-label="Tipos de comida">
            {categories.map(cat => {
                const active = cat === selected;
                return (
                    <button
                        key={cat}
                        type="button"
                        onClick={() => onSelect(cat)}
                        className={`chip ${active ? "chip--active" : ""}`}
                        aria-pressed={active}
                    >
                        {cat}
                    </button>
                );
            })}
        </nav>
    );
}

