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

- Use scoped `.section-light` semantic token overrides for light page bands; this keeps dark photo overlays and shared components intact.
- Keep event-details rangoli in a responsive square in normal document flow, separate from the details text, so the whole artwork stays visible.
- Adapt Componentry's ScrollTiltedGrid locally with per-image aspect ratios and uncropped media; keep smooth scrolling disabled so the page has one native scroll owner.
- Use a shared RegisterButton for registration entry points; its destination is available only when registration is open and a URL is supplied, otherwise it shows a coming-soon dialog.
- Maintain a transparent light-background logo variant with dark neutral lettering; keep the original logo for dark sections to preserve contrast.
