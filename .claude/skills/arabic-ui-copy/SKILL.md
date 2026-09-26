---
name: arabic-ui-copy
description: Writes and reviews Arabic interface text (microcopy) for apps, websites and online stores in Kuwait and the Gulf — buttons, form labels, error messages, empty states, checkout, cash-on-delivery, delivery tracking, driver and supplier screens, notifications, SMS/WhatsApp order updates, onboarding, and ar.json translation files. Use whenever Ali needs the Arabic words that appear on a screen, e.g. The Edit store, alimubarak1.com's Arabic version, a clinic booking page, or the Koshari Bites ordering flow — including "translate the store to Arabic", "write the Arabic for this button/error", "fill messages/ar.json", "review our Arabic UI", «النصوص العربية للتطبيق», «رسائل الخطأ», «زر الدفع بالعربي». Not for long-form writing, social captions, letters or books (other skills own those) — this one is for short text people read while using a product.
---

# Arabic UI copy

Interface Arabic is read in half a second while someone is trying to do
something. It should sound like a well-built Kuwaiti app — clear Modern
Standard Arabic with Gulf ease — not a translated English screen and not a
government circular. The test for every string: does the user know what
happened and what to do next?

## Before writing

Collect (from the request, the code, or sensible defaults — ask only if the
answer changes safety, e.g. whether a payment really failed):

- the screen and the user's goal on it
- the state (empty, loading, success, error, pending, destructive)
- what action is available next
- space limits (button ≈ 2–3 words, toast ≈ 1 line)
- audience register (store customers → warm; admin/supplier/driver → brief, operational)

## Core rules

1. **Lead with the meaning.** «اكتمل الطلب» not «نود إعلامكم بأنه قد تم إكمال طلبكم».
2. **Active verbs, named outcomes.** Buttons say what will happen: «أكمل الدفع»،
   «أضف إلى السلة»، «احفظ العنوان» — avoid bare «موافق» / «متابعة» when the result
   can be named.
3. **No bureaucratic padding.** Cut «في إطار حرصنا»، «يرجى التكرم بالعلم»،
   «يسعدنا ويشرفنا»، «تم + مصدر» chains, «من قِبل». Formal courtesy belongs in
   letters, not screens.
4. **Errors: what failed + why (if known) + what to do.** No blame, no codes
   alone. «تعذّر إرسال الرمز. تحقق من رقمك وحاول مرة أخرى.»
5. **Payments are sacred.** Distinguish *failed* from *pending*. Never tell a
   user to pay again unless the charge is confirmed as not taken. Never invent
   refund times or guarantees.
6. **Gender-neutral by construction.** Arabic verbs are gendered. Prefer forms
   that read naturally for everyone: plural address in warm contexts
   («سجّلوا دخولكم») is Gulf-natural; in compact UI use verbal nouns and
   impersonal phrasing («تسجيل الدخول»، «مطلوب رقم الهاتف»). Imperative
   masculine (أدخل) is acceptable and conventional for short buttons — but be
   consistent across the product. Never guess a user's gender.
7. **One term per concept.** Pick once, record in the glossary, never
   alternate (سلة vs حقيبة، حساب vs ملف شخصي).
8. **Register lock.** MSA base. Light Gulf warmth allowed in marketing moments
   of a consumer store («يا هلا»، «تسلم») — never in payment, errors, legal or
   account security. Don't mix dialect and MSA inside one flow.
9. **Numbers & bidi.** KWD has 3 decimals: `12.500 د.ك`. Phone `+965 5XXX XXXX`.
   Keep prices, order IDs, codes and phones isolated (`<bdi>`) and LTR. Choose
   Western or Arabic-Indic digits once per product (Western is standard for
   Kuwaiti commerce) and apply everywhere.
10. **Preserve code.** Never translate or drop placeholders (`{amount}`,
    `%s`, `${name}`), ICU syntax, HTML tags or keys. Arabic ICU plurals need
    `zero, one, two, few, many, other` — see `references/plurals.md`.

## Patterns

| State | Structure | Example |
|---|---|---|
| Empty | what's missing + possible action | «سلتك فارغة» / «تصفّح الإصدار الحالي وأضف ما يعجبك» / [تسوّق الآن] |
| Fixable error | what failed + cause + action | «رقم الهاتف غير مكتمل. أدخل ٨ أرقام بعد +965.» |
| Success | what completed + next step | «تم استلام طلبك رقم ‎TE-1042‎. سنرسل لك تحديثات التوصيل عبر واتساب.» |
| Pending | current state + honest expectation | «ننتظر تأكيد الدفع من البنك. لا تُعِد الدفع؛ سنحدّث حالة الطلب تلقائيًا.» |
| Destructive | what will be deleted + consequence + explicit button | «حذف العنوان "المنزل"؟ لن يظهر في طلباتك القادمة.» [احذف العنوان] [إلغاء] |
| Loading | what's happening (time only if reliable) | «نجهّز طلبك…» |
| Permission | benefit + data used + choice | «استخدم موقعك لتحديد عنوان التوصيل بدقة، أو أدخل المنطقة يدويًا.» |

(«تم استلام» is fine for a single completed event; the rule is against «تم»
chains in running text.)

## Workflow

1. For a whole flow or file (e.g. `messages/ar.json`, a store page): read the
   English source and the code together so each string's context is known.
2. Draft Arabic following the rules; for a JSON file, output the full file with
   identical keys and untouched placeholders.
3. Check each string against: length fits the element, meaning first, correct
   state (failed vs pending), glossary terms, placeholders intact, gender
   handling consistent, digits consistent.
4. When reviewing existing copy, report as a table: `key/location | current |
   issue | proposed`.
5. If the screen will render the text, remind about `lang="ar" dir="rtl"` and
   the arabic-rtl-web skill for layout.

## References

- `references/glossary-kuwait-commerce.md` — approved terms for store,
  delivery, payment, account and admin/driver/supplier screens (Kuwait usage).
  Read it for any store or checkout work.
- `references/plurals.md` — Arabic plural categories with ICU examples. Read it
  whenever a string contains a count.

## Credits

Approach informed by [arabic-ai-skills](https://github.com/theonlym7md/arabic-ai-skills)
(MIT). Text and examples here are original and adapted to Kuwait.
