/**
 * Category Controller
 *
 * @packageDocumentation
 * @category Controller
 */
import { Request, Response } from "express";
import { Document } from "arangojs/lib/cjs/util/types";

import Category from "models/category";
import ControllerDecorator from "decorators/controller";

export default ControllerDecorator({ Create });

/**
 * Given a Request defined by {@link "routes/category".CategoryRouter | CategoryRouter},
 * Creates a Category and respondes with the saved document;
 *
 * @response `Document<Repo.Category>`
 */
async function Create(req: Request, res: Response): Promise<void> {
  const body: Repo.Category = req.body.category;
  const data: Document<Repo.Category> = await Category.create(body);

  res.status(200).send({ data });
}
