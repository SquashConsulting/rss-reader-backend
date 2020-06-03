/**
 * The Daemon service is responsible for the homonym Foxx Microservice
 * Which is used to repeatedly fetch RSS Feeds and check for updates.
 */

import DB from 'repository/database';
import { Document } from 'arangojs/lib/cjs/util/types';

/* CONSTANTS */
const { FOXX_DAEMON_MOUNT: MOUNT, FOXX_DAEMON_SCRIPT: SCRIPT } = process.env;

/* Exports */
export default { getServiceMetadata, createJob };

/* Module Functions */
async function getServiceMetadata(): Promise<Arango.Foxx.Metadata> {
  const service: Arango.Foxx.Metadata = await DB.getService(MOUNT);
  return service;
}

function createJob(feed: Document<Repo.Feed>): void {
  DB.runServiceScript(MOUNT, SCRIPT, [feed]);
}
