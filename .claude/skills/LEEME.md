# Las skills de terceros

Enlaces simbólicos a `.agents/skills/`, que sí está versionado. Se instalaron con
`npx skills add` desde [skills.sh](https://www.skills.sh).

**Están versionadas a propósito.** El propio instalador avisa: *«Review skills before use;
they run with full agent permissions»*. Vendorizarlas hace que esa revisión quede en la
historia de git y que una actualización se vea como un diff, no como un cambio silencioso
de comportamiento. `skills-lock.json` guarda el origen y el hash de cada una.

| Skill | Viene de | Para qué, aquí |
|---|---|---|
| `supabase` | `supabase/agent-skills` | Todo lo de Supabase: auth, SSR, migraciones, Edge Functions |
| `supabase-postgres-best-practices` | `supabase/agent-skills` | **Se lee ANTES de tocar el esquema.** RLS, tipos de columna, índices, políticas |
| `shadcn` | `shadcn/ui` | Componentes. El ADR 0006 fija estilo `new-york`, base `neutral`, copiado al repo |
| `vercel-react-best-practices` | `vercel-labs/agent-skills` | React 19 y Next 15: Server Components, data fetching, bundle |
| `playwright-cli` | `microsoft/playwright-cli` | El ADR 0006 ya fija Playwright `^1.62` |
| `webapp-testing` | `anthropics/skills` | Probar la app en navegador de verdad |
| `accessibility` | `addyosmani/web-quality-skills` | La Resolución 1519 de 2020 de MinTIC obliga WCAG 2.1 AA a los sujetos obligados. El sistema de diseño apunta a 2.2 AA |

## Cómo se actualizan

`npx skills update` — y el diff se revisa antes de aceptarlo, igual que cualquier otro
cambio de comportamiento.

## Qué NO son

No son método. El método de este repositorio vive en `metodo/` y los comandos en
`.claude/commands/`. Estas skills saben de la herramienta; no saben de este negocio.
