import React from "react";
import { useRive } from "@rive-app/react-canvas";

export default function AIGenDisplay({ styles }) {
  const { RiveComponent } = useRive({
    src: "images/ai_assistant_icon.riv",
    stateMachines: "AgentAnimation",
    autoplay: true,
  });

  return (
    <div className="ai-gen-display standard-size" style={styles}>
      <RiveComponent />
    </div>
  );
}
