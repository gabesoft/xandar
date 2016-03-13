'use strict';

const chalk = require('chalk'),
      defaultsDeep = require('lodash').defaultsDeep,
      path = require('path'),
      url = require('url'),
      conf = require('../config/store'),
      Runner = require('srunner').Runner,
      runner = new Runner(),
      yargs = require('yargs')
        .usage(`Usage: $0 ${chalk.yellow('[options]')}`)
        .option('u', {
          description: chalk.yellow('user id'),
          alias: 'user',
          demand: true,
          type: 'string'
        })
        .option('f', {
          description: chalk.yellow('input file path'),
          alias: 'file',
          demand: true,
          type: 'string'
        })
        .option('h', {
          description: chalk.yellow('show help'),
          alias: 'help'
        }),
      args = yargs.argv;

if (args.help) {
  yargs.showHelp();
  process.exit(0);
}

const data = require(args.file);
const initData = {
  dir: path.join(__dirname, '../lib/steps'),
  state: {
    root: process.cwd(),
    items: data.filter(feed => feed.state !== 'dead' && feed.state !== 'dead.dropped'),
    user: args.user,
    conf: key => conf.get(key),
    apiUrl: pathname => url.resolve(conf.get('api:url'), pathname),
    finderUrl: pathname => url.resolve(conf.get('feed-finder:url'), pathname)
  }
};

function getTags(feed) {
  const first = feed.categories.map(category => category.label);
  const rest = feed.topics || [];
  const tags = first.concat(rest);
  const map = {};

  return tags.reduce((acc, tag) => {
    if (!map[tag]) {
      tag = tag.toLowerCase().trim().replace(/\s+/g, '-').replace(/\*/g, '');
      acc.push(tag);
      map[tag] = true;
    }
    return acc;
  }, []);
}

function makeRunner(state) {
  const feed = state.item;
  return new Runner({ name: feed.title })
    .init(defaultsDeep({ state }, initData))
    .findFeed(feed.id.replace(/^feed\//, ''))
    .fetchSubscriptions({ userId: args.user, noErrors: true })
    .subscribeUser({ userId: args.user })
    .addSubscriptionTags(getTags(feed))
    .saveSubscription(null);
}

runner
  .init(initData)
  .forEachItemDo(makeRunner)
  .run((err, state) => {
    if (err) {
      state.log.error(err.message);
    } else {
      state.log.info('import complete');
    }
  });
