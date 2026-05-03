# Figma dizaynni kodga o'tkazish

## Kerakli toollar

- Figma MCP (Claude Code CLI da): `http://127.0.0.1:3845/mcp`
- Figma file key: `whwt0wJFk3XFkkXNsVgqQh`

## Audit prompt (Claude Code uchun)

```
Use Figma MCP to compare design vs code:

Figma file: https://www.figma.com/design/{file_key}
Page: {sahifa nomi}
Node: {node ID}

Compare with: {code file path}

Check:
- Colors (SCSS variables vs Figma hex)
- Typography (font-size, weight, line-height)
- Spacing (padding, margin, gap)
- Border radius
- Shadows
- Component structure

Report only — do NOT change anything.
```

## Brand colors (canonical)

| Hex | SCSS variable |
|-----|---------------|
| #19192d | $dark-blue |
| #0085ff | $blue |
| #268ae7 | $blue-link |
| #29b2ff | $blue-light |
| #768194 | $grey |
| #e8e8e8 | $border-color |
| #ffb547 | $amber |
| #4facfe | $blue-light-2 |
| #00a795 | $green |

CTA gradient: `linear-gradient(213.7deg, #29b2ff 0%, #0085ff 100%)`

## Qoidalar

- Figma da ko'rgan hex ni hardcode qilmang — SCSS variable ishlatish
- Border-radius: 8px (buttons), 12px (cards)
- Font: VK Sans Display (yuklanmaydi — Lato fallback ishlaydi)
- SVG icons: `fill="none" stroke="currentColor" stroke-width="1.5"`
- Figma da bug topsangiz → [[../bugs/known-frontend-bugs]] ga yozing
- Dizayn savol bo'lsa → [[../bugs/open-design-questions]] ga yozing
