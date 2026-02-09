import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import LabelPreview from "../components/LabelPreview.jsx";
import { createLabel, db, getLabel, updateLabel } from "../db.js";

const defaultForm = {
  brand: "",
  name: "",
  variant: "",
  price: "",
  weightValue: "",
  weightUnit: "kg",
  showUnitPrice: false,
  unitPriceManual: "",
  unitPriceUnit: "€/kg",
  bestBefore: "",
  sku: "",
  note: "",
};

const parseNumber = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

export default function NewLabel() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState(defaultForm);
  const [quantity, setQuantity] = useState(1);
  const [brands, setBrands] = useState([]);
  const [brandMode, setBrandMode] = useState("new");
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const loadBrands = async () => {
    const list = await db.labels.toArray();
    const unique = Array.from(
      new Set(list.map((item) => item.brand).filter(Boolean))
    ).sort((a, b) => a.localeCompare(b));
    setBrands(unique);
  };

  const loadFromId = async (id) => {
    const label = await getLabel(Number(id));
    if (!label) return;
    setEditingId(label.id);
    setForm({
      brand: label.brand || "",
      name: label.name || "",
      variant: label.variant || "",
      price: label.price ?? "",
      weightValue: label.weightValue ?? "",
      weightUnit: label.weightUnit || "kg",
      showUnitPrice: label.showUnitPrice ?? false,
      unitPriceManual: label.unitPriceManual ?? "",
      unitPriceUnit: label.unitPriceUnit || "€/kg",
      bestBefore: label.bestBefore || "",
      sku: label.sku || "",
      note: label.note || "",
    });
    setBrandMode(label.brand ? "existing" : "new");
  };

  useEffect(() => {
    loadBrands();
  }, []);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      loadFromId(id);
    } else if (location.state?.label) {
      const label = location.state.label;
      setEditingId(label.id ?? null);
      setForm({
        brand: label.brand || "",
        name: label.name || "",
        variant: label.variant || "",
        price: label.price ?? "",
        weightValue: label.weightValue ?? "",
        weightUnit: label.weightUnit || "kg",
        showUnitPrice: label.showUnitPrice ?? false,
        unitPriceManual: label.unitPriceManual ?? "",
        unitPriceUnit: label.unitPriceUnit || "€/kg",
        bestBefore: label.bestBefore || "",
        sku: label.sku || "",
        note: label.note || "",
      });
      setBrandMode(label.brand ? "existing" : "new");
    } else {
      const lastBrand = localStorage.getItem("labelmaker:lastBrand");
      if (lastBrand) {
        setForm((prev) => ({ ...prev, brand: lastBrand }));
        setBrandMode("existing");
      }
    }
  }, [location.state, searchParams]);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleBrandSelect = (event) => {
    const value = event.target.value;
    if (value === "__new__") {
      setBrandMode("new");
      setForm((prev) => ({ ...prev, brand: "" }));
    } else {
      setBrandMode("existing");
      setForm((prev) => ({ ...prev, brand: value }));
    }
  };

  const validate = () => {
    if (!form.brand.trim()) return "Brand is required.";
    if (!form.name.trim()) return "Name is required.";
    if (!form.price) return "Price is required.";
    if (!form.weightValue) return "Weight/volume is required.";
    return "";
  };

  const buildLabel = () => ({
    brand: form.brand.trim(),
    name: form.name.trim(),
    variant: form.variant.trim(),
    price: parseNumber(form.price),
    weightValue: parseNumber(form.weightValue),
    weightUnit: form.weightUnit,
    showUnitPrice: Boolean(form.showUnitPrice),
    unitPriceManual:
      form.unitPriceManual === "" ? "" : parseNumber(form.unitPriceManual),
    unitPriceUnit: form.unitPriceUnit,
    bestBefore: form.bestBefore,
    sku: form.sku.trim(),
    note: form.note.trim(),
    updatedAt: new Date().toISOString(),
  });

  const handleSave = async () => {
    setError("");
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    const payload = buildLabel();
    if (editingId) {
      await updateLabel(editingId, payload);
    } else {
      const id = await createLabel(payload);
      setEditingId(id);
    }
    localStorage.setItem("labelmaker:lastBrand", payload.brand);
    await loadBrands();
    setStatus("Saved.");
    setTimeout(() => setStatus(""), 1500);
  };

  const handlePrint = () => {
    setError("");
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    const payload = buildLabel();
    const params = new URLSearchParams();
    params.set("quantity", String(quantity));
    if (editingId) params.set("id", String(editingId));
    navigate(`/print?${params.toString()}`, {
      state: { label: payload, quantity },
    });
  };

  const handleClear = () => {
    setForm(defaultForm);
    setQuantity(1);
    setEditingId(null);
    setBrandMode("new");
    setError("");
  };

  const labelPreview = {
    ...form,
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="space-y-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold">New Label</h1>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">
              Brand
              <select
                value={brandMode === "new" ? "__new__" : form.brand}
                onChange={handleBrandSelect}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="__new__">Add new brand...</option>
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </label>

            {brandMode === "new" ? (
              <label className="text-sm font-medium text-slate-700">
                New brand name
                <input
                  value={form.brand}
                  onChange={handleChange("brand")}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  placeholder="Brand"
                />
              </label>
            ) : (
              <div className="text-sm text-slate-500 flex items-end">
                Using saved brand.
              </div>
            )}

            <label className="text-sm font-medium text-slate-700">
              Name
              <input
                value={form.name}
                onChange={handleChange("name")}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                placeholder="Product name"
              />
            </label>

            <label className="text-sm font-medium text-slate-700">
              Variant
              <input
                value={form.variant}
                onChange={handleChange("variant")}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                placeholder="Optional"
              />
            </label>

            <label className="text-sm font-medium text-slate-700">
              Price (€)
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleChange("price")}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                placeholder="0.00"
              />
            </label>

            <div className="grid grid-cols-[2fr_1fr] gap-3">
              <label className="text-sm font-medium text-slate-700">
                Weight/Volume
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.weightValue}
                  onChange={handleChange("weightValue")}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  placeholder="0"
                />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Unit
                <select
                  value={form.weightUnit}
                  onChange={handleChange("weightUnit")}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="g">g</option>
                  <option value="kg">kg</option>
                  <option value="ml">ml</option>
                  <option value="l">l</option>
                </select>
              </label>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={form.showUnitPrice}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      showUnitPrice: event.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-slate-300 text-slate-900"
                />
                Show unit price
              </label>
              {form.showUnitPrice ? (
                <div className="mt-3 grid gap-3 sm:grid-cols-[1.4fr_0.6fr]">
                  <label className="text-sm font-medium text-slate-700">
                    Unit price
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.unitPriceManual}
                      onChange={handleChange("unitPriceManual")}
                      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                      placeholder="0.00"
                    />
                  </label>
                  <label className="text-sm font-medium text-slate-700">
                    Unit
                    <select
                      value={form.unitPriceUnit}
                      onChange={handleChange("unitPriceUnit")}
                      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                    >
                      <option value="€/kg">€/kg</option>
                      <option value="€/l">€/l</option>
                    </select>
                  </label>
                </div>
              ) : null}
            </div>

            <label className="text-sm font-medium text-slate-700">
              Best before
              <input
                type="date"
                value={form.bestBefore}
                onChange={handleChange("bestBefore")}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </label>

            <label className="text-sm font-medium text-slate-700">
              SKU
              <input
                value={form.sku}
                onChange={handleChange("sku")}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                placeholder="Optional"
              />
            </label>

            <label className="text-sm font-medium text-slate-700 md:col-span-2">
              Note
              <textarea
                rows="2"
                value={form.note}
                onChange={handleChange("note")}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                placeholder="Optional note"
              />
            </label>

            <label className="text-sm font-medium text-slate-700">
              Quantity
              <input
                type="number"
                min="1"
                step="1"
                value={quantity}
                onChange={(event) => {
                  const next = Number(event.target.value);
                  setQuantity(Number.isFinite(next) && next > 0 ? next : 1);
                }}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </label>
          </div>

          {error ? (
            <div className="mt-3 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </div>
          ) : null}
          {status ? (
            <div className="mt-3 text-sm text-emerald-600">{status}</div>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              Print
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100"
            >
              Clear
            </button>
          </div>
        </div>
      </section>

      <aside className="space-y-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-sm font-medium text-slate-700">Live Preview</div>
          <div className="mt-3 flex justify-center">
            <LabelPreview
              label={labelPreview}
              className="label-preview shadow-sm"
            />
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
          Tip: Use the Print button to open the 80mm x 30mm print view.
        </div>
      </aside>
    </div>
  );
}
