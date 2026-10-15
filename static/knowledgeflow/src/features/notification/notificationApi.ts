import {  makeInvoke } from "@forge/bridge";
import type { Defs } from "../../../../../src/shared/types";

const invoke = makeInvoke<Defs>();

export const notificationApi = {
  getExpertNotificationToken() {
    return invoke("getExpertNotificationToken");
  },
};
