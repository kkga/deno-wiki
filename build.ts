import { basename, dirname, join } from "path/mod.ts";
import { compile, configure, render, templates } from "eta";

import { Page } from "./pages.ts";
import { SiteConfig } from "./config.ts";
import { hasKey } from "./attributes.ts";

configure({ autotrim: true });

interface Breadcrumb {
  slug: string;
  url: string;
  current: boolean;
  isTag?: boolean;
}

interface PageOpts {
  headInclude: string;
  includeRefresh: boolean;
  childPages: Array<Page>;
  backlinkPages: Array<Page>;
  taggedPages: { [tag: string]: Array<Page> };
  childTags: Array<string>;
  view: string;
  siteConf: SiteConfig;
  style: string;
}

interface TagPageOpts {
  headInclude: string;
  includeRefresh: boolean;
  taggedPages: Array<Page>;
  view: string;
  siteConf: SiteConfig;
  style: string;
}

const sortPages = (pages: Page[]): Page[] =>
  pages
    .sort((a, b) => {
      if (a.date && b.date) return b.date.valueOf() - a.date.valueOf();
      else return 0;
    })
    .sort((page) => page.isIndex ? -1 : 0)
    .sort((page) => hasKey(page.attrs, ["pinned"]) ? -1 : 0);

function generateBreadcrumbs(
  currentPage: Page,
  homeSlug?: string,
): Array<Breadcrumb> {
  const dir = dirname(currentPage.url.pathname);
  const chunks: string[] = dir.split("/").filter((ch: string) => !!ch);
  const slug = basename(currentPage.url.pathname);

  let breadcrumbs: Array<Breadcrumb> = chunks.map((chunk, i) => {
    const slug = chunk;
    const url = join("/", ...chunks.slice(0, i + 1));
    return {
      slug,
      url,
      current: false,
    };
  });

  if (currentPage.url.pathname !== "/") {
    breadcrumbs = [
      { slug: homeSlug ?? "index", url: "/", current: false },
      ...breadcrumbs,
    ];
  }

  if (slug !== "") {
    breadcrumbs = [
      ...breadcrumbs,
      { slug, url: "", current: true },
    ];
  }

  return breadcrumbs;
}

export async function buildPage(
  page: Page,
  opts: PageOpts,
): Promise<string | void> {
  const breadcrumbs = generateBreadcrumbs(page, opts.siteConf.rootName);
  const backlinkPages = sortPages(opts.backlinkPages);
  const childPages = sortPages(opts.childPages);
  const useLogLayout = hasKey(page.attrs, ["log"]) && page.attrs?.log === true;
  const showToc = hasKey(page.attrs, ["toc"]) && page.attrs?.toc === true;
  const taggedPages: { [tag: string]: Array<Page> } = {};

  for (const tag of Object.keys(opts.taggedPages)) {
    const tagIndex = sortPages(
      opts.taggedPages[tag].filter((taggedPage) => taggedPage !== page),
    );
    if (tagIndex.length !== 0) {
      taggedPages[tag] = tagIndex;
    }
  }

  templates.define("head", compile(opts.headInclude));

  return await render(opts.view, {
    page,
    indexLayout: useLogLayout ? "log" : "default",
    toc: showToc,
    breadcrumbs,
    childPages,
    backlinkPages,
    pagesByTag: taggedPages,
    childTags: opts.childTags,
    site: opts.siteConf,
    style: opts.style,
    includeRefresh: opts.includeRefresh,
  });
}

export async function buildTagPage(
  tagName: string,
  opts: TagPageOpts,
): Promise<string | void> {
  templates.define("head", compile(opts.headInclude));
  const breadcrumbs: Array<Breadcrumb> = [
    { slug: "index", url: "/", current: false },
    { slug: `#${tagName}`, url: "", current: true, isTag: true },
  ];

  const result = await render(opts.view, {
    page: {
      title: `#${tagName}`,
      description: `Pages tagged #${tagName}`,
    },
    tagName,
    breadcrumbs,
    childPages: sortPages(opts.taggedPages),
    site: opts.siteConf,
    style: opts.style,
    includeRefresh: opts.includeRefresh,
  });
  return result;
}

export async function buildFeed(
  pages: Array<Page>,
  view: string,
  siteConf: SiteConfig,
): Promise<string | void> {
  const result = await render(view, {
    pages,
    site: siteConf,
  });
  return result;
}
