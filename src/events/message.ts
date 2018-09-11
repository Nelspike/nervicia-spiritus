import * as _ from 'lodash';
import { Client, Message } from 'discord.js';

import { commandPrefix, eventOrganizersId } from '../config';
import { findTextChannel, generatePointList } from '../utils/discord';

import { ItemWithPoints } from '../types/base';

function _getCommand(content: string): string {
  const stripPrefix = content.substring(commandPrefix.length);
  const parts = stripPrefix.split(' ');

  return parts[0];
}

function _getLeaderboard(client: Client, msg: Message): void {
  const { guild } = msg;

  if (_.isUndefined(guild)) {
    // Handle error here, 99.9% of the time this won't happen
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

  const leaderboard = generatePointList(leaders);
  const channelResult = findTextChannel(client, eventOrganizersId);

  if (channelResult.type === 'error') {
    // Whoops!
    return;
  }

  const channel = channelResult.value;
  channel.send(leaderboard);
}

function message(client: Client): void {
  client.on('message', (msg: Message): void => {
    const { content } = msg;

    if (!_.startsWith(content, commandPrefix)) {
      return;
    }

    const command = _getCommand(content);

    switch (command) {
      case 'leaderboard':
        _getLeaderboard(client, msg);
    }
  });
}

export { message };
