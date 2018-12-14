import * as _ from 'lodash';
import * as loki from 'lokijs';

import { NerviciaUser } from '../types/base';

const database = new loki('nervicia.db', {
  autoload: true,
  autoloadCallback: loadDatabase,
  autosave: true,
  autosaveInterval: 10000,
});

function loadDatabase(): void {
  const users = database.getCollection('users');

  if (!users) {
    database.addCollection('users');
  }
}

function updateUser(name: string, points: number): boolean {
  const users = database.getCollection('users');
  const user: NerviciaUser = users.find({ name })[0];

  if (_.isUndefined(user)) {
    users.insert({ name, points });
    return true;
  }

  user.points = points;
  users.update(user);
  return true;
}

function addPointsToUser(name: string, points: number): boolean {
  const users = database.getCollection('users');
  const user: NerviciaUser = users.find({ name })[0];

  if (_.isUndefined(user)) {
    users.insert({ name, points });
    return true;
  }

  user.points += points;
  users.update(user);
  return true;
}

function getUser(name: string): NerviciaUser {
  const users = database.getCollection('users');
  const user: NerviciaUser = users.find({ name })[0];

  if (_.isUndefined(user)) {
    const newUser = { name, points: 0 };
    users.insert(newUser);
    return newUser;
  }

  return user;
}

export { loadDatabase, updateUser, addPointsToUser, getUser };
