import { DOMAIN_PACKAGE } from '@pocketoo/domain';
import { setGlobalOptions } from 'firebase-functions/v2';
import { REGION } from '../index';
jest.mock('firebase-functions/v2', () => ({ setGlobalOptions: jest.fn() }));

it('configura região e limite de instâncias', () => {
  expect(REGION).toBe('southamerica-east1');
  expect(setGlobalOptions).toHaveBeenCalledWith({ region: REGION, maxInstances: 2 });
});
it('resolve o workspace do domínio', () => expect(DOMAIN_PACKAGE).toBe('@pocketoo/domain'));
