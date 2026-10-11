# Kivid — LP Outubro Rosa

Landing page da campanha Outubro Rosa do Kivid: saúde da mulher com preços acessíveis e
Passaporte Individual + Passaporte Família grátis.

- **Produção:** https://kivid-outubro-rosa.vercel.app/
- **Checkout dos CTAs de assinatura:** https://compre.kivid.com.br/outubrorosa26
- **Rede credenciada:** https://rede.kivid.com.br/ (cada logo leva à página do credenciado em https://redekivid.lovable.app/)

## Estrutura

```
src/
  components/OutubroRosaPage.tsx   página completa (seções, textos, links e estilos)
  routes/index.tsx                 rota "/" que exibe a página
  routes/__root.tsx                HTML base, fontes e meta tags padrão
  styles.css                       tema Tailwind e cores do design system Kivid
  lib/                             tratamento de erros do servidor
public/
  brand/                           logos Kivid
  credenciados/                    logos dos credenciados
  manual/senhora-compras.png       imagem do banner final
design/                            arquivos de design de referência (não usados no build)
scripts/deploy.sh                  build + publicação na Vercel
```

Os links de checkout e da rede ficam no topo de `src/components/OutubroRosaPage.tsx`
(`CHECKOUT_URL`, `REDE_CREDENCIADA_URL`, `REDE_PARCEIRO_URL`).

## Rodar localmente

Requer Node 22.

```bash
npm install
npm run dev
```

A página abre em http://localhost:8080/.

## Publicar

```bash
sh scripts/deploy.sh
```

O `.npmrc` (`legacy-peer-deps=true`) é necessário: o `@lovable.dev/vite-tanstack-config`
pede uma versão mais nova do `nitro` como dependência opcional e, sem ele, a instalação falha.
Com ele, a Vercel também consegue fazer o build sozinha se o repositório for conectado no painel.
