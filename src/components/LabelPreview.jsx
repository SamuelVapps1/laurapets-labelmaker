const formatPrice = (value) =>
  Number.isFinite(value) ? value.toFixed(2) : "0.00";

export default function LabelPreview({ label, className = "" }) {
  const {
    brand,
    name,
    variant,
    price,
    weightValue,
    weightUnit,
    showUnitPrice,
    unitPriceManual,
    unitPriceUnit,
    bestBefore,
    sku,
    note,
  } = label || {};

  const showUnit =
    Boolean(showUnitPrice) && unitPriceManual !== "" && unitPriceManual != null;
  const unitLabel = unitPriceUnit || "€/kg";

  return (
    <div className={`${className} label-frame`}>
      <div className="label-grid">
        <div>
          <div className="label-title">
            {brand ? `${brand} ` : ""}
            {name || "Product name"}
          </div>
          {variant ? <div className="label-subtitle">{variant}</div> : null}
        </div>
        <div className="label-subtitle">
          {weightValue ? `${weightValue} ${weightUnit}` : "Weight/Volume"}
        </div>
        <div className="flex items-end justify-between gap-3">
          <div className="label-price">€ {formatPrice(Number(price))}</div>
          {showUnit ? (
            <div className="label-unit text-right">
              € {formatPrice(Number(unitPriceManual))} {unitLabel}
            </div>
          ) : null}
        </div>
        <div className="label-meta flex flex-wrap gap-x-3 gap-y-1">
          {bestBefore ? <span>Best before: {bestBefore}</span> : null}
          {sku ? <span>SKU: {sku}</span> : null}
          {note ? <span>{note}</span> : null}
        </div>
      </div>
    </div>
  );
}
