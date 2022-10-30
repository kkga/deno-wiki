import { css } from "twind/css";
import { apply } from "twind/";

export const styleUtils = {
  childrenDivider: css({
    "& > * + *::before": { content: '"·"', margin: "0 1ch" },
  }),

  linkDimmer: css({
    "&:not(:hover)": { a: apply`text-gray-500!` },
    "&:hover": { a: apply`text-black dark:(text-white)` },
    a: apply`transition-colors no-underline hover:underline`,
  }),
};
