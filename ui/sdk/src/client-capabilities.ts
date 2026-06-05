import type { GooseMcpHostCapabilities } from "./mcp-apps.js";

export interface GooseClientCapabilitiesMeta {
  mesmile?: {
    mcpHostCapabilities?: GooseMcpHostCapabilities;
    customNotifications?: boolean;
  };
}
