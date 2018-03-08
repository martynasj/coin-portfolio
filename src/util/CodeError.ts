type ErrorCode = 'auth/not-logged-in'

export default class CodeError extends Error {
  public code

  constructor(code: ErrorCode, ...args) {
    super(...args)
    this.code = code
  }
}