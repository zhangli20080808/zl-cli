import { repoList } from './utils/git';
let install = async () => {
  // 下载模板
  // 通过配置文件获取模板信息
  let list = await repoList();
  list = list.map(({ name }) => name);
  console.log(list);
};

export default install;
