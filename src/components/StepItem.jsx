import { useState } from "react";

export default function StepItem({ step, index }) {
  const [checked, setChecked] = useState(false);
  const stepNum = index + 1;
  const checkboxId = `step-${step.id}`;

  return (
    <li className={`step-item${checked ? " step-item--done" : ""}`}>
      <label className="step-label" htmlFor={checkboxId}>
        <input
          id={checkboxId}
          type="checkbox"
          className="step-checkbox"
          checked={checked}
          onChange={() => setChecked((c) => !c)}
          aria-label={`Mark step ${stepNum} as done: ${step.instruction}`}
        />
        <span className="step-number" aria-hidden="true">{stepNum}</span>
        <span className="step-instruction">{step.instruction}</span>
      </label>
    </li>
  );
}
