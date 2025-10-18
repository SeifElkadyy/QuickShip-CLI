import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function listCommand() {
  const templatesPath = join(__dirname, '../config/templates.json');
  const templates = JSON.parse(readFileSync(templatesPath, 'utf-8')).templates;

  console.log('\n📦 Available Templates:\n');

  for (const [platform, platformTemplates] of Object.entries(templates)) {
    console.log(`\n${platform.toUpperCase()}:`);

    for (const [name, template] of Object.entries(platformTemplates)) {
      const status = template.comingSoon ? '(Coming Soon)' : '✓';
      const recommended = template.recommended ? '⭐' : ' ';
      console.log(`  ${recommended} ${name.padEnd(30)} ${status}`);
      if (template.description) {
        console.log(`     ${template.description}`);
      }
    }
  }

  console.log('\n');
}
