import * as _ from 'lodash';
import { Message } from 'discord.js';

import {
  getCommandContent,
  generatePointList,
  generateSubmission,
} from '../utils/message';

import { ItemWithPoints, MessageWithFiles, Result } from '../types/base';

function getLeaderboard(msg: Message): Result<MessageWithFiles> {
  const { guild } = msg;

  if (_.isUndefined(guild)) {
    return {
      type: 'error',
      reason: 'Could not find the server this user is in',
    };
  }

  const achievements = [
    "Captain Bash Won't Miss!",
    "Firin' Muh Laz0r!",
    "Man's Best Friend",
    '"Up"setting the Enemy',
    '420Blazeit',
    'All-Out Attack!',
    'Apocalypse Now',
    'Black-Whole',
    'Bouncy Ball',
    'Carry',
    'Cold-Blooded',
    'Crystal',
    'Crystarium',
    'Dancing Queen',
    'Director of Rage',
    'Dr. Main',
    'Fab Dab',
    'Farcical Healer',
    'Finisher',
    'Flawless Crystal',
    'For Wall Solidor!',
    'Going Commando',
    'Good Boy',
    'Hello Darkness...',
    'Heresy',
    'I Cherish',
    'Jack of All Trades',
    'King Kounter',
    'Knight of the Round',
    'Layered Onion',
    'Like A Glove',
    'Loud Jester',
    'Ohh, Soft!',
    'Ohohohoh!',
    'Outcast',
    'Over 9000',
    'Returning Champion',
    'Self-Obsessed',
    'Selfest-Loather',
    'Shield of Light',
    'Shiny Crystal',
    'Show Off',
    'Spectral Acrobatic',
    'Star Player',
    'Surfer',
    'Terminator',
    'TideTurner',
    'To the moon',
    'Top Agent',
    'Tourney Winner',
    'Treasure Hunter',
    'Trigger Happy',
  ];

  const members = guild.members.array();
  const leaders: ItemWithPoints[] = _.flatMap(members, member => {
    const { user, roles } = member;
    const { username } = user;

    const awardRoles = roles.filter(role =>
      _.includes(achievements, role.name),
    );

    const awardNames = _.map(awardRoles.array(), 'name');
    const amount = awardRoles.array().length;

    if (amount === 0) {
      return [];
    }

    return [
      {
        name: username,
        points: amount,
        list: awardNames,
      },
    ];
  });

  if (_.isEmpty(leaders)) {
    return {
      type: 'error',
      reason: 'There are no leaders or achievements',
    };
  }

  const embed = generatePointList(leaders);

  return {
    type: 'ok',
    value: { message: '', options: { embed } },
  };
}

function getSubmission(msg: Message): Result<MessageWithFiles> {
  const { author, attachments, embeds, content, guild } = msg;

  if (_.isUndefined(guild)) {
    return {
      type: 'error',
      reason: 'Could not find the server this user is in',
    };
  }

  const files = attachments.array();

  const value = generateSubmission(
    author.username,
    getCommandContent(content),
    files,
    embeds,
  );

  return { type: 'ok', value };
}

export { getLeaderboard, getSubmission };
