import { setGlobalOptions } from 'firebase-functions/v2';

export const REGION = 'southamerica-east1';

setGlobalOptions({ region: REGION, maxInstances: 2 });
