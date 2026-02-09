import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listLabels } from "../db.js";

export default function Library() {
  const navigate = useNavigate();
  const [labels, setLabels] = useState([]);
  const [search, setSearch] = useState("");
  const [brandFilter, setBrandFilter] = useState("all");

  const loadLabels = async () => {
    const data = await listLabels();
    setLabels(data);
  };

  useEffect(() => {
    loadLabels();
  }, []);

  const brands = useMemo(() => {
    const unique = Array.from(
      new Set(labels.map((item) => item.brand).filter(Boolean))
    ).sort((a, b) => a.localeCompare(b));
    return unique;
  }, [labels]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return labels.filter((item) => {
      if (brandFilter !== "all" && item.brand !== brandFilter) return false;
      if (!query) return true;
      return (
        item.brand?.toLowerCase().includes(query) ||
        item.name?.toLowerCase().includes(query) ||
        item.sku?.toLowerCase().includes(query)
      );
    });
  }, [labels, search, brandFilter]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold">Library</h1>
          <p className="text-xs text-slate-500">
            {filtered.length} item{filtered.length === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm sm:w-64"
            placeholder="Search by brand, name, or SKU"
          />
          <select
            value={brandFilter}
            onChange={(event) => setBrandFilter(event.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm sm:w-48"
          >
            <option value="all">All brands</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
            No labels saved yet.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-base font-semibold text-slate-900">
                    {item.brand} {item.name}
                  </div>
                  {item.variant ? (
                    <div className="text-sm text-slate-500">
                      {item.variant}
                    </div>
                  ) : null}
                  <div className="text-sm text-slate-600">
                    {item.weightValue} {item.weightUnit} • €{" "}
                    {Number(item.price).toFixed(2)}
                    {item.showUnitPrice && item.unitPriceManual !== ""
                      ? ` • Unit: € ${Number(item.unitPriceManual).toFixed(2)} ${
                          item.unitPriceUnit || "€/kg"
                        }`
                      : ""}
                  </div>
                  {item.sku ? (
                    <div className="text-xs text-slate-400">SKU: {item.sku}</div>
                  ) : null}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => navigate(`/new?id=${item.id}`)}
                    className="rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/print?id=${item.id}&quantity=1`)
                    }
                    className="rounded-md bg-slate-900 px-3 py-2 text-xs font-medium text-white hover:bg-slate-800"
                  >
                    Print
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
