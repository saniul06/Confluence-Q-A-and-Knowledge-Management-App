import { makeInvoke } from "@forge/bridge";
import type { Defs } from "../../../../../../src/shared/types";

type Input<K extends keyof Defs> = Parameters<Defs[K]>[0];

const invoke = makeInvoke<Defs>();

export const questionApi = {
  list(input: Input<"listQuestions">) {
    return invoke("listQuestions", input);
  },

  create(input: Input<"createQuestion">) {
    return invoke("createQuestion", input);
  },

  get(input: Input<"getQuestion">) {
    return invoke("getQuestion", input);
  },

  createAnswer(input: Input<"createAnswer">) {
    return invoke("createAnswer", input);
  },

  acceptAnswer(input: Input<"acceptAnswer">) {
    return invoke("acceptAnswer", input);
  },
};
