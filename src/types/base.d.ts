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

interface ItemWithPoints {
  name: string;
  points: number;
  list: string[];
}

export { ItemWithPoints, Result };
