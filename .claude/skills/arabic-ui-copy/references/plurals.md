# Arabic plurals in UI strings

Arabic has six CLDR plural categories. English-style `one/other` produces
wrong Arabic («2 منتجات» is fine but «1 منتجات» and «11 منتجات» are wrong).

| Category | Numbers | Pattern | Example (item = منتج) |
|---|---|---|---|
| zero | 0 | special phrase | لا توجد منتجات |
| one | 1 | singular, no number | منتج واحد |
| two | 2 | dual, no number | منتجان |
| few | 3–10 (and x03–x10) | number + plural (genitive) | 3 منتجات |
| many | 11–99 (and x11–x99) | number + singular accusative | 11 منتجًا |
| other | 100, 101, 102… | number + singular | 100 منتج |

## ICU example (next-intl / FormatJS)

```json
"cartCount": "{count, plural, =0 {السلة فارغة} one {منتج واحد} two {منتجان} few {# منتجات} many {# منتجًا} other {# منتج}}"
```

```json
"ordersToday": "{count, plural, =0 {لا توجد طلبات اليوم} one {طلب واحد اليوم} two {طلبان اليوم} few {# طلبات اليوم} many {# طلبًا اليوم} other {# طلب اليوم}}"
```

Rules:
- Keep `#` and `{count}` exactly; never translate the keyword `plural` or the
  category names.
- Duals change with case («منتجان» / «منتجَين»); in UI use the nominative form
  unless the sentence clearly needs otherwise.
- If the i18n library only supports `one/other`, rephrase to avoid counting:
  «عدد المنتجات: 3».
- Feminine nouns (قطعة، ساعة) follow the same categories: قطعة واحدة / قطعتان /
  3 قطع / 11 قطعة / 100 قطعة.
