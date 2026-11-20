import { assertFails, initializeTestEnvironment } from '@firebase/rules-unit-testing';
import type { RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

let env: RulesTestEnvironment;
const rules = readFileSync(resolve(__dirname, '../../firestore.rules'), 'utf8');
beforeAll(async () => {
  env = await initializeTestEnvironment({ projectId: 'demo-pocketoo', firestore: { rules } });
});
afterAll(() => env.cleanup());

const cases = ['anônimo', 'autenticado'].flatMap((u) =>
  ['workspaces/w1', 'qualquer/x1'].flatMap((p) => [
    [u, 'lê', p],
    [u, 'escreve', p],
  ]),
);
it.each(cases)('nega: %s %s %s', async (user, op, path) => {
  const ctx = user === 'anônimo' ? env.unauthenticatedContext() : env.authenticatedContext('u1');
  const ref = doc(ctx.firestore(), path);
  await assertFails(op === 'lê' ? getDoc(ref) : setDoc(ref, { a: 1 }));
});
