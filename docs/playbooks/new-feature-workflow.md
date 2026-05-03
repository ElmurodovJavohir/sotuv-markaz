# Yangi feature qo'shish workflow

## 1. Spec yozish (Obsidian)

`docs/specs/` papkada yangi fayl yarating:

```markdown
# Feature nomi

## Maqsad
Nima uchun kerak

## User story
Kim, nima qiladi, natija nima

## API dizayn
Endpoint lar, request/response format

## UI dizayn
Figma link yoki tavsif

## Qabul mezonlari
- [ ] Mezon 1
- [ ] Mezon 2
```

## 2. Task yaratish (Notion)

Notion Kanban board ga task qo'shing:
- Task nomi
- Module (SalesIQ, Company Side, etc.)
- Priority (High/Medium/Low)
- Status: To Do

## 3. Branch yaratish

```bash
git checkout -b feature/{qisqa-nom}-YYYYMMDD
```

## 4. Backend implement (Claude Code)

```
[APP]: src/{app_nomi}
[TASK]: {spec dan}
[STEPS]:
1. Model yaratish + migration
2. Serializer
3. View + permission
4. URL registration
5. Test yozish
6. Admin registration
```

## 5. Frontend implement (Claude Code)

```
[SAHIFA]: pages/{path}
[FIGMA]: {node}
[TASK]: {spec dan}
```

## 6. Test va review

- Backend: `python manage.py test`
- Frontend: hot-reload tekshiruv
- Manual brauzerda tekshirish

## 7. Merge

- `git diff` ko'rish
- Commit message: `feat({module}): {qisqa tavsif}`
- PR yoki direct merge (Javokhir qaror beradi)

## 8. Docs yangilash

- Notion task status → Done
- Obsidian spec ga "Status: ✅ Done" qo'shish
- Agar arxitektura o'zgargan bo'lsa → tegishli docs yangilash
