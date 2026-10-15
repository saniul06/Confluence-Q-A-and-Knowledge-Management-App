import { makeInvoke } from "@forge/bridge";
import type { Defs } from "../../../../../../src/shared/types";

type Input<K extends keyof Defs> = Parameters<Defs[K]>[0];

const invoke = makeInvoke<Defs>();

export const expertApi = {
  fetchExperts(input: Input<"fetchExperts">) {
    return invoke("fetchExperts", input);
  },

  findUsers(input: Input<"findUsers">) {
    return invoke("findUsers", input);
  },

  assignExpert(input: Input<"assignExpert">) {
    return invoke("assignExpert", input);
  },

  removeExpert(input: Input<"removeExpert">) {
    return invoke("removeExpert", input);
  },
};
