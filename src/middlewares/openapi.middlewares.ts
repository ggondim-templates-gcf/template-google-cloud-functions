import { Application } from 'express';
import { merge as mergeOas } from 'openapi-merge';
import { Swagger } from 'atlassian-openapi';
import oasDefault from '../oas-default';

export default function(app: Application, controllers: NodeRequire[], swaggerUiUrl: string) {
  const specs = controllers.map(controller => ({
    ...oasDefault,
    ...controller['specs'],
  } as Swagger.SwaggerV3));

  const oasMergeResult = mergeOas(specs.map(x => ({ oas: x })));

  app.get('/openapi.json', (req, res) => {
    res.json(oasMergeResult['output']);
  });

  app.get('/', (req, res) => {
    res.redirect(`${swaggerUiUrl}?url=https://${req.hostname}/openapi.json`);
  });
}
