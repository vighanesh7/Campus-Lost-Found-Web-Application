// A small module: Webpack follows `import` statements and merges modules into one bundle.
export const summarize = (items) => ({
  lost: items.filter((i) => i.type === 'LOST').length,
  found: items.filter((i) => i.type === 'FOUND').length,
});
export const label = (item) => `${item.type}: ${item.name} @ ${item.location}`;
