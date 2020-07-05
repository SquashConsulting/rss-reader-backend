declare namespace Repo {
  interface Feed {
    title: string;
    feedUrl: string;
    language: string;
    description: string;
    lastItemGuid: string;

    /* Relationships */
    items?: Repo.Document<Repo.Item>[];
  }
}
