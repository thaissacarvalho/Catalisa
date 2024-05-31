let userHash = null;

module.exports = {
  setUserHash: (hash) => {
    userHash = hash;
  },
  getUserHash: () => userHash,
};
