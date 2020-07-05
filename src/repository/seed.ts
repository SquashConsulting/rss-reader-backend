/**
 * Seeds the repository.
 *
 * *NOTE: This file is not meant to be imported elsewhere in the project!*
 *
 * ### Examples:
 * ```sh
 * npm run seed:repo
 * ```
 *
 * @packageDocumentation
 * @category Executable
 */
import FeedService from "services/feed";

const feeds = [
  { title: "Rasjonell Tech", link: "https://rasjonell.tech/rss.xml" },
  { title: "Rasjonell's NewsBlur", link: "https://rasjonell.newsblur.com/feed" },
];

console.log("Creating Feeds...");
Promise.all(feeds.map((feed) => FeedService.createFeed(feed)))
  .then((feeds) => {
    console.log("Feeds Created:", feeds.map((feed) => feed.title).join(", "));
  })
  .catch((error) => {
    console.error("Unable to create feeds!", error);
  });
