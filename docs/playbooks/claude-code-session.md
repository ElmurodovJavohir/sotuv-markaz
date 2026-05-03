# Claude Code bilan ishlash playbook

## Sessiya boshlash

1. Terminal da loyiha root ga boring
2. `claude` buyrug'ini yozing
3. Claude CLAUDE.md ni avtomatik o'qiydi

## Yaxshi prompt yozish

**Yaxshi:**
```
worker-login sahifada password input uchun eye-toggle icon qo'shib ber.
Figma node: 2129:49187. Hozirgi kod: pages/login.vue.
O'zgartirishdan oldin grep -rn bilan tekshir.
```

**Yomon:**
```
Login sahifani yaxshila
```

## Frontend task uchun prompt template

```
[SAHIFA]: {sahifa nomi va path}
[FIGMA]: {figma node yoki frame nomi}
[TASK]: {aniq nima qilish kerak}
[QOIDALAR]:
- Faqat <template> va <style> o'zgartir
- <script> blokga tegma
- O'zgartirishdan oldin grep qil
- Natijani hot-reload bilan tekshir
```

## Backend task uchun prompt template

```
[APP]: {django app nomi}
[TASK]: {aniq nima qilish kerak}
[QOIDALAR]:
- Migration yaratishdan oldin --dry-run ko'rsat
- Serializer o'zgartirsang frontend axios call larni tekshir
- i18n (modeltranslation) unutma
- Test yoz
```

## Xavfli operatsiyalar

Bu narsalarni Claude Code ga **hech qachon** buyurmang:
- `git push`
- `git reset --hard`
- `python manage.py flush`
- `yarn install` / `npm install`
- Migration fayllarni tahrirlash

## Sessiya tugashi

- Claude Code `git diff` ko'rsatadi
- Siz ko'rib chiqasiz
- O'zingiz commit va push qilasiz
