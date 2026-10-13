# AURA — vestir o essencial

Loja fictícia de roupas, criada exclusivamente com HTML5, CSS3 e JavaScript puro. O site tem 30 produtos, catálogo filtrável, páginas compartilháveis, sacola persistente e compra combinada pelo WhatsApp. Não há bibliotecas externas, instalação, compilação, backend, pagamento ou cadastro de clientes.

## Visualizar localmente

Abra um terminal nesta pasta (`aura`) e execute, caso tenha Python instalado:

```sh
python -m http.server 8080 --directory dist
```

Abra **http://localhost:8080**. O painel fica em **http://localhost:8080/admin.html**. Pare o servidor com Ctrl+C. Você também pode servir `dist` com qualquer servidor estático já disponível no seu computador. Python é apenas uma opção para a prévia, não uma dependência do site.

Prefira HTTP/HTTPS a abrir o HTML por duplo clique: o comportamento de armazenamento e dos links absolutos em `file://` varia entre navegadores. A mesma origem, porta e navegador precisam ser mantidos para consultar os mesmos rascunhos e a mesma sacola.

## Hospedar

Envie **o conteúdo de `dist/`** para a pasta pública de uma hospedagem estática. `index.html` deve estar no nível inicial do site ou da subpasta escolhida. Mantenha a estrutura `css/`, `js/` e `assets/`. Não precisa instalar nem executar nada no servidor.

Todos os links internos são relativos. Também funciona, por exemplo, em `https://seu-dominio.com/loja/`. O host deve servir os arquivos `.html` diretamente, sem uma regra de reescrita que devolva `index.html` em todos os endereços.

Após substituir dados ou imagens, atualize a página e confira em janela privada. Caso sua hospedagem utilize cache, invalide os arquivos alterados. A pasta `.openai/` registra a identidade da prévia privada no Sites e não precisa ser enviada à sua hospedagem. Ela não contém credenciais. `preview/` contém capturas da verificação e não faz parte do site.

## Personalizar a loja

| Informação | Arquivo |
|---|---|
| Nome, frase da marca, WhatsApp, e-mail, endereço e redes sociais | `dist/js/config.js` |
| Cores, fontes e estilos compartilhados | Variáveis `:root` em `dist/css/styles.css` |
| Catálogo público | `dist/js/catalog-data.js` |
| Banner e textos editoriais | `dist/index.html`, `dist/sobre.html` |
| Atendimento, entrega, retirada, trocas e FAQ | `dist/atendimento.html` |
| Referências de medidas por tipo de peça | `dist/js/guide.js` |
| Fotografias locais | `dist/assets/images/` |

O nome configurado é utilizado no cabeçalho, rodapé e mensagens. Edite também títulos e metadados dos HTML se mudar a marca. As fontes são Georgia e Segoe UI/Arial, instaladas no sistema. Os ícones são SVG, sem serviços externos.

### WhatsApp

O valor inicial é **`WHATSAPP_NUMBER: '5500000000000'`**, um placeholder fictício. Substitua pelo número real, incluindo código do país e DDD, usando somente dígitos (sem `+`, espaços ou pontuação).

Enquanto estiver em demonstração, o cliente vê e copia a mensagem, sem abrir um contato fictício. Com o número real, o modal oferece “Continuar no WhatsApp” e abre `https://wa.me/NUMERO?text=MENSAGEM`, codificada com `encodeURIComponent`. O cliente confirma o envio no WhatsApp. O site nunca envia automaticamente.

A mensagem contém nome da loja, peça, código, cor, tamanho, quantidade, preço unitário, subtotal, link absoluto da peça e total estimado. Ela solicita confirmação da disponibilidade e das condições de entrega ou retirada. Nem preparar nem abrir a mensagem reduz estoque, confirma pedido ou esvazia a sacola.

Deixe e-mail, endereço e redes sociais vazios até ter informações verdadeiras. As redes só aparecem quando uma URL HTTPS for configurada. Não há formulário que simule envio de dados.

## Painel administrativo local

Abra `admin.html` na mesma origem da prévia. O painel tem cadastro, edição, duplicação, exclusão com confirmação, busca, filtros, estoque por variação, ordenação de imagens e prévia. Os dados são salvos em `localStorage` com a chave `aura-admin-v1`.

**O rascunho administrativo não é o catálogo publicado.** As páginas de clientes usam exclusivamente `js/catalog-data.js`. A prévia usa um único produto temporário em `sessionStorage`, sinaliza que é local e desabilita a compra.

1. Cadastre nome, código e identificador único. O identificador aceita letras minúsculas, números e hífens; ele forma a URL da peça. Evite alterá-lo após publicar, pois links e itens em sacolas existentes usam esse ID.
2. Defina público, categoria e coleção separadamente. Escolha tamanhos adequados: PP a XGG para peças superiores, ou numeração 34 a 48 quando aplicável.
3. Informe o preço atual. Para promoção, preencha um preço anterior maior que o atual. As opções “Novidade” e “Mais procurada” são marcações editoriais; não representam vendas ou avaliações.
4. Cadastre cores, uma por linha no formato `Areia|#c7b49b`, e tamanhos separados por vírgula. Após modificar essas opções, clique em **Atualizar matriz de variações**. Preencha o estoque de cada combinação. Zero significa esgotado. As combinações já existentes preservam seus valores; as novas começam em zero.
5. Adicione imagens por URL HTTP/HTTPS ou caminho relativo. Use as setas para ordenar; a primeira será a capa. O painel não envia arquivos para servidor. Copie as imagens locais para a pasta do site.
6. Salve no rascunho e abra **Prévia**. A prévia sem salvar leva você para a página do produto; guarde suas alterações antes de sair se quiser retomá-las depois.

