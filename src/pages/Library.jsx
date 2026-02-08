import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listLabels } from "../db.js";

export default function Library() {
  const navigate = useNavigate();
  const [labels, setLabels] = useState([]);
  const [search, setSearch] = useState("");

  const loadLabels = async () => {
    const data = await listLabels();
    setLabels(data);
  };

  useEffect(() => {
    loadLabels();
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return labels;
    return labels.filter((item) => {
      return (
        item.brand?.toLowerCase().includes(query) ||
        item.name?.toLowerCase().includes(query) ||
        item.sku?.toLowerCase().includes(query)
      );
    });
  }, [labels, search]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-lg font-semibold">Library</h1>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full max-w-sm rounded-md border border-slate-300 px-3 py-2 text-sm"
          placeholder="Search by brand, name, or SKU"
        />
      </div>

      <div className="grid gap-3">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
            No labels saved yet.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <button
                  type="button"
                  onClick={() => navigate(`/new?id=${item.id}`)}
                  className="text-left"
                >
                  <div className="text-sm font-semibold text-slate-900">
                    {item.brand} {item.name}
                  </div>
                  <div className="text-xs text-slate-500">
                    {item.variant ? `${item.variant} • ` : ""}
                    {item.weightValue} {item.weightUnit} • €{" "}
                    {Number(item.price).toFixed(2)}
                  </div>
                  {item.sku ? (
                    <div className="text-xs text-slate-400">SKU: {item.sku}</div>
                  ) : null}
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/print?id=${item.id}&quantity=1`)
                    }
                    className="rounded-md bg-slate-900 px-3 py-2 text-xs font-medium text-white hover:bg-slate-800"
                  >
                    Print again
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
