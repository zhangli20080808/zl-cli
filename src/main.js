import program, { help } from 'commander';

import { VERSION } from './utils/constants';

import apply from './index';

// 映射表
let actionMap = {
  create: {
    description: 'create a program',
    alias: 'i',
    examples: ['zl-cli create xxx'],
  },

  install: {
    description: 'install template',
    alias: 'i',
    examples: ['zl-cli i', 'zl-cli install'],
  },
  config: {
    alias: 'c',
    description: 'config .zlclirc',
    examples: [
      'zl-cli config set <k> <v>',
      'zl-cli config get <k> <v>',
      'zl-cli config remove <k> <v>',
    ],
  },
  '*': {
    alias: '',
    description: 'not found',
    examples: [],
  },
};

Object.keys(actionMap).forEach((item) => {
  program
    .command(item)
    .alias(actionMap[item].alias)
    .description(actionMap[item].description)
    .action(() => {
      // 判断当前是什么操作
      if (item === 'config') {
        // 实现更改配置文件
        apply(item, ...process.argv.slice(3));
      } else if (item === 'install') {
        apply(item,...process.argv.slice(3));
      } else if (item === 'create') {
        apply(item, ...process.argv.slice(3));
      }
    });
});

function helps() {
  console.log('\r\n  ' + 'how to use command');
  //  Reflect.ownKeys() 和 Object.keys类似 但是支持symbol

  Object.keys(actionMap).forEach((item) => {
    actionMap[item].examples.forEach((cur) => {
      console.log('  ' + cur);
    });
  });
}

program.on('h', helps);
program.on('--help', helps);

// zl-cli config 一般为配置文件
// zl-cli install
// 解析用户传递过来的参数
program.version(VERSION, '-v --version').parse(process.argv);
