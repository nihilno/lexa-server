export function validateItems(items: Item[]) {
  for (const item of items) {
    if (item.quantity < 1 || item.quantity > 999) return false;
    if (item.price < 1 || item.price > 99999) return false;
  }
  return true;
}
