let currentId = Date.now();

function nextId() {
  currentId += 1;
  return currentId;
}

module.exports = { nextId };
