import { repoList, versionList, downloadLocal } from './utils/git';
import ora from 'ora';
import inquirer from 'inquirer';
import { promisify } from 'util';
// 统一了所有的模板引擎
import { ejs } from 'consolidate';
// 遍历文件夹，找需不需要渲染
import Metalsmith from 'metalsmith';
import fs from 'fs';
import path, { resolve } from 'path';
import ncp from 'ncp';

const copyNcp = promisify(ncp);

const waitLoading = (fn, message) => async (...args) => {
  let loading = ora(message);
  loading.start();
  let result = await fn(...args);
  loading.succeed();
  return result;
};

let install = async (programName) => {
  console.log(programName, 'programName');
  // 下载模板
  // 通过配置文件获取模板信息
  let list = await waitLoading(repoList, 'fetching template...')();
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

  const newList = await waitLoading(versionList, '正在抓取版本...')(project);

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
  // 下载文件 先下载到缓存文件中 存好 以备后期使用   zl-cli init

  const response = await waitLoading(downloadLocal, '正在下载模板......')(
    project,
    answer.tag
  );

  console.log(response, '123123123');
  // 当前下载好的模板生成到项目目录中
  // zl-cli uninstall sass less的选择
  // 复杂的模板需要渲染 渲染后再拷贝  ncp 把 template下的文件拷贝到当前执行命令的目录下

  //  metalsmith  consolidate
  // 如果有ask.js文件  .template/xx
  if (!fs.existsSync(path.join(response, 'ask.js'))) {
    await copyNcp(response, path.resolve(programName));
  } else {
    console.log('复杂模板');
    // 只要是模板编译 都需要这个模块

    // 1. 让用户填写信息  2. 用填写的信息去渲染模板

    await new Promise((resolve, reject) => {
      Metalsmith(__dirname) //如果传入路径，他会默认遍历当前目录下的src文件夹
        .source(response)
        .destination(path.resolve(programName))
        .use(async (files, metal, done) => {
          const args = require(path.join(response, 'ask.js'));
          console.log('====================================');
          console.log(args);
          console.log('====================================');
          let result = await inquirer.prompt(args);
          console.log(result, 'sss');
          const meta = metal.metadata();
          Object.assign(meta, result);
          delete files['ask.js'];
          done();
        })
        .use((files, metas, done) => {
          console.log(metas.metadata());
          let obj = metas.metadata();
          Reflect.ownKeys(files).forEach(async (file) => {
            // 处理 <%
            if (file.includes('js') | file.includes('json')) {
              let content = files[file].contents.toString(); // 文件内容
              if (content.includes('<%')) {
                // 渲染后的结果 新的内容
                content = await ejs.render(content, obj);
                // 替换刚才的内容
                files[file].contents = Buffer.from(content); //渲染 
              }
            }
          });
          done();
        })
        .build((err) => {
          if (err) {
            reject();
          } else {
            resolve();
          }
        });
    });
  }
};

export default install;
