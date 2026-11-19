import { MDXRemote } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/components/mdx";

/**
 * Renders an MDX string from the content folder with the site's components.
 * Content files are written by the site owner, so JSX expressions in props
 * (e.g. data={[…]}) are allowed; dangerous JS (eval, imports…) stays blocked.
 */
export function Mdx({ source }: { source: string }) {
  return (
    <MDXRemote
      source={source}
      components={mdxComponents}
      options={{ blockJS: false, blockDangerousJS: true }}
    />
  );
}
