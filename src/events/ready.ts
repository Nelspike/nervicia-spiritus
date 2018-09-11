import * as _ from 'lodash';
import { Client } from 'discord.js';

import { eventOrganizersId } from '../config';

import { findTextChannel } from '../utils/discord';

function ready(client: Client): void {
  client.on('ready', () => {
    const channelResult = findTextChannel(client, eventOrganizersId);

    if (channelResult.type === 'error') {
      throw new Error(channelResult.reason);
    }

    const channel = channelResult.value;
    channel.send("Guess who's in town, boys!");
  });
}

export { ready };
