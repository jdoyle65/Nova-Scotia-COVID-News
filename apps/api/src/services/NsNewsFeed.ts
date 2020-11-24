import fetch from "node-fetch";
import xmlParser = require("fast-xml-parser");

export class NsNewsFeed {
  private static _instance: NsNewsFeed;
  protected baseUrl = "https://novascotia.ca/news/feed";
  protected dept = "180";

  static get instance() {
    if (!this._instance) {
      this._instance = new NsNewsFeed();
    }

    return this._instance;
  }
  /**
   * Singleton pattern
   */
  private constructor() {}

  async getLatest(lang?: Language): Promise<NewsFeed> {
    const res = await fetch(`${this.baseUrl}?dept=${this.dept}`);
    const xml = await res.text();
    const news = this.parseXml(xml);

    if (!lang) {
      return news;
    }

    return { entries: news.entries.filter((entry) => entry.lang === lang) };
  }

  private parseXml(xml: string): NewsFeed {
    const json = xmlParser.parse(xml, {
      ignoreAttributes: false,
    }) as NewsFeedResponse;

    return {
      entries: json.feed?.entry.map((entry) => ({
        id: entry.id,
        url: entry.id, // oddly, the id is the URL in this news feed
        lang: entry["@_xml:lang"],
        title: entry.title,
        published: entry.published,
      })),
    };
  }
}

export type Language = "en" | "fr";

export interface NewsFeed {
  entries: {
    id: string;
    url: string;
    lang: Language;
    title: string;
    published: string;
  }[];
}

export interface Author {
  name: string;
  uri: string;
}

export interface Contributor {
  name: string;
  uri: string;
}

export interface Entry {
  "@_xml:lang": Language;
  id: string;
  title: string;
  published: string;
  updated: string;
  contributor: Contributor[];
  link: string;
  summary: string;
}

export interface Feed {
  id: string;
  title: string;
  updated: string;
  author: Author;
  link: string[];
  subtitle: string;
  entry: Entry[];
}

export interface NewsFeedResponse {
  feed: Feed;
}
