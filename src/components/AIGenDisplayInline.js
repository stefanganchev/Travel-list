import React from "react";
import { useRive } from "@rive-app/react-canvas";

export default function AIGenDisplayInline() {
  const { RiveComponent } = useRive({
    src: "images/ai_assistant_icon.riv",
    stateMachines: "AgentAnimation",
    autoplay: true,
  });

  return (
    <div className="ai-gen-display-inline">
      <div className="small-size">
        <RiveComponent />
      </div>
      <div className="skeleton-line-medium pulse location-info-description"></div>
    </div>
  );
}
