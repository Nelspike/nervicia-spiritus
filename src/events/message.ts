import * as _ from 'lodash';
import { Client, Message, TextChannel } from 'discord.js';

import { commandPrefix, eventOrganizersId } from '../config';
import { findTextChannel, sendMessage } from '../utils/discord';

import { getCommand } from '../utils/message';

import { getLeaderboard, getSubmission } from '../utils/nervicia';

import { MessageAction, Action } from '../types/base';

function _performAction(action: Action): void {
  switch (action.type) {
    case 'message':
      sendMessage(action.message, action.target);
  }
}

function _getOrganizersChannel(client: Client): TextChannel {
  const channelResult = findTextChannel(client, eventOrganizersId);

  if (channelResult.type === 'error') {
    throw new Error('The Nervicia organizers channel cannot be found!');
  }

  return channelResult.value;
}

function _buildLeaderboard(client: Client, msg: Message): MessageAction {
  const leaderboardResult = getLeaderboard(msg);

  if (leaderboardResult.type === 'error') {
    throw new Error(leaderboardResult.reason);
  }

  const target = _getOrganizersChannel(client);

  return {
    type: 'message',
    target,
    message: leaderboardResult.value,
  };
}

function _buildSubmission(client: Client, msg: Message): MessageAction {
  const submissionResult = getSubmission(msg);

  if (submissionResult.type === 'error') {
    throw new Error(submissionResult.reason);
  }

  const target = _getOrganizersChannel(client);

  return {
    type: 'message',
    target,
    message: submissionResult.value,
  };
}

function _getCommandAction(client: Client, msg: Message): Action {
  const command = getCommand(msg.content);

  switch (command) {
    case 'leaderboard':
      return _buildLeaderboard(client, msg);
    case 'submit':
      return _buildSubmission(client, msg);
    default:
      throw new Error(`Cannot recognize command ${command}`);
  }
}

function message(client: Client): void {
  client.on('message', (msg: Message): void => {
    const { content } = msg;

    if (!_.startsWith(content, commandPrefix)) {
      return;
    }

    try {
      const action = _getCommandAction(client, msg);
      _performAction(action);
    } catch (error) {
      console.error(error.message); // tslint:disable-line
      return;
    }
  });
}

export { message };
