#!/bin/sh
# Publica o site em produção no projeto Vercel "kivid-outubro-rosa" (https://kivid-outubro-rosa.vercel.app/).
#
# O build é feito aqui e enviado pronto (--prebuilt), o mesmo que foi testado localmente.
# Na primeira vez, faça login com `vercel login`.
#
# Uso:  sh scripts/deploy.sh
set -e

cd "$(dirname "$0")/.."
export PATH="$HOME/.local/node/bin:$PATH"

# Vincula a pasta ao projeto da Vercel (a pasta .vercel/ não vai para o Git)
mkdir -p .vercel
printf '{"projectId":"prj_SjHGETyQoFEInrjP6EELgD43zvGN","orgId":"team_TG7UePe6CCJwX1A91uxKhO3J","projectName":"kivid-outubro-rosa"}' \
  > .vercel/project.json

rm -rf .vercel/output
NITRO_PRESET=vercel npm run build
vercel deploy --prebuilt --prod --yes < /dev/null
