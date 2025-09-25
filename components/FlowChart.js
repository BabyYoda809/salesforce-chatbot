// components/FlowChart.js
import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";

export default function FlowChart({ chartDef }) {
  const ref = useRef(null);

  useEffect(() => {
    mermaid.initialize({ startOnLoad: true, theme: "dark" });
    if (ref.current) {
      mermaid.contentLoaded();
    }
  }, [chartDef]);

  return (
    <div className="flowchart">
      <div className="mermaid" ref={ref}>
        {chartDef}
      </div>
    </div>
  );
}