Todos os campos obrigatórios, IDs/códigos repetidos, preços, datas, imagens e estoques são validados. Conteúdo de produtos é inserido com criação de elementos e texto, sem executar HTML administrativo.

### Exportar, importar e publicar

1. **Exportar backup JSON** baixa `aura-backup-AAAA-MM-DD.json`. Guarde uma cópia antes de importar, restaurar ou limpar o navegador.
2. **Importar backup JSON** aceita o formato exportado `{ "version": 1, "products": [...] }`, com até 5 MB e entre 1 e 1000 produtos. O painel valida todos os produtos antes de pedir confirmação para substituir o rascunho. Arquivos inválidos não alteram os dados.
3. **Restaurar demonstração** solicita confirmação e recupera os 30 produtos de `js/demo-data.js`, apenas no rascunho local.
4. **Exportar catálogo JS** baixa **`catalog-data.js`**. Substitua exatamente **`dist/js/catalog-data.js`** pelo arquivo baixado.
5. Confirme que todas as imagens referenciadas existem e envie os arquivos atualizados à hospedagem. Abra o catálogo como cliente em uma janela privada para conferir o resultado.

O arquivo público usa `window.AURA_CATALOG = [...]`. Não há carregamento remoto de JSON; JSON serve para backups de importação/exportação. O navegador também utiliza serialização JSON internamente no armazenamento local.

### Limitações

O painel não tem autenticação no servidor. Qualquer visitante pode abrir sua cópia local, mas ela não altera os arquivos hospedados. Não existem senha escondida em JavaScript, sincronização entre dispositivos, reservas, pedidos confirmados ou estoque transacional. Para restringir o acesso ao arquivo administrativo, use recursos da própria hospedagem ou não envie `admin.html`, `js/admin.js` e `js/demo-data.js` à área pública. Isso não substitui um sistema administrativo com servidor.

Não cadastre dados sensíveis. Limpar o navegador apaga rascunhos e sacola. Se o armazenamento estiver bloqueado ou cheio, o site informa a falha; exporte o rascunho antes de fechar a página. A sacola é revalidada ao abrir e antes de preparar mensagens, com bloqueio de combinações indisponíveis e aviso de alterações. Alterações na mesma origem em outra aba também são observadas pela sacola.

## Fotografias e dados demonstrativos

As dez fotografias-base foram criadas especificamente para este projeto pela ferramenta integrada de geração de imagens. Não foram copiadas de marcas. Os arquivos locais estão otimizados em WebP; as segundas vistas são recortes da mesma fotografia, não novos ângulos. Há reaproveitamento de fotografias entre produtos compatíveis neste catálogo fictício.

As fotos ilustram o estilo e não reproduzem todas as opções de cor, tecido ou medidas. Produtos, preços, estoque, composições, cuidados, coleções e tabelas de tamanhos são demonstrativos. **Antes de operar uma loja real**, substitua as fotos por imagens autorizadas das peças reais, confirme todos os dados e cadastre contato e condições de atendimento verdadeiros. Veja `IMAGENS.md` para o conjunto de imagens e os briefings.

Para trocar uma imagem, copie o arquivo otimizado para `dist/assets/images/` e atualize o caminho no painel. Prefira fotos verticais 3:4 para produtos e paisagem para o banner. WebP/JPEG/PNG são aceitos. Evite arquivos muito pesados e use textos alternativos coerentes. Se uma imagem não carregar, `fallback.svg` ocupa seu lugar.

## Estrutura

```text
dist/
  index.html             Página editorial
  catalogo.html          Busca, filtros e ordenação na URL
  produto.html           Produto por ?id=, galeria e variações
  sacola.html            Seleção persistente e mensagem conjunta
  admin.html             Rascunho, prévia e exportação local
  sobre.html             Marca fictícia
  atendimento.html       Contato e informações de compra
  guia.html              Guia por tipo de peça
  css/styles.css         Estilos e responsividade
  js/config.js           Configuração da loja
  js/catalog-data.js     Dados publicados
  js/demo-data.js        Demonstração original, só para o painel
  js/core.js             Validação, DOM seguro e elementos comuns
  js/catalog.js          Busca, filtros e histórico da URL
  js/product.js          Galeria, opções e sugestões
  js/bag.js              Sacola e revalidação
  js/whatsapp.js         Mensagens e links
  js/admin.js            Administração e backups
  js/guide.js            Medidas contextuais
  js/home.js             Seleções da página inicial
  js/contact.js          Contato configurável
  assets/                Fotografias e SVGs
```

## Verificação

Os principais fluxos foram verificados em navegador e com testes de lógica. Consulte `VERIFICACAO.md` para o escopo e as limitações. `preview/desktop.jpg` e `preview/mobile.jpg` registram o layout. Nenhuma mensagem real foi enviada ao WhatsApp.
