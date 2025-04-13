import qs from "qs";

import { QueryState } from "./model";

function isNotEmpty(obj: unknown) {
  return obj !== undefined && obj !== null && obj !== "";
}

function stringifyRequestQuery(state: QueryState): string {
  const pagination = qs.stringify(state, {
    filter: ["page", "items_per_page"],
    skipNulls: true,
  });
  const sort = qs.stringify(state, {
    filter: ["sort", "order"],
    skipNulls: true,
  });
  const search = isNotEmpty(state.search)
    ? qs.stringify(state, { filter: ["search"], skipNulls: true })
    : "";

  const filter = state.filter
    ? Object.entries(state.filter as Object)
        .filter((obj) => isNotEmpty(obj[1]))
        .map(
          ([key, value]) =>
            `filter_${encodeURIComponent(key)}=${encodeURIComponent(
              String(value)
            )}`
        ) // Properly encode key and value
        .join("&")
    : "";

  return [pagination, sort, search, filter]
    .filter((f) => f)
    .join("&")
    .toLowerCase();
}

export { stringifyRequestQuery };
