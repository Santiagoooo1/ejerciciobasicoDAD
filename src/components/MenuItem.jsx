export default function MenuItem({ name, thumbnail, category, price }) {
    return (
        <article role="listitem" className="card">
            <img
                src={thumbnail}
                alt={`Foto de ${name}`}
                loading="lazy"
                className="card__img"
                onError={(e) => {
                    e.currentTarget.src = "https://placehold.co/600x400/e2e8f0/64748b?text=No+Image";
                }}
            />

            <div className="card__body">
                <h3 className="card__title">{name}</h3>
                <div className="card__meta">
                    <span className="badge">{category}</span>
                    <strong className="price">{price.toFixed(2)} €</strong>
                </div>
            </div>
        </article>
    );
}

