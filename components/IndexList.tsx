import { apply, css, FC, h, tw } from "../deps.ts";
import { Page } from "../types.d.ts";

const styles = {
  section: css({
    "&:not(:hover)": {
      a: apply`text-gray-500!`,
    },
  }),
};

const Item: FC<{
  title?: string;
  url?: URL;
  pinned?: boolean;
  isIndex?: boolean;
  date?: Date;
}> = (
  { title, url, pinned, date, isIndex },
) => {
  return (
    <li
      class={tw`
        relative
        flex
        gap-2
        items-baseline
        justify-between
        leading-6`}
    >
      {pinned && (
        <div class={tw`absolute -left-5 opacity-50 select-none`}>★</div>
      )}
      <a className={tw`font-medium`} href={url.pathname}>
        {title}
      </a>
      {isIndex && <div class={tw`-ml-1 opacity-50 select-none`}>/ ..</div>}
      <span
        class={tw`
        flex-1
        border(b dashed gray-200) dark:(border-gray-700)`}
      />
      {date && (
        <time class={tw`text-xs`} dateTime={date.toString()}>
          {date.toLocaleDateString()}
        </time>
      )}
    </li>
  );
};

const IndexList: FC<{ title: string; items: Page[] }> = (
  { title, items },
) => {
  return (
    <section class={tw`text(gray-500) ${styles.section}`}>
      <h6
        class={tw`
          flex
          items-baseline
          gap-2
          text-xs
          leading-6
          uppercase
          tracking-wide
          `}
      >
        {title}
        <span
          class={tw`flex-1 border(b solid gray-200) dark:(border-gray-700)`}
        />
      </h6>
      <ul class={tw`flex flex-col`}>
        {items.map((item: Page) => (
          <Item
            title={item.title}
            url={item.url}
            isIndex={item.isIndex}
            pinned={item.pinned}
            date={item.datePublished}
          />
        ))}
      </ul>
    </section>
  );
};

export default IndexList;
