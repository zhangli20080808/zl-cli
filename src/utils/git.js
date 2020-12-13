import request from 'request';
import { getAll } from './rc';

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
