import { MessageOptions, User, TextChannel } from 'discord.js';

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

interface MessageWithFiles {
  message: string;
  options?: MessageOptions;
}

interface MessageAction {
  type: 'message';
  target: TextChannel | User;
  message: MessageWithFiles;
}

type Action = MessageAction;

export { Action, MessageAction, ItemWithPoints, MessageWithFiles, Result };
