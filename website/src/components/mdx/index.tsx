import type { MDXComponents } from "mdx/types";
import { Step } from "./Step";
import { Scribble, Mark, Arrow } from "./Annotations";
import { BarChart, LineChart, Flow, Stat, Timeline } from "./Charts";
import { Lede, DemoNotice, Callout, RegionMap, Figure } from "./Blocks";
import { Todo } from "../Text";
import { Learned } from "./Learned";
import { Scorecard, Scenarios, PullQuote } from "./Story";

/** Every component that can be used inside an .mdx content file. */
export const mdxComponents: MDXComponents = {
  Step, Scribble, Mark, Arrow, BarChart, LineChart, Flow, Stat, Timeline,
  Lede, DemoNotice, Callout, RegionMap, Figure, Learned, Scorecard, Scenarios, PullQuote,
  TODO: Todo,
};
