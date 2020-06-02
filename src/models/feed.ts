import { Document } from 'arangojs/lib/cjs/util/types';

import modelBuilder from './modelBuilder';
import Feed from 'repository/collections/feed';

/* Exports */
export default modelBuilder<Repo.Feed>(Feed.collection);
