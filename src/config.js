// 管理 .zlclirc 文件 当前用户目录下

import { get, set, getAll, remove } from './utils/rc';
let config = async (action, k, v) => {
  console.log(action, k, v, 'config'); //set a 1

  switch (action) {
    case 'get':
      if (k) {
        let result = await get(k);
        console.log(result,'result');
      } else {
        let obj = await getAll();
      }

      break;

    case 'set':
      set(k, v);
      break;
    case 'remove':
      remove(k)
      break;
    case 'getAll':
      break;
    default:
      break;
  }
};

export default config;
