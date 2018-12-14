import * as _ from 'lodash';
import { GuildMember, Message } from 'discord.js';

import {
  getCommandContent,
  generateAchievementList,
  generatePointList,
  generateSubmission,
} from '../utils/message';

import { getUser } from '../utils/storage';

import {
  ItemWithPoints,
  MessageWithFiles,
  Result,
  NerviciaUser,
} from '../types/base';

function getRolePoints(role: string): number {
  switch (role) {
    case "Captain Bash Won't Miss!":
    case "Firin' Muh Laz0r!":
    case "Man's Best Friend":
    case '"Up"setting the Enemy':
    case '420Blazeit':
    case 'All-Out Attack!':
    case 'Apocalypse Now':
    case 'Black-Whole':
    case 'Bouncy Ball':
    case 'Carry':
    case 'Cold-Blooded':
    case 'Crystal':
    case 'Crystarium':
    case 'Dancing Queen':
    case 'Director of Rage':
    case 'Dr. Main':
    case 'Fab Dab':
    case 'Farcical Healer':
    case 'Finisher':
    case 'Flawless Crystal':
    case 'For Wall Solidor!':
    case 'Going Commando':
    case 'Good Boy':
    case 'Hello Darkness...':
    case 'Heresy':
    case 'I Cherish':
    case 'Jack of All Trades':
    case 'King Kounter':
    case 'Knight of the Round':
    case 'Layered Onion':
    case 'Like A Glove':
    case 'Loud Jester':
    case 'Ohh, Soft!':
    case 'Ohohohoh!':
    case 'Outcast':
    case 'Over 9000':
    case 'Returning Champion':
    case 'Self-Obsessed':
    case 'Selfest-Loather':
    case 'Shield of Light':
    case 'Shiny Crystal':
    case 'Show Off':
    case 'Spectral Acrobatic':
    case 'Star Player':
    case 'Surfer':
    case 'Terminator':
    case 'TideTurner':
    case 'To the moon':
    case 'Top Agent':
    case 'Tourney Winner':
    case 'Treasure Hunter':
    case 'Trigger Happy':
      return 0;
    default:
      throw new Error('Role was not found');
  }
}

function isEventStaff(author: GuildMember): boolean {
  if (_.isUndefined(author)) {
    return false;
  }

  const staffRoles = ['Event Organizer', 'Event Head'];

  const { roles } = author;

  const eventRoles = roles.filter(role => _.includes(staffRoles, role.name));

  return !_.isEmpty(eventRoles);
}

function getAchievementLeaderboard(msg: Message): Result<MessageWithFiles> {
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

  const embed = generateAchievementList(leaders);

  return {
    type: 'ok',
    value: { message: '', options: { embed } },
  };
}

function getPointLeaderboard(msg: Message): Result<MessageWithFiles> {
  const { guild } = msg;

  if (_.isUndefined(guild)) {
    return {
      type: 'error',
      reason: 'Could not find the server this user is in',
    };
  }

  const members = guild.members.array();
  const leaders: NerviciaUser[] = _.map(members, member => {
    const { user } = member;
    const { username } = user;
    return getUser(username);
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

export {
  isEventStaff,
  getAchievementLeaderboard,
  getPointLeaderboard,
  getRolePoints,
  getSubmission,
};
