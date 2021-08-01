import { strictEqual } from "assert";
import { build } from 'vite';
import { constants } from 'fs';
import { access, rm } from 'fs/promises';
import vue from '@vitejs/plugin-vue';
import { copy } from '../src/index.js';

import { fileURLToPath } from 'url';
import { dirname, join } from "path";
const root = join(dirname(fileURLToPath(import.meta.url)), './fixtures');
process.chdir(root);
const outDir = "./out";

async function exist(path) {
    let bExit = true;
    await access(path, constants.F_OK).catch(async (err) => {
        if (err.code == 'ENOENT') bExit = false;
    });
    return bExit;
}

async function viteBuild(copyList, options) {
    await build({
        root, // <projectpath>
        build: {
            outDir, //"./test/out"
            plugins: [
                vue(),
                copy(copyList, options)
            ]
        }
    });
}

async function clean() {
    await rm(outDir, { recursive: true, force: true });
}
beforeEach(clean);
// after(clean);

describe('copy', () => {
    describe('basic', () => {
        it('no copy item', async () => {
            await viteBuild();
            strictEqual(await exist('dist/example1.js'), false);
        });
        it('copy single file', async () => {
            await viteBuild([
                { src: 'test/assets/example1.js', dest: 'dist' }
            ]);
            strictEqual(await exist('dist/example1.js'), true);
        });
    })
})

describe('options', async () => {
})
