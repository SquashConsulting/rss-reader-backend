declare namespace Repo {
  interface Feed {
    link: string;
    title: string;
    language: string;
    description: string;
    items?: Repo.Item[];
  }
}
