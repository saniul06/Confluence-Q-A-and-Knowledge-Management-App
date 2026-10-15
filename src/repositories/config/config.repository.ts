import { ConfigEntry } from "../../types/config.types";

export interface ConfigRepository {
  get(key: string): Promise<ConfigEntry | null>;
  set(key: string, value: string): Promise<number>;
}
