<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture
- Public catalog reads go through `getCatalog` (src/lib/catalog.functions.ts) with a publishable-key client; pages never use static product lists. Why: admin edits must show up in the store.
- Admin panel (/admin) writes directly via the browser client; RLS `has_role(admin)` is the real gate. Why: no duplicated server permission logic.
- Product covers live in bucket `product-media` (public read policy); PDFs/ZIPs in private `product-files`, served only via `getDownloadUrl` signed links for paid orders. Why: protect paid files.
