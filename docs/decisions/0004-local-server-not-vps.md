# ADR-0004: Lokal server, VPS emas

**Sana:** 2026-03
**Status:** Qabul qilingan
**Qaror beruvchi:** Javokhir

## Kontekst

RAGFlow va AI agent pipeline uchun server kerak. Ikki variant: VPS (Hetzner, DigitalOcean) yoki lokal server.

## Qaror

Lokal server:
- 16GB RAM, 4-6 core CPU, 256GB SSD
- Ubuntu 22.04
- RAGFlow + barcha agentlar shu serverda ishlaydi

## Sabab

- Bir martalik xarajat, oylik to'lov yo'q
- Ma'lumotlar local — privacy
- RAGFlow Docker juda ko'p resurs yeydi — VPS da qimmat

## Risk

- Internet tezligi va barqarorligi
- UPS kerak (elektr uzilishi)
- Remote access uchun qo'shimcha sozlash (Tailscale, ngrok, yoki static IP)

## Status

Hali sotib olinmagan. Hardware spec tasdiqlangan.
