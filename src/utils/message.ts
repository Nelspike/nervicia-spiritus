import * as _ from 'lodash';
import { MessageAttachment, MessageEmbed, RichEmbed } from 'discord.js';

import { commandPrefix, embedThumbnail } from '../config';
import { ItemWithPoints, MessageWithFiles, NerviciaUser } from '../types/base';

function _mapAchievements(
  { name, points, list }: ItemWithPoints,
  index: number,
): { title: string; description: string } {
  return {
    title: `${index + 1}. ${name} (${points})`,
    description: _.sortBy(list).join(', '),
  };
}

function _mapPoints(
  { name, points }: NerviciaUser,
  index: number,
): { title: string; description: string } {
  return {
    title: `${index + 1}. ${name}`,
    description: `${points} Points`,
  };
}

function getCommand(content: string): string {
  const stripPrefix = content.substring(commandPrefix.length);
  const parts = stripPrefix.split(' ');

  return parts[0];
}

function getCommandContent(content: string): string {
  const parts = content.split(' ');
  return _.trim(parts.slice(1).join(' '));
}

function getRoleToAward(content: string): string {
  const command = content.substring(0, content.indexOf('<@'));
  return getCommandContent(command);
}

function generateAchievementList(items: ItemWithPoints[]): RichEmbed {
  const list = _.chain(items)
    .orderBy('points', ['desc'])
    .slice(0, 10)
    .value();

  const embed = new RichEmbed()
    .setTitle('Nervicia Achievement Leaderboards')
    .setColor('#CC6600')
    .setDescription('Here are the most notorious challengers in Nervicia!')
    .setThumbnail(embedThumbnail)
    .setTimestamp();

  _.each(list, (item, index) => {
    const { title, description } = _mapAchievements(item, index);
    embed.addField(title, description);
  });

  return embed;
}

function generatePointList(user: NerviciaUser[]): RichEmbed {
  const list = _.chain(user)
    .orderBy('points', ['desc'])
    .slice(0, 10)
    .value();

  const embed = new RichEmbed()
    .setTitle('Nervicia Point Leaderboards')
    .setColor('#CC6600')
    .setDescription('Here are the most notorious challengers in Nervicia!')
    .setThumbnail(embedThumbnail)
    .setTimestamp();

  _.each(list, (item, index) => {
    const { title, description } = _mapPoints(item, index);
    embed.addField(title, description);
  });

  return embed;
}

function generateSubmission(
  username: string,
  comment: string,
  attachments: MessageAttachment[],
  embeds: MessageEmbed[],
): MessageWithFiles {
  const embed = new RichEmbed()
    .setTitle('New Submission request!')
    .setAuthor(username)
    .setColor('#CC6600')
    .setDescription(comment)
    .setThumbnail(embedThumbnail)
    .setTimestamp();

  if (!_.isEmpty(embeds)) {
    const url = embeds[0].url;
    embed.setURL(url);
  }

  if (!_.isEmpty(attachments)) {
    const file = attachments[0].url;
    embed.setImage(file);
  }

  return {
    message: '',
    options: { embed },
  };
}

export {
  getCommand,
  getCommandContent,
  getRoleToAward,
  generateAchievementList,
  generatePointList,
  generateSubmission,
};
