import request from 'request';
import { getAll } from './rc';
import downLoadGitRepo from 'download-git-repo';
import { DOWNLOAD } from './constants';

const fetch = async (url) => {
  return new Promise((resolve, reject) => {
    let config = {
      url,
      method: 'get',
      headers: {
        'user-agent': 'xxx',
      },
    };
    request(config, (err, res, body) => {
      if (err) {
        reject(err);
      }
      resolve(JSON.parse(body));
    });
  });
};

export const repoList = async () => {
  let config = await getAll();
  let api = `https://api.github.com/${config.type}/${config.registry}/repos`;
  return await fetch(api);
};

// 拉去哪个仓库下面的 哪个版本号
export const versionList = async (repo) => {
  let config = await getAll();
  // https://api.github.com/repos/zhufeng-cli/vue-template/tags
  let api = `https://api.github.com/repos/${config.registry}/${repo}/tags`;
  return await fetch(api);
};

export const download = async (src, dest) => {
  return new Promise((resolve, reject) => {
    downLoadGitRepo(src, dest, (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};

export const downloadLocal = async (project, version) => {
  let config = await getAll();
  // 哪个仓库 哪个项目
  let api = `${config.registry}/${project}`;
  if (version) {
    api += `#${version}`;
  }
  const dest = `${DOWNLOAD}/${project}`;
  await download(api, dest);
  return dest;
};
