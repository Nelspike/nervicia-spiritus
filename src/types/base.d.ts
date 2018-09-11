/**
 * Monad Declarations
 */

interface Ok<T> {
  type: 'ok';
  value: T;
}

interface Err {
  type: 'error';
  reason: string;
}

type Result<T> = Ok<T> | Err;

export { Result };
