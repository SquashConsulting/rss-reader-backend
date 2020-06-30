/**
 * Category Model Definition
 *
 * This Model exports the {@link "models/modelBuilder" | default} operations
 *
 * @packageDocumentation
 * @category Model
 */
import modelBuilder from "./modelBuilder";
import Category from "repository/collections/category";

export default modelBuilder<Repo.Category>(Category.collection);
