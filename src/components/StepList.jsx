import StepItem from "./StepItem";

export default function StepList({ steps }) {
  return (
    <section className="steps-section" aria-label="Cooking steps">
      <h3 className="section-title">Steps</h3>
      <ol className="step-list" aria-label="Step list">
        {steps.map((step, index) => (
          <StepItem key={step.id} step={step} index={index} />
        ))}
      </ol>
    </section>
  );
}
