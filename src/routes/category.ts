/**
 * `/categories` Router Initilzer
 *
 * @packageDocumentation
 * @category Router
 */
import { Router } from 'express';
import validateRequest from 'express-joi-validator';

import Category from 'repository/collections/category';
import CategoryController from 'controllers/category';

/**
 * CategoryRouter defines the following routes:
 *
 * * POST `/` - Adds a new RSS Category 
 *   * Body: {@link "repository/collections/category".schema | Category Schema}
 */
const CategoryRouter: Router = Router();

CategoryRouter.post(
  '/',
  validateRequest({
    body: {
      category: Category.schema,
    },
  }),
  CategoryController.Create,
);

export default CategoryRouter;
