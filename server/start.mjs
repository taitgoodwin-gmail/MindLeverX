import { resolve } from 'node:path';
import { existsSync } from 'node:fs';
import { createApp } from './app.mjs';

const port = Number(process.env.PORT || 4317);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('PORT must be a number between 1024 and 65535.');
if (!existsSync(resolve('dist/index.html'))) throw new Error('Build the project first with npm run build, or run npm run dev.');
const app = createApp({dbPath:resolve(process.env.MLX_DB_PATH || 'data/mindleverx.sqlite'),seed:process.env.MLX_SEED !== 'false',evidenceInputPath:process.env.MLX_EVIDENCE_INPUT ? resolve(process.env.MLX_EVIDENCE_INPUT) : null,evidenceBrand:process.env.MLX_EVIDENCE_BRAND || 'MindLeverX',evidenceSubjectDomain:process.env.MLX_EVIDENCE_DOMAIN || null});
app.server.listen(port,'127.0.0.1',()=>{
  console.log(`MindLeverX is running locally.\nWebsite: http://127.0.0.1:${port}/\nWorkspace: http://127.0.0.1:${port}/app/\nLocal SQLite storage. Engine monitoring and email are not connected.`);
});
app.server.on('error', async error=>{ console.error(error.message); await app.close(); process.exitCode=1; });
for (const signal of ['SIGINT','SIGTERM']) process.on(signal,async()=>{await app.close();process.exit(0);});
