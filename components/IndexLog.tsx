/** @jsxImportSource npm:preact */

import { Page } from "../types.d.ts";
import Article from "./Article.tsx";

interface IndexLogProps {
  items: Page[];
  lang: Intl.LocalesArgument;
}

export default function IndexList(props: IndexLogProps) {
  return (
    <section class="text(sm)">
      {Array.isArray(props.items) && (
        <ul class="-mx-4 flex flex-col gap-4">
          {props.items.map((item) => (
            <div class="box rounded-xl p-4">
              <Article page={item} lang={props.lang} compact={true} />
            </div>
          ))}
        </ul>
      )}
    </section>
  );
}
