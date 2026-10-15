import { makeInvoke } from "@forge/bridge";
import type { Defs } from "../../../../../../src/shared/types";

type Input<K extends keyof Defs> = Parameters<Defs[K]>[0];

const invoke = makeInvoke<Defs>();

export const faqApi = {
  getDefaultFaqSpaceKey() {
    return invoke("getDefaultFaqSpaceKey");
  },

  getAllSpaceKeys() {
    return invoke("getAllSpaceKeys");
  },

  setDefaultFaqSpaceKey(input: Input<"setDefaultFaqSpaceKey">) {
    return invoke("setDefaultFaqSpaceKey", input);
  },

  publishFaq(input: Input<"publishFaq">) {
    return invoke("publishFaq", input);
  },

};
