/**
 * The Parser service is responsible for RSS Feed parsing.
 */

import Parser from 'rss-parser';

/* Constants */
const PARSER = new Parser();

/* Exports */
export default { parseURL };

/* Module Functions */
async function parseURL(url: string): Promise<Parser.Output> {
  try {
    const feed = await PARSER.parseURL(url);
    return feed;
  } catch (error) {
    throw buildError(error);
  }
}

function buildError(error: Error): Error & { statusCode?: number } {
  // Standardizing possible error messages
  // Error messages taken from: https://github.com/rbren/rss-parser/blob/master/lib/parser.js
  let newError: Error & { statusCode?: number } = new Error(error.message);

  if (error.message.startsWith('Status code')) {
    const [, statusCode] = error.message.split('Status code ');
    newError.statusCode = parseInt(statusCode, 10);
  } else if (error.message.startsWith('Request timed out')) {
    newError.statusCode = 408;
  } else {
    newError.statusCode = 400;
  }

  return newError;
}
