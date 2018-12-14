import * as _ from 'lodash';
import { Client, Message, GuildChannel, TextChannel, User } from 'discord.js';

import { commandPrefix, eventOrganizersId } from '../config';
import { addPointsToUser } from '../utils/storage';
import { isTextChannel, findTextChannel, sendMessage } from '../utils/discord';

import { getCommand, getRoleToAward } from '../utils/message';

import {
  isEventStaff,
  getAchievementLeaderboard,
  getPointLeaderboard,
  getRolePoints,
  getSubmission,
} from '../utils/nervicia';

import { AwardAction, MessageAction, Action } from '../types/base';

function _performAction(action: Action): void {
  switch (action.type) {
    case 'award':
      const { target, role, points } = action;
      addPointsToUser(target.user.username, points);
      target.addRole(role);
      return;
    case 'message':
      sendMessage(action.message, action.target);
      return;
  }
}

function _getOrganizersChannel(client: Client): TextChannel {
  const channelResult = findTextChannel(client, eventOrganizersId);

  if (channelResult.type === 'error') {
    throw new Error('The Nervicia organizers channel cannot be found!');
  }

  return channelResult.value;
}

function _buildAwardAttempt(client: Client, author: User): MessageAction {
  const target = _getOrganizersChannel(client);

  return {
    type: 'message',
    target,
    message: { message: `User ${author.username} tried to award points!` },
  };
}

function _buildAchievementLeaderboard(msg: Message): MessageAction {
  const achievementResult = getAchievementLeaderboard(msg);

  if (achievementResult.type === 'error') {
    throw new Error(achievementResult.reason);
  }

  const channel = msg.channel as GuildChannel;

  if (!isTextChannel(channel)) {
    throw new Error(`Channel ${channel.id} is not a Text Channel`);
  }

  return {
    type: 'message',
    target: channel,
    message: achievementResult.value,
  };
}

function _buildPointLeaderboard(msg: Message): MessageAction {
  const achievementResult = getPointLeaderboard(msg);

  if (achievementResult.type === 'error') {
    throw new Error(achievementResult.reason);
  }

  const channel = msg.channel as GuildChannel;

  if (!isTextChannel(channel)) {
    throw new Error(`Channel ${channel.id} is not a Text Channel`);
  }

  return {
    type: 'message',
    target: channel,
    message: achievementResult.value,
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

function _buildAwards(msg: Message): AwardAction[] {
  const { mentions, guild } = msg;
  const { members } = mentions;

  if (_.isUndefined(members)) {
    throw new Error('No users were mentioned in the command!');
  }

  const { roles } = guild;
  const roleName = getRoleToAward(msg.content);

  const points = getRolePoints(roleName);
  const role = roles.find('name', roleName);

  return _.map(members.array(), member => {
    const award: AwardAction = {
      type: 'award',
      target: member,
      role: role.id,
      points,
    };

    return award;
  });
}

function _getCommandActions(client: Client, msg: Message): Action[] {
  const command = getCommand(msg.content);

  switch (command) {
    case 'award':
      if (!isEventStaff(msg.member)) {
        return [_buildAwardAttempt(client, msg.author)];
      }

      return _buildAwards(msg);
    case 'leaderboard':
      return [_buildAchievementLeaderboard(msg)];
    case 'points':
    case 'cp':
      return [_buildPointLeaderboard(msg)];
    case 'submit':
      return [_buildSubmission(client, msg)];
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
      const actions = _getCommandActions(client, msg);
      _.each(actions, _performAction);
    } catch (error) {
      console.error(error.message); // tslint:disable-line
      return;
    }
  });
}

export { message };
