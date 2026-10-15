import { makeInvoke } from "@forge/bridge";
import type { Defs } from "../../../../../../src/shared/types";

const invoke = makeInvoke<Defs>();

export const confluenceApi = {
  getCurrentUser() {
    return invoke("getCurrentUser");
  },
};
