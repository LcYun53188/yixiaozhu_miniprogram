const store = require("../data/store");
const { nextId } = require("../utils/id");
const aiService = require("./aiService");

function upsertMatch(resource, need) {
  const result = aiService.scoreMatch(resource, need);
  if (result.score < 40) return null;

  const existing = store.matches.find(
    (item) => item.resourceId === resource.id && item.needId === need.id
  );
  const now = new Date().toISOString();

  if (existing) {
    existing.matchScore = result.score;
    existing.matchReason = result.reason;
    existing.updatedAt = now;
    return existing;
  }

  const record = {
    id: nextId(),
    resourceId: resource.id,
    needId: need.id,
    matchScore: result.score,
    matchReason: result.reason,
    status: "recommended",
    createdAt: now,
    updatedAt: now
  };
  store.matches.push(record);
  return record;
}

function generateForTarget(targetType, targetId) {
  const created = [];

  if (targetType === "resource") {
    const resource = store.resources.find((item) => item.id === Number(targetId));
    if (!resource) return created;
    store.needs
      .filter((item) => item.reviewStatus === "passed" && item.deletedFlag === 0)
      .forEach((need) => {
        const match = upsertMatch(resource, need);
        if (match) created.push(match);
      });
  }

  if (targetType === "need") {
    const need = store.needs.find((item) => item.id === Number(targetId));
    if (!need) return created;
    store.resources
      .filter((item) => item.reviewStatus === "passed" && item.deletedFlag === 0)
      .forEach((resource) => {
        const match = upsertMatch(resource, need);
        if (match) created.push(match);
      });
  }

  return created;
}

function listWithDetail(query = {}) {
  let rows = [...store.matches];
  if (query.resourceId) rows = rows.filter((item) => item.resourceId === Number(query.resourceId));
  if (query.needId) rows = rows.filter((item) => item.needId === Number(query.needId));
  if (query.status) rows = rows.filter((item) => item.status === query.status);

  return rows.map((item) => ({
    ...item,
    resource: (() => {
      const resource = store.resources.find((row) => row.id === item.resourceId);
      return resource
        ? {
            ...resource,
            user: store.users.find((user) => user.id === resource.userId)
          }
        : null;
    })(),
    need: (() => {
      const need = store.needs.find((row) => row.id === item.needId);
      return need
        ? {
            ...need,
            user: store.users.find((user) => user.id === need.userId)
          }
        : null;
    })()
  }));
}

module.exports = { generateForTarget, listWithDetail };
