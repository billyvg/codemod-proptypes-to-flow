export default function findIndex(arr, f) {
  let index;
  arr.some((val, i) => {
    const result = f(val, i);
    if (result) {
      index = i;
    }
    return result;
  });

  return index;
}
