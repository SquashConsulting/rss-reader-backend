/**
 * The Daemon service is responsible for the homonym Foxx Microservice,
 * which is used to repeatedly fetch RSS Feeds and check for updates.
 *
 * ### Examples:
 * ```typescript
 * const feed: Document<Repo.Feed> = Feed.save(feedBody);
 * Daemon.createJob(feed);
 * ```
 *
 * @packageDocumentation
 * @category Service
 */

import DB from "repository/database";
import { Document } from "arangojs/lib/cjs/util/types";

const { FOXX_DAEMON_MOUNT: MOUNT, FOXX_DAEMON_SCRIPT: SCRIPT } = process.env;

export default { getServiceMetadata, createJob };

/**
 * @returns metadata about the `Daemon` Foxx Service.
 */
async function getServiceMetadata(): Promise<Arango.Foxx.Metadata> {
  const service: Arango.Foxx.Metadata = await DB.getService(MOUNT);
  return service;
}

/**
 * Given a {@link "repository/collections/feed" | Feed},
 * pushes a job into Foxx Queue to repeatedly fetch the Feed.
 */
function createJob(feed: Document<Repo.Feed>): void {
  DB.runServiceScript(MOUNT, SCRIPT, [feed]);
}
