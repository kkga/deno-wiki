/** @jsxImportSource https://esm.sh/preact */

import { Crumb } from "../types.d.ts";

interface PageHeaderProps {
  currentPath: string;
  crumbs?: Crumb[];
  navItems?: Record<string, string>;
}

function PageHeader({ currentPath, crumbs, navItems }: PageHeaderProps) {
  return (
    <header class="
        flex flex(col md:row) 
        divide(y md:none gray-100 dark:gray-900) 
        justify-between md:(items-baseline) 
        text(sm neutral-9)
      ">
      {crumbs && crumbs.length > 1 && (
        <ul class="divide-slash pb(2 md:0) flex">
          {crumbs.map((crumb) => (
            <li>
              {crumb.current && crumb.slug}
              {!crumb.current && (
                <a class="text(hover:accent-12)" href={crumb.url}>
                  {crumb.slug}
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
      {navItems && Object.entries(navItems).length > 1 && (
        <ul class="divide-dot pt(2 md:0) md:(place-self-end) flex">
          {Object.entries(navItems).map(([label, path]) => (
            <li>
              {currentPath === path
                ? <span>{label}</span>
                : <a class="" href={path}>{label}</a>}
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}

export default PageHeader;
