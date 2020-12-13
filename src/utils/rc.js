import { RC, DEFAUTLS } from './constants';
//  RC是配置文件 DEFAUTLS 是默认配置

import { decode, encode } from 'ini';
import { promisify } from 'util';
import fs from 'fs';

let exists = promisify(fs.exists);
let readFile = promisify(fs.readFile);
let writeFile = promisify(fs.writeFile);

export const get = async (k) => {
  let has = await exists(RC);
  let opts;
  if (has) {
    opts = await readFile(RC, 'utf8');
    opts = decode(opts);
    return opts[k];
  }
  return '';
};
export const set = async (k, v) => {
  // 将传进来的值 做一个对象合并
  let has = await exists(RC);
  let opts;
  if (has) {
    opts = await readFile(RC, 'utf8');
    opts = decode(opts);
    Object.assign(opts, { [k]: v });
  } else {
    opts = Object.assign(DEFAUTLS, { [k]: v });
  }
  await writeFile(RC, encode(opts), 'utf8');
};
export const remove = async (k) => {
  let has = await exists(RC);
  let opts;
  if (has) {
    opts = await readFile(RC, 'utf8');
    opts = decode(opts);
    delete opts[k];
  }
  await writeFile(RC, encode(opts), 'utf8');
};

export const getAll = async () => {
  let has = await exists(RC);
  let opts;
  if (has) {
    opts = await readFile(RC, 'utf8');
    opts = decode(opts);
    return opts;
  }
  return {};
};
