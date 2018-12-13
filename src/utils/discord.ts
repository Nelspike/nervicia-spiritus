import * as _ from 'lodash';
import {
  Client,
  Guild,
  GuildChannel,
  Role,
  TextChannel,
  User,
} from 'discord.js';

import { nerviciaId } from '../config';
import { MessageWithFiles, Result } from '../types/base';

/**
 * Finds the Nervicia Guild object, given its ID.
 *
 * @param {Client} client - The client initialised for the bot.
 *
 * @return {Result<Guild>} - A monad containing the result of
 * finding Nervicia or not.
 */
function _findNervicia(client: Client): Result<Guild> {
  const { guilds } = client;

  // Nervicia Guild ID
  const guild = guilds.get(nerviciaId);

  if (_.isUndefined(guild)) {
    return {
      type: 'error',
      reason: `Could not find guild with ID 395592987415150611`,
    };
  }

  return {
    type: 'ok',
    value: guild,
  };
}

function _isTextChannel(channel: GuildChannel): channel is TextChannel {
  return channel.type === 'text';
}

/**
 * Finds a text channel within Nervicia, given its ID.
 *
 * @param {Client} client - The client initialised for the bot.
 * @param {string} id - The ID of the channel to find.
 *
 * @return {Result<Guild>} - A monad containing the result of
 * finding the Channel or not.
 */
function findTextChannel(client: Client, id: string): Result<TextChannel> {
  const guildResult = _findNervicia(client);

  if (guildResult.type === 'error') {
    return guildResult;
  }

  const guild = guildResult.value;
  const { channels } = guild;

  const channel = channels.get(id);

  if (_.isUndefined(channel)) {
    return {
      type: 'error',
      reason: `Could not find channel ${id}`,
    };
  }

  if (!_isTextChannel(channel)) {
    return {
      type: 'error',
      reason: `Channel with ${id} is not a text channel`,
    };
  }

  return {
    type: 'ok',
    value: channel,
  };
}

function findRole(guild: Guild, name: string): Result<Role> {
  const { roles } = guild;

  const role = roles.find('name', name);

  if (_.isEmpty(role)) {
    return {
      type: 'error',
      reason: `Cannot find role ${name}`,
    };
  }

  return {
    type: 'ok',
    value: role,
  };
}

function sendMessage(msg: MessageWithFiles, target: TextChannel | User): void {
  if (msg.options) {
    target.send(msg.message, msg.options);
    return;
  }

  target.send(msg.message);
}

export { findRole, findTextChannel, sendMessage };
