import * as _ from 'lodash';
import { MessageAttachment, MessageEmbed, RichEmbed } from 'discord.js';

import { commandPrefix } from '../config';
import { ItemWithPoints, MessageWithFiles } from '../types/base';

function _mapPoints(
  { name, points, list }: ItemWithPoints,
  index: number,
): { title: string; description: string } {
  return {
    title: `${index + 1}. ${name} (${points})`,
    description: _.sortBy(list).join(', '),
  };
}

function getCommand(content: string): string {
  const stripPrefix = content.substring(commandPrefix.length);
  const parts = stripPrefix.split(' ');

  return parts[0];
}

function getCommandContent(content: string): string {
  const parts = content.split(' ');
  return parts.slice(1).join(' ');
}

function generatePointList(items: ItemWithPoints[]): RichEmbed {
  const list = _.chain(items)
    .orderBy('points', ['desc'])
    .slice(0, 10)
    .value();

  const embed = new RichEmbed()
    .setTitle('Nervicia Achievement Leaderboards')
    .setColor('#CC6600')
    .setDescription('Here are the most notorious challengers in Nervicia!')
    .setThumbnail(
      'https://cdn.discordapp.com/attachments/478262073000722434/522760983924572161/Achievementbanner.png',
    )
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
  const files = _.map(attachments, 'url');

  const url = embeds[0].url; // tslint:disable-line

  const embed = new RichEmbed()
    .setTitle('New Submission request!')
    .setAuthor(username)
    .setColor('#CC6600')
    .setDescription(comment)
    .setThumbnail(
      'https://cdn.discordapp.com/attachments/478262073000722434/522760983924572161/Achievementbanner.png',
    )
    .setURL(url)
    .setTimestamp();

  return {
    message: '',
    options: { files, embed },
  };
}

export { getCommand, getCommandContent, generatePointList, generateSubmission };
