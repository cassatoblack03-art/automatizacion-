// Genera dist/index.html (página completa para abrir en el navegador)
// y dist/artifact.html (el mismo contenido sin <html>/<head>, para publicar como Artifact).
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as esbuild from 'esbuild';

const here = dirname(fileURLToPath(import.meta.url));
const REACT_VERSION = '18.3.1';

// react y react-dom se cargan desde cdnjs como globals (UMD); aquí solo se apuntan a window.
const umdGlobals = {
  name: 'umd-globals',
  setup(build) {
    build.onResolve({ filter: /^(react|react-dom)$/ }, (args) => ({ path: args.path, namespace: 'umd-global' }));
    build.onLoad({ filter: /.*/, namespace: 'umd-global' }, (args) => ({
      contents: `module.exports = window.${args.path === 'react' ? 'React' : 'ReactDOM'};`,
      loader: 'js',
    }));
  },
};

const bundle = await esbuild.build({
  entryPoints: [join(here, 'main.jsx')],
  bundle: true,
  minify: true,
  format: 'iife',
  target: 'es2018',
  write: false,
  // El componente vive en la carpeta de arriba: resolvemos sus imports desde este node_modules.
  nodePaths: [join(here, 'node_modules')],
  define: { 'process.env.NODE_ENV': '"production"' },
  plugins: [umdGlobals],
});
const js = bundle.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');

const css = execFileSync(join(here, 'node_modules', '.bin', 'tailwindcss'), ['-c', 'tailwind.config.cjs', '-i', 'input.css', '--minify'], {
  cwd: here,
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'ignore'],
});

const head = `<title>Centro de Entrenamiento Personal de Inglés</title>
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="description" content="Plan de 6 meses de inglés profesional para Emiliano, Logistics Trainee en Groupe SEB.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Figtree:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap">
<style>
${css}
:root { color-scheme: dark; background: #020617; }
body { background: #020617; color: #f1f5f9; }
body::before { content: ""; position: fixed; inset: 0 0 auto; height: env(safe-area-inset-top, 0px); z-index: 40; background: #020617; }
</style>`;

const body = `<div id="root"></div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/${REACT_VERSION}/umd/react.production.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/${REACT_VERSION}/umd/react-dom.production.min.js"></script>
<script>${js}</script>`;

mkdirSync(join(here, 'dist'), { recursive: true });
writeFileSync(join(here, 'dist', 'artifact.html'), `${head}\n${body}\n`);
writeFileSync(
  join(here, 'dist', 'index.html'),
  `<!doctype html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n${head}\n</head>\n<body>\n${body}\n</body>\n</html>\n`,
);
console.log(`dist/index.html y dist/artifact.html listos (JS ${(js.length / 1024).toFixed(1)} KB, CSS ${(css.length / 1024).toFixed(1)} KB)`);
