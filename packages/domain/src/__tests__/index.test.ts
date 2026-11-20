import { expect, it } from '@jest/globals';
import { DOMAIN_PACKAGE } from '../index';

it('expõe o nome do pacote', () => expect(DOMAIN_PACKAGE).toBe('@pocketoo/domain'));
