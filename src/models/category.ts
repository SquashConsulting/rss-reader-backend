import { Document } from 'arangojs/lib/cjs/util/types';

import modelBuilder from './modelBuilder';
import Category from 'repository/collections/category';

/* Exports */
export default modelBuilder<Repo.Category>(Category.collection);
