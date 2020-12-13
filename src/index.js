// 命令行的命令拿到之后 这边是主的流程控制  我们最好这边 动态去加载某个文件
import { betterReuqire } from './utils/common';
import { resolve } from 'path';
let apply = (action, ...args) => {
  console.log(action, args);
  // zl-cli config set a 1    -> config [ 'set', 'a', '1' ]
  // babel-env export default => modlue.eports  = {default:XXX}会多一层    require(`${item}`).default()
  // 针对 default 去封装一个方法
  betterReuqire(resolve(__dirname, `${action}`))(...args);
};

export default apply;
