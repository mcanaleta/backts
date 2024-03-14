Strongly opinionated...:
- Google for everything
  - Login: firebase
  - Database: firestore (realtime, highly scalable and avilable, pay per use, no need to manage, ...)
  - Analytics: bigquery
  - Serverless: cloud run
  - Scheduler
  - Secrets
- Server: NodeJS. I like modern approaches like server workers, cloudflare workers, etc, but most of google sdks rely on nodejs...

Other decisions
- SWC: fast, supports quite modern typescript features
- TODO: zod/yup/yui/ ... for validation

Any backoffice app should have
- a frontend
    - search
    - ai / assistants
    - menu
    - notifications
- a domain (entities, schema, ...)
- scheduler
- data loaders
- data flow and dependencies
- monitoring
- analytics
- AI

frontend must be private, not in a public cdn

what this is NOT (use instead something like next.js)
- NOT SSR
- NOT for public sites
- NO SEO 
- NOT for static sites
- NOT for landing pages


OTHERS

FUTURE
- vscode extension
