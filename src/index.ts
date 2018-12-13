import { Client } from 'discord.js';

import { token } from './config';

import { ready } from './events/ready';
import { message } from './events/message';

const client = new Client();
ready(client);
message(client);

client.login(token);
