import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import Icon from "./Icons";
import { Field, Reveal, SelectField } from "./primitives";
import { rateZones, serviceModes } from "./content";
import { trackingStatuses } from "./siteData";

const MotionArticle = motion.article;
const MotionForm = motion.form;

export function VolumetricCalculatorCard({
  className = "surface-card rounded-[2rem] p-6",
  defaultValues = { length: "40", width: "32", height: "28", divisor: "5000" },
}) {
  const [form, setForm] = useState(defaultValues);
  const length = Number(form.length) || 0;
  const width = Number(form.width) || 0;
  const height = Number(form.height) || 0;
  const divisor = Number(form.divisor) || 5000;
  const volumetricWeight = length && width && height ? (length * width * height) / divisor : 0;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  return (
    <MotionArticle whileHover={{ y: -6, scale: 1.01 }} transition={{ duration: 0.25 }} className={`${className} h-full`}>
      <div className="flex items-center gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
          <Icon name="calculator" />
        </span>
        <div>
          <h3 className="font-display text-2xl text-slate-900">Weight Calculator</h3>
          <p className="mt-1 text-sm text-slate-500">
            Work out volumetric and billable weight using carton dimensions and your preferred divisor.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Field label="Length (cm)" name="length" type="number" value={form.length} onChange={handleChange} placeholder="Enter length" />
        <Field label="Width (cm)" name="width" type="number" value={form.width} onChange={handleChange} placeholder="Enter width" />
        <Field label="Height (cm)" name="height" type="number" value={form.height} onChange={handleChange} placeholder="Enter height" />
        <Field label="Divisor" name="divisor" type="number" value={form.divisor} onChange={handleChange} placeholder="Enter divisor" />
      </div>

      <div className="mt-6 grid gap-6 border-t border-slate-200 pt-6 sm:grid-cols-2">
        <div className="border-l-4 border-sky-300 pl-4 text-slate-900">
          <p className="text-sm text-slate-600">Volumetric weight</p>
          <p className="mt-3 font-display text-4xl">
            {volumetricWeight.toFixed(2)} <span className="text-xl text-slate-500">kg</span>
          </p>
        </div>
        <div className="border-l-4 border-amber-200 pl-4">
          <p className="text-sm text-slate-500">Billable weight note</p>
          <p className="mt-3 text-lg font-semibold text-slate-900">(L x W x H) / divisor</p>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Shipping billing usually compares actual weight against dimensional weight and uses the higher figure.
          </p>
        </div>
      </div>
    </MotionArticle>
  );
}

