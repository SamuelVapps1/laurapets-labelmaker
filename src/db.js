import Dexie from "dexie";

export const db = new Dexie("labelmaker");

db.version(1).stores({
  labels: "++id, brand, name, sku, updatedAt",
});

export const createLabel = async (label) => {
  const id = await db.labels.add(label);
  return id;
};

export const updateLabel = async (id, label) => {
  await db.labels.update(id, label);
};

export const getLabel = async (id) => db.labels.get(id);

export const listLabels = async () =>
  db.labels.orderBy("updatedAt").reverse().toArray();
