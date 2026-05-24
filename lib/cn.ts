export function cn(...inputs: Array<unknown>) {
  return inputs.filter((x): x is string => typeof x === 'string' && x.length > 0).join(' ')
}
