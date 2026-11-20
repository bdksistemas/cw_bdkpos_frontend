# CLAUDE.md — CW_FRONTEND_BDKPOS

Frontend Angular 17 del Concentrador Web BDKPOS. Contexto, fases y reglas compartidas: [CLAUDE.md de la raíz](../CLAUDE.md) y el playbook `C:\FUENTESWEB\17-CW-BDKTINT\docs\PLAYBOOK-MIGRAR-CW.md`. Modelo a copiar: `C:\FUENTESWEB\17-CW-BDKTINT\CW_FRONTEND_BDKTINT\`.

## Comandos

```bash
npm install --legacy-peer-deps
npm start        # ng serve (reiniciar si cambia angular.json)
npm run build
```

## Reglas de este repo

- Sin credenciales de BDD2 en el navegador: nada de `sessionStorage` con `bd_*` ni headers `X-Client-*`.
- Sucursales siempre de las licencias (`getLicencias()` / `sucursalInicial()`), nunca `sucursal = 1` fijo.
- `src/enviroments/` (typo heredado, se conserva). Producción: `enviroment.prod.ts` + `fileReplacements`.
- Diseño: solo cambian 3 colores de marca (`--accent`, `--accent-dark`, `--ink`), ver `DESIGN-SYSTEM-PORTABLE.md` de BDKTINT.
