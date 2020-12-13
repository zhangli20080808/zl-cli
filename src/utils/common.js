// 封装 原始 reqiuire

export const betterReuqire = (absPath) => {
  let module = require(absPath);
  if (module.default) {
    return module.default;
  }
  return module;
};
