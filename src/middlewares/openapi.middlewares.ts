import { Application } from 'express';
import { merge as mergeOas } from 'openapi-merge';
import { Swagger } from 'atlassian-openapi';
import chalk from 'chalk';
import minimist from 'minimist';
import oasDefault from '../oas-default';

export default function (app: Application, controllers: NodeRequire[], swaggerUiUrl: string) {
  const specs = controllers.map(controller => ({
    ...oasDefault,
    // eslint-disable-next-line @typescript-eslint/dot-notation
    ...(controller['specs'] || {}),
  } as Swagger.SwaggerV3));

  const oasMergeResult = mergeOas(specs.map(x => ({ oas: x })));

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line @typescript-eslint/dot-notation
    const PORT = minimist(process.argv, { string: ['port'] })['port'] || process.env.PORT || '8080';

    console.clear();
    console.log('\nFunction endpoints:');

    // eslint-disable-next-line @typescript-eslint/dot-notation
    Object.keys(oasMergeResult['output']['paths']).forEach(path => {
      // eslint-disable-next-line @typescript-eslint/dot-notation
      Object.keys(oasMergeResult['output']['paths'][path]).forEach(method => {
        // eslint-disable-next-line prefer-template
        const txt = `    [${method.toUpperCase()}]  `
          + chalk.green.bold.underline(`http://localhost:${PORT}${path}`);
        console.log(txt);
      });
    });
    console.log('\n');
  }

  app.get('/openapi.json', (req, res) => {
    // eslint-disable-next-line @typescript-eslint/dot-notation
    res.json(oasMergeResult['output']);
  });

  app.get('/', (req, res) => {
    res.redirect(`${swaggerUiUrl}?url=https://${req.hostname}/openapi.json`);
  });
}
