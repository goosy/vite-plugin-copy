import { access, copyFile, mkdir, readdir, stat } from 'fs/promises';
import { constants } from 'fs';
import { join, basename, dirname } from 'path';

async function prepare_dir(dir) {
    const parents = dirname(dir);
    await access(parents, constants.F_OK).catch(async (err) => {
        if (err.code == 'ENOENT') await prepare_dir(parents);
    });
    await access(dir, constants.F_OK).catch(async (err) => {
        if (err.code == 'ENOENT') await mkdir(dir).catch(err => {
            if (err.code !== 'EEXIST') console.log(err);
        });
    });
}

async function copyToDir(src, tarDir) {
    await prepare_dir(tarDir);

    let notExsit = false;
    const fstat = await stat(src).catch(err => {
        if (err.code == 'ENOENT') {
            console.log(tarDir + ' is not exist');
            notExsit = true;
        }
    });
    if (notExsit) return;
    const tarPath = join(tarDir, basename(src));
    if (fstat.isDirectory()) {
        for (const file of await readdir(src)) {
            const srcPath = join(src, file);
            copyToDir(srcPath, tarPath);
        }
    } else {
        await copyFile(src, tarPath).catch(err => {
            console.log(`The file "${src}" could not be copied`);
        });
    }
}

export function copy(copyList, options = {}) {
    const { hook = 'closeBundle' } = options
    return {
        name: 'vite-plugin-copy',
        apply: 'build',
        [hook]: () => {
            for (const { src, dest } of copyList) {
                copyToDir(src, dest);
            }
        }
    }
}
