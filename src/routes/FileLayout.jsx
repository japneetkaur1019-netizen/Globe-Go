import { Outlet, useLocation } from "react-router-dom";
import { Check } from "lucide-react";


const STEPS = [
  { key: "search", label: "Search" },
  { key: "results", label: "Select Flight" },
  { key: "passengers", label: "Passengers" },
  { key: "seats", label: "Seats" },
  { key: "payment", label: "Payment" }
];

function currentStepIndex(pathname) {
  if (pathname.includes("/confirmation")) return STEPS.length; // everything done
  const found = STEPS.findIndex((s) => s.key !== "search" && pathname.includes(`/${s.key}`));
  return found === -1 ? 0 : found;
}

export default function FlightLayout() {
  const { pathname } = useLocation();
  const active = currentStepIndex(pathname);

  return (
    <>
      <div className="flight-layout-stepper">
        <div className="flight-stepper-bar">
          {STEPS.map((step, i) => {
            const status = i < active ? "completed" : i === active ? "active" : "";
            return (
              <div key={step.key} style={{ display: "contents" }}>
                {i > 0 && (
                  <div className={`step-line ${i <= active ? (i < active ? "completed" : "active") : ""}`} />
                )}
                <div className={`step-node ${status}`}>
                  <span className="step-num">{status === "completed" ? <Check size={14} /> : i + 1}</span>
                  <span className="step-label">{step.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Outlet />
    </>
  );
}
