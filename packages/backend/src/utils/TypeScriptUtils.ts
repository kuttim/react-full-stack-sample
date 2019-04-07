// Returns a type where all keys defined in K are removed from T.
export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
