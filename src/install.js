import { repoList, versionList, downloadLocal } from './utils/git';
import ora from 'ora';
import inquirer from 'inquirer';

let install = async () => {
  // 下载模板
  // 通过配置文件获取模板信息
  let loading = ora('fetching template...');
  loading.start();
  let list = await repoList();
  loading.succeed();
  list = list.map(({ name }) => name);
  let answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'project',
      choices: list,
      question: 'please choose template',
    },
  ]);
  // 项目名字
  let project = answer.project;
  // 获取当前项目的 版本号 有可能拉某个版本
  // console.log(answer.project);
  loading = ora('正在抓取版本...');
  loading.start();
  const newList = await versionList(project);
  loading.succeed();
  const versionTag = newList.map(({ name }) => name);
  answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'tag',
      choices: versionTag,
      question: '请选择需要拉取的版本s',
    },
  ]);
  console.log(project, answer.tag);
  // 下载文件 先下载到缓存文件中  zl-cli init
  loading = ora('正在下载模板...');
  loading.start();
  await downloadLocal(project, answer.tag);
  loading.succeed();
  // vue可能会使用模板引擎
  // 当前下载好的模板生成到项目目录中
  // zl-cli uninstall sass less的选择
};

export default install;
