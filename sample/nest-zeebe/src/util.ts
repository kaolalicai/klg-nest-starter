export function revolver(rate?: number) {
  rate = rate || 1 / 6
  if (Math.random() < rate) throw new Error('发生内部错误')
}
