import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import MockTelemetryService from "../services/mockTelemetryService";

const TelemetryContext = createContext(null);

export function TelemetryProvider({ children }) {
  const serviceRef = useRef(null);

  if (!serviceRef.current) {
    serviceRef.current = new MockTelemetryService();
  }

  const [state, setState] = useState(() => serviceRef.current.getSnapshot());

  useEffect(() => {
    const service = serviceRef.current;
    const handler = (nextState) => setState(nextState);

    service.subscribe(handler);
    service.start();

    return () => {
      service.unsubscribe(handler);
      service.stop();
    };
  }, []);

  const contextValue = useMemo(
    () => ({
      ...state,
      setActiveDevice: (deviceId) => serviceRef.current.setActiveDevice(deviceId),
    }),
    [state]
  );

  return <TelemetryContext.Provider value={contextValue}>{children}</TelemetryContext.Provider>;
}

export function useTelemetry() {
  const context = useContext(TelemetryContext);

  if (!context) {
    throw new Error("useTelemetry must be used within a TelemetryProvider");
  }

  return context;
}
