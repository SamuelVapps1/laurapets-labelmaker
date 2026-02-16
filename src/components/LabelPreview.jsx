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
  const metaItems = [
    bestBefore ? `Best before: ${bestBefore}` : null,
    sku ? `SKU: ${sku}` : null,
    note ? note : null,
  ].filter(Boolean);

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
        <div className="label-weight">
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
        <div className="label-meta flex flex-wrap items-center gap-x-1.5 gap-y-1">
          {metaItems.length
            ? metaItems.map((item, index) => (
                <span key={`${item}-${index}`}>
                  {item}
                  {index < metaItems.length - 1 ? " • " : ""}
                </span>
              ))
            : null}
        </div>
      </div>
    </div>
  );
}
