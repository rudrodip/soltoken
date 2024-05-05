export type SiteConfig = {
  title: string;
  name: string;
  description: string;
  keywords: string[];
  author: string;
  siteUrl: string;
  ogImage: string;
  links: {
    github: string;
    twitter: string;
  };
}