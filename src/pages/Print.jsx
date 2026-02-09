import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import LabelPreview from "../components/LabelPreview.jsx";
import { getLabel } from "../db.js";
export default function PrintView() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [label, setLabel] = useState(location.state?.label || null);

  const quantity = useMemo(() => {
    const fromQuery = Number(searchParams.get("quantity"));
    if (Number.isFinite(fromQuery) && fromQuery > 0) return fromQuery;
    if (location.state?.quantity) return location.state.quantity;
    return 1;
  }, [location.state, searchParams]);

  useEffect(() => {
    const id = searchParams.get("id");
    if (!label && id) {
      getLabel(Number(id)).then((data) => {
        if (!data) return;
        setLabel({
          ...data,
          showUnitPrice: data.showUnitPrice ?? false,
          unitPriceManual: data.unitPriceManual ?? "",
          unitPriceUnit: data.unitPriceUnit || "€/kg",
        });
      });
    }
  }, [label, searchParams]);

  useEffect(() => {
    if (!label) return;
    const needsDefaults =
      label.showUnitPrice === undefined ||
      label.unitPriceManual === undefined ||
      !label.unitPriceUnit;
    if (!needsDefaults) return;
    setLabel({
      ...label,
      showUnitPrice: label.showUnitPrice ?? false,
      unitPriceManual: label.unitPriceManual ?? "",
      unitPriceUnit: label.unitPriceUnit || "€/kg",
    });
  }, [label]);

  useEffect(() => {
    if (!label) return;
    const timer = setTimeout(() => {
      window.print();
    }, 400);
    return () => clearTimeout(timer);
  }, [label, quantity]);

  const pages = Array.from({ length: quantity }, (_, index) => index);

  if (!label) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
          No label data available.
        </div>
        <Link to="/new" className="text-sm text-slate-600 underline">
          Back to New Label
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="no-print space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold">Print Preview</div>
            <div className="text-xs text-slate-500">
              {quantity} label{quantity > 1 ? "s" : ""} • 80mm x 30mm
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white"
            >
              Print now
            </button>
            <Link
              to="/new"
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600"
            >
              Back
            </Link>
          </div>
        </div>
        <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
          Tip: disable &quot;Headers and footers&quot; in the print dialog for
          best results.
        </div>
      </div>

      <div className="print-root">
        {pages.map((page) => (
          <div key={page} className="print-page">
            <LabelPreview label={label} className="label-print shadow-sm" />
          </div>
        ))}
      </div>
    </div>
  );
}
