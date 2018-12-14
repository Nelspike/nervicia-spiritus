import { GuildMember, MessageOptions, TextChannel, User } from 'discord.js';

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

interface NerviciaUser {
  name: string;
  points: number;
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

interface AwardAction {
  type: 'award';
  target: GuildMember;
  role: string;
  points: number;
}

type Action = AwardAction | MessageAction;

export {
  Action,
  AwardAction,
  MessageAction,
  ItemWithPoints,
  MessageWithFiles,
  Result,
  NerviciaUser,
};
