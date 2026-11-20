import { assertFails, initializeTestEnvironment } from '@firebase/rules-unit-testing';
import type { RulesTestContext, RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { collection, collectionGroup, deleteDoc, doc } from 'firebase/firestore';
import { getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

type Db = ReturnType<RulesTestContext['firestore']>;
let env: RulesTestEnvironment;
const rules = readFileSync(resolve(__dirname, '../../firestore.rules'), 'utf8');
beforeAll(async () => {
  env = await initializeTestEnvironment({ projectId: 'demo-pocketoo', firestore: { rules } });
});
afterAll(() => env.cleanup());

const operations: Record<string, (db: Db, path: string) => Promise<unknown>> = {
  lê: (db, path) => getDoc(doc(db, path)),
  lista: (db, path) => getDocs(collection(db, path.slice(0, path.lastIndexOf('/')))),
  'lista por grupo': (db, path) => getDocs(collectionGroup(db, path.split('/').at(-2)!)),
  cria: (db, path) => setDoc(doc(db, path), { a: 1 }),
  atualiza: (db, path) => updateDoc(doc(db, path), { a: 2 }),
  apaga: (db, path) => deleteDoc(doc(db, path)),
};
const cases = ['anônimo', 'autenticado'].flatMap((user) =>
  ['workspaces/w1', 'workspaces/w1/transactions/t1'].flatMap((path) =>
    Object.keys(operations).map((op) => [user, op, path]),
  ),
);
it.each(cases)('nega: %s %s %s', async (user, op, path) => {
  const ctx = user === 'anônimo' ? env.unauthenticatedContext() : env.authenticatedContext('u1');
  await assertFails(operations[op!]!(ctx.firestore(), path!));
});
