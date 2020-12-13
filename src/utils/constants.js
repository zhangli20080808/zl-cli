import { version } from '../../package.json';

export const VERSION = version;
// 找到用户的 根目录 注意 区分mac 还是 window
const HOME = process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'];
export const RC = `${HOME}/.zlclirc`;

// RC 配置下载模板的地方  给github的api来用  我们的type参数

// 用户目录 users  组织目录  orgs

export const DEFAUTLS = {
  registry: 'zhufeng-cli',
  type: 'orgs',
};


// 下载目录
export const DOWNLOAD = `${HOME}/.template`