export function RateCalculatorCard({
  className = "surface-card rounded-[2rem] p-6",
  defaultValues = { weight: "2.5", zone: "metro", service: "express", cod: "no" },
}) {
  const [form, setForm] = useState(defaultValues);
  const weight = Number(form.weight) || 0;
  const codFactor = form.cod === "yes" ? 1.08 : 1;
  const estimatedRate = weight
    ? Math.round((58 + weight * 26) * rateZones[form.zone] * serviceModes[form.service] * codFactor)
    : 0;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  return (
    <MotionArticle whileHover={{ y: -6, scale: 1.01 }} transition={{ duration: 0.25 }} className={`${className} h-full`}>
      <div className="flex items-center gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
          <Icon name="wallet" />
        </span>
        <div>
          <h3 className="font-display text-2xl text-slate-900">Rate Calculator</h3>
          <p className="mt-1 text-sm text-slate-500">
            Estimate shipping charges by zone, service level, weight, and optional COD handling.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Field label="Weight (kg)" name="weight" type="number" value={form.weight} onChange={handleChange} placeholder="Enter weight" />
        <SelectField
          label="Zone"
          name="zone"
          value={form.zone}
          onChange={handleChange}
          options={[
            { value: "local", label: "Local" },
            { value: "regional", label: "Regional" },
            { value: "metro", label: "Metro" },
            { value: "national", label: "National" },
          ]}
        />
        <SelectField
          label="Service level"
          name="service"
          value={form.service}
          onChange={handleChange}
          options={[
            { value: "standard", label: "Standard" },
            { value: "express", label: "Express" },
            { value: "priority", label: "Priority" },
          ]}
        />
        <SelectField
          label="COD handling"
          name="cod"
          value={form.cod}
          onChange={handleChange}
          options={[
            { value: "no", label: "No" },
            { value: "yes", label: "Yes" },
          ]}
        />
      </div>

      <div className="mt-6 grid gap-6 border-t border-slate-200 pt-6 sm:grid-cols-[0.95fr_1.05fr]">
        <div className="border-l-4 border-amber-300 pl-4 text-slate-900">
          <p className="text-sm text-slate-600">Indicative quote</p>
          <p className="mt-3 font-display text-4xl">Rs {estimatedRate || "--"}</p>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Final cost may vary by carrier, serviceability, volumetric billing, COD rules, and special handling.
          </p>
        </div>
        <div className="border-l-4 border-sky-300 pl-4">
          <p className="text-sm text-slate-500">Rate logic</p>
          <ul className="mt-4 grid gap-3 text-sm text-slate-600">
            {[
              "Base pricing adjusts by shipment weight.",
              "Zone selection reflects route complexity.",
              "Service speed changes the estimate accordingly.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-sky-300" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </MotionArticle>
  );
}

function ToolPreview({ title, description, icon, fields, buttonLabel, to, accentClass }) {
  return (
    <MotionArticle whileHover={{ y: -6, scale: 1.01 }} transition={{ duration: 0.25 }} className="surface-card h-full rounded-[2rem] p-6">
      <div className="flex items-center gap-4">
        <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accentClass}`}>
          <Icon name={icon} />
        </span>
        <div>
          <h3 className="font-display text-2xl text-slate-900">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
        </div>
      </div>

      <div className="mt-6 rounded-[1.75rem] border border-stone-200 bg-[#fffdf7] p-4">
        <div className="grid gap-3">
          {fields.map((field) => (
            <div key={field} className="rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-slate-400">
              {field}
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm">
          <span className="text-sm font-medium text-slate-500">Open full tool</span>
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f3d971] text-slate-900 shadow-[0_12px_24px_rgba(215,188,77,0.22)]">
            <Icon name="arrowUpRight" className="h-4.5 w-4.5" />
          </span>
        </div>
      </div>

      <Link
        to={to}
        className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-900 transition hover:text-slate-700"
      >
        <span className="border-b border-slate-900 pb-0.5">{buttonLabel}</span>
        <Icon name="arrowUpRight" className="h-4 w-4" />
      </Link>
    </MotionArticle>
  );
}

export function ShippingToolPlaceholders() {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <Reveal delay={0.08}>
        <ToolPreview
          title="Weight Calculator"
          description="Work out volumetric and billable weight using carton dimensions and your preferred divisor."
          icon="calculator"
          accentClass="bg-sky-100 text-sky-700"
          fields={["Enter length", "Enter width", "Enter height", "Enter divisor"]}
          buttonLabel="Open Weight Calculator"
          to="/volumetric-weight-calculator"
        />
      </Reveal>
      <Reveal delay={0.14}>
        <ToolPreview
          title="Rate Calculator"
          description="Estimate shipping charges by zone, service level, weight, and optional COD handling."
          icon="wallet"
          accentClass="bg-amber-100 text-amber-700"
          fields={["Enter weight", "Select zone", "Select service level", "Select COD handling"]}
          buttonLabel="Open Rate Calculator"
          to="/rate-calculator"
        />
      </Reveal>
    </div>
  );
}

export function TrackingPanel() {
  const location = useLocation();
  const initialQuery = location.state?.query || "DLP-2048127";
  const initialMode = location.state?.mode === "booking" ? "Booking Number" : "Container";
  const [awb, setAwb] = useState(initialQuery);
  const [searched, setSearched] = useState(initialQuery);
  const [mode, setMode] = useState(initialMode);
  const timeline = useMemo(
    () =>
      trackingStatuses.map((status, index) => ({
        ...status,
        complete: index < 3,
        active: index === 2,
      })),
    []
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    setSearched(awb || "DLP-2048127");
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
      <Reveal delay={0.05}>
        <MotionForm
          whileHover={{ y: -6, scale: 1.01 }}
          transition={{ duration: 0.25 }}
          onSubmit={handleSubmit}
          className="surface-card rounded-[2rem] p-6"
        >
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
              <Icon name="route" />
            </span>
            <div>
              <h3 className="font-display text-2xl text-slate-900">Shipment tracking</h3>
              <p className="mt-1 text-sm text-slate-500">Enter a reference number to preview the tracking experience.</p>
            </div>
          </div>

          <div className="mt-6 flex gap-5 text-sm text-slate-700">
            {["Container", "Booking Number"].map((option) => (
              <label key={option} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="trackingType"
                  className="h-4 w-4 accent-slate-900"
                  checked={mode === option}
                  onChange={() => setMode(option)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto]">
            <Field
              label="Tracking number"
              name="awb"
              value={awb}
              onChange={(event) => setAwb(event.target.value)}
              placeholder="Enter container/billing number"
            />
            <button
              type="submit"
              className="mt-auto inline-flex h-[52px] items-center justify-center rounded-2xl bg-[#f3d971] px-6 text-sm font-semibold text-slate-900 transition hover:bg-[#efcf54]"
            >
              Search
            </button>
          </div>

          <div className="mt-6 rounded-[1.75rem] bg-[linear-gradient(135deg,rgba(198,231,255,0.92),rgba(255,221,174,0.88))] px-5 py-5 text-slate-900 shadow-sm">
            <p className="text-sm text-slate-600">Latest lookup</p>
            <p className="mt-2 font-display text-3xl">{searched}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-500">{mode}</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Current preview shows a shipment that is out for delivery and ready for final customer notification.
            </p>
          </div>
        </MotionForm>
      </Reveal>

      <Reveal delay={0.12}>
        <MotionArticle
          whileHover={{ y: -6, scale: 1.01 }}
          transition={{ duration: 0.25 }}
          className="surface-card rounded-[2rem] p-6"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">Tracking timeline</p>
              <h3 className="mt-2 font-display text-2xl text-slate-900">Delivery journey snapshot</h3>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              Out for delivery
            </span>
          </div>

          <div className="mt-6 grid gap-4">
            {timeline.map((item, index) => (
              <div key={item.title} className="flex gap-4 rounded-[1.5rem] border border-slate-100 bg-white px-4 py-4 shadow-sm">
                <span
                  className={[
                    "mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl",
                    item.complete ? "bg-sky-100 text-sky-700" : "bg-slate-100 text-slate-500",
                  ].join(" ")}
                >
                  <Icon name={item.complete ? "shield" : "route"} className="h-5 w-5" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                    {item.active ? (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-amber-700">
                        Active
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.detail}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.22em] text-slate-400">Step 0{index + 1}</p>
                </div>
              </div>
            ))}
          </div>
        </MotionArticle>
      </Reveal>
    </div>
  );
}
