const info = (...params) => {
  if (process.env.NODE_ENV) {
    console.log(...params);
  }
};

const error = (...params) => {
  if (process.env.NODE_ENV) {
    console.log(...params);
  }
};

module.exports = { info, error };
