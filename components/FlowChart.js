// components/FlowChart.js
import { useEffect, useRef } from "react";
import mermaid from "mermaid";

export default function FlowChart({ chartCode }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      try {
        mermaid.contentLoaded(); // re-render Mermaid blocks
      } catch (err) {
        console.error("Mermaid render error:", err);
      }
    }
  }, [chartCode]);

  return (
    <div
      ref={ref}
      className="mermaid"
      style={{
        background: "#1e1e1e",
        color: "white",
        padding: "1rem",
        borderRadius: "8px",
        marginTop: "1rem",
      }}
    >
      {chartCode}
    </div>
  );
}
