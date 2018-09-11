import { Client } from 'discord.js';

import { token } from './config';

import { ready } from './events/ready';

const client = new Client();
ready(client);

client.login(token);
