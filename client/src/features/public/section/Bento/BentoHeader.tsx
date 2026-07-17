import React from "react";

function BentoHeader() {
  return (
    <div className="relative bg-white">
      <div className="relative max-w-xl mx-auto text-center px-6 pt-24 pb-16">
        <h2 className="text-balance text-4xl md:text-5xl font-semibold tracking-tight leading-[1.1] text-text-primary mb-4">
          Everything you need to{" "}
          <span className="text-accent">debug webhooks</span>
        </h2>

        <p className="text-balance text-[17px] leading-relaxed text-text-secondary max-w-md mx-auto">
          Capture, inspect, replay, and resolve any webhook solo or with your
          team.
        </p>
      </div>
    </div>
  );
}

export default BentoHeader;
