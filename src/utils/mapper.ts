// ১. change case in string level
type SnakeToCamelCase<S extends string> = S extends `${infer T}_${infer U}`
  ? `${Lowercase<T>}${Capitalize<SnakeToCamelCase<U>>}`
  : Lowercase<S>;

type CamelToSnakeCase<S extends string> = S extends `${infer T}${infer U}`
  ? U extends Uncapitalize<U>
    ? `${Lowercase<T>}${CamelToSnakeCase<U>}`
    : `${Lowercase<T>}_${CamelToSnakeCase<Uncapitalize<U>>}`
  : S;

// recursive array and object
export type DeepCamelCase<T> =
  T extends Array<infer U>
    ? Array<DeepCamelCase<U>>
    : T extends Record<string, any>
      ? {
          [K in keyof T as SnakeToCamelCase<Extract<K, string>>]: DeepCamelCase<
            T[K]
          >;
        }
      : T;

export type DeepSnakeCase<T> =
  T extends Array<infer U>
    ? Array<DeepSnakeCase<U>>
    : T extends Record<string, any>
      ? {
          [K in keyof T as CamelToSnakeCase<Extract<K, string>>]: DeepSnakeCase<
            T[K]
          >;
        }
      : T;

// main conversion function
function convertKeys(obj: any, targetCase: "camel" | "snake" = "camel"): any {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => convertKeys(item, targetCase));
  }

  const toCamel = (str: string) =>
    str.replace(/([-_][a-z])/g, (group) =>
      group.toUpperCase().replace("-", "").replace("_", ""),
    );
  const toSnake = (str: string) =>
    str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

  return Object.keys(obj).reduce((acc: any, key) => {
    const newKey = targetCase === "camel" ? toCamel(key) : toSnake(key);
    acc[newKey] = convertKeys(obj[key], targetCase);
    return acc;
  }, {});
}

// ৪. এক্সপোজড হেল্পার ফাংশন (স্ট্রংলি টাইপড)
export function toCamelCase<T>(data: T): DeepCamelCase<T> {
  return convertKeys(data, "camel");
}

export function toSnakeCase<T>(data: T): DeepSnakeCase<T> {
  return convertKeys(data, "snake");
}
