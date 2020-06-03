declare namespace Repo {
  interface Feed {
    link: string;
    title: string;
    language: string;
    description: string;
    lastItemGuid: string;

    /* Relationships */
    items?: Repo.Item[];
  }
}
