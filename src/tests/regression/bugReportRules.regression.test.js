import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, it, expect } from 'vitest';

describe('Bug report rules regression', () => {
  it('allows anonymous bug report creation while keeping other access authenticated', () => {
    const rules = readFileSync(path.resolve(process.cwd(), 'firestore.rules'), 'utf8');

    expect(rules).toMatch(/match\s+\/bug_reports\/\{document\}\s*\{[\s\S]*allow\s+create:\s+if\s+true;/);
    expect(rules).toMatch(/match\s+\/bug_reports\/\{document\}\s*\{[\s\S]*allow\s+read,\s+update,\s+delete:\s+if\s+request\.auth\s*!=\s*null;/);
    expect(rules).toMatch(/match\s+\/\{document=\*\*\}\s*\{[\s\S]*allow\s+read,\s+write:\s+if\s+request\.auth\s*!=\s*null;/);
  });
});
