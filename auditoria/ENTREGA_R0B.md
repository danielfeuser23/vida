# Entrega R0b — Confiabilidade de gravação e abertura

> Histórico da entrega. [R0c foi entregue em 06/11/2026](ENTREGA_R0C.md), preservando geração criptográfica de IDs, abertura e operações sem duplicação. As pendências citadas ao fim deste documento descrevem o momento de R0b.

**Data: 05/11/2026 · America/Sao_Paulo. Aplicação 1.0.2; backup continua versão 1. Sem publicação.**

## Resultado

A dependência direta de crypto.randomUUID foi removida do motor e da abertura de compras. O aplicativo agora gera UUID v4 usando a API nativa quando disponível ou os bytes criptográficos de crypto.getRandomValues quando randomUUID não existe, como no HTTP de origem não confiável dos navegadores testados.

Os IDs necessários são gerados antes de alterar fases, compras, estornos e correções. Se a geração não estiver disponível ou falhar, a ação mostra mensagem compreensível e não deixa alterações parciais no estado. Nenhum fallback usa horário, contador ou Math.random.

Os mecanismos de persistência e recuperação de R0a foram preservados, assim como a chave entre-trilhas-v1, os valores das missões, a agenda, as habilidades e as 120 fases. Não houve migração de dados nem implantação de PWA/sincronização.

## Reprodução e regressões antes da correção

A base de R0a tinha 71 testes Node aprovados. Foram preservados snapshots da aplicação anterior em diretórios de teste fora do checkout.

No motor, as primeiras sete regressões de R0b tiveram **cinco falhas esperadas e duas aprovações**. Foram confirmados:

- ausência de randomUUID impedindo registrar missão em ambiente com getRandomValues;
- fase Python criada parcialmente antes de falhar ao criar evento;
- correção podendo remover a fase antes de falhar no ID;
- compra adicionada antes de falhar na geração do segundo ID;
- cancelamento marcado sem produzir estorno quando a geração do evento falhava.

Na reprodução de navegador contra o snapshot anterior, **dois testes/quatro contextos falharam como esperado**: fonte e HTML único em origem HTTP não confiável simulada. Registrar missão manteve o armazenamento vazio com erro de randomUUID; abrir uma recompensa não apresentou o formulário. A fonte produziu erro JavaScript não tratado ao abrir a compra.

## Implementação

- **ids.js:** função compartilhada createId. Prefere randomUUID e confere formato v4. Sem essa função, solicita 16 bytes a getRandomValues, ajusta bits de versão/variante e formata UUID v4. Em ausência/falha das APIs, apresenta erro amigável.
- **engine.js:** usa o gerador compartilhado; todos os IDs da operação ficam prontos antes das mutações. A compra precisa de um ID de compra e um de evento; falha em qualquer um preserva o estado original.
- **app.js:** usa createId no identificador do pedido de resgate e captura falha ao abrir o formulário. O mesmo formulário mantém seu requestId durante submissões repetidas.
- **build.js:** inclui o gerador no HTML único. As fontes e o arquivo único passam pelos mesmos cenários.
- **package.json:** versão da aplicação 1.0.2; inclui ids.js na verificação sintática. Sem dependências novas.

A unicidade de UUID é probabilística, baseada em aleatoriedade criptográfica; não é promessa matemática de colisão impossível. UUID v4 tem 122 bits aleatórios. A validação de R0a continua rejeitando identificadores duplicados antes de persistir. Uma amostra de 1.024 IDs do gerador real passou em formato e ausência de colisão; essa amostra não prova unicidade universal.

O gerador não tenta encobrir uma API nativa que exista mas lance erro ou devolva resposta inválida: a operação é recusada com mensagem compreensível. O fallback é para ausência de randomUUID, não para uma fonte fraca de entropia.

## Contabilidade e repetições

Os testes exercitam cliques/submissões repetidos e confirmam:

- uma conclusão por ocorrência; mínima→normal concede somente a diferença;
- atividade de 20 XP dividida entre duas habilidades continua somando 20;
- um requestId de compra não gera segundo desconto, inclusive depois de cancelado;
- cancelamento estorna uma vez; correção remove o ganho uma vez;
- compra não consome XP;
- reabertura preserva os dados e os IDs;
- ausência/falha do gerador não altera saldo, eventos, fases ou status de compra;
- dois contextos de página com Web Locks enfileiram operações sem duplicação;
- backups versão 1 continuam restaurando, exportando e recuperando a cópia anterior.

Essas verificações não substituem armazenamento transacional entre abas em navegadores sem Web Locks. Em HTTP de rede local, onde essa API não está disponível no Chromium testado, o suporte continua limitado a **uma aba por vez**, como já documentado em R0a. Corrigir IDs não introduz sincronização ou bloqueio atômico entre aparelhos.

## Matriz de abertura: o que foi realmente conferido

| Caminho | Método de verificação | Resultado e limite |
|---|---|---|
| HTTP em 127.0.0.1:5173, servidor Node | Requisições reais ao servidor iniciado com npm start; Chromium isolado | Fonte e HTML único aprovados. Loopback é tratado como contexto seguro pelo navegador; APIs nativas disponíveis. |
| HTTP em localhost:5173, servidor Node | Execução suplementar dos testes de missão/reabertura e compra nas duas distribuições, com o hostname exato | Aprovado; dois testes/quatro contextos. Não equivale a abrir localhost em um celular: nesse caso o nome aponta para o próprio celular. |
| HTTP em 127.0.0.1:5174, servidor Python | Servidor real iniciado com python3 -m http.server 5174 --bind 127.0.0.1; encerrado após os testes | Aprovado em dois testes/quatro contextos, fonte e HTML único. Não testa acesso de outro aparelho ou firewall. |
| HTTP não confiável de rede local | Origem http://entretrilhas.test com arquivos locais entregues por interceptação Playwright | isSecureContext=false e randomUUID ausente; fallback e fluxos aprovados. **Origem simulada**, sem roteador, IP de outro aparelho ou telefone físico. |
| HTTPS | Origem https://entretrilhas.test, arquivos locais entregues por interceptação Playwright | isSecureContext=true; API nativa, fallback forçado e duas abas com Web Locks aprovados. **Sem handshake TLS, certificado, hospedagem externa ou publicação.** |
| file:// do HTML único | Tentativa real de navegação no Chromium gerenciado, sem contornar política | ERR_BLOCKED_BY_ADMINISTRATOR. Não verificado funcionalmente e não recomendado como caminho homologado neste ambiente. |
| Safari, Firefox, Android/iPhone físicos | Não executado | Compatibilidade ainda precisa de validação nesses aparelhos/navegadores. |

A interceptação entrega os próprios arquivos do projeto e permite testar as APIs que o navegador expõe para cada tipo de origem. Não usa opção de ignorar certificado nem transforma HTTP em origem segura. É uma simulação de origem, não uma validação do transporte HTTPS ou da rede física.

Para implantação futura, HTTPS oferece contexto seguro às APIs que o exigem. randomUUID e Web Locks são APIs desse tipo; o fallback de IDs usa getRandomValues, disponível no HTTP comum do Chromium testado. Recursos futuros como service workers terão requisitos próprios e não foram adicionados.

Mudar protocolo, hostname ou porta muda a origem e pode mostrar outro progresso local. Exporte o backup antes de mudar de endereço e restaure-o no destino; os dados não são transferidos automaticamente.

## Verificações finais

| Comando/verificação | Resultado |
|---|---|
| npm run check | Aprovado, incluindo ids.js e build.js. |
| npm test | **88 testes aprovados**, 0 falhas/ignorados: 71 anteriores + 17 de IDs/atomicidade. |
| npm run build | Aprovado; HTML único regenerado com o gerador. |
| python3 tests/browser_smoke.py | Aprovado; fluxos existentes, mudança de dia e seis telas mobile. |
| python3 tests/browser_integrity.py | **14 testes/36 contextos aprovados**, preservando R0a em fonte e HTML único. |
| python3 tests/browser_opening.py | **7 testes/32 contextos aprovados**: loopback real, HTTP e HTTPS simulados, ausência de crypto, fallback e duas abas. |
| Verificações suplementares | Hostname localhost e servidor Python: dois testes/quatro contextos em cada servidor, separados da suíte de 32 contextos. |
| Pacote ZIP | Atualizado e comparado byte a byte com as fontes finais e o HTML gerado. |

Os testes usam perfis/contextos descartáveis, relógio controlado e dados fictícios. Nenhum progresso real do usuário foi lido ou sobrescrito. O arquivo legado tests/fixtures/legacy-v1.json e os testes anteriores foram preservados.

## Como repetir

Com npm start ativo:

    npm run check
    npm test
    npm run build
    python3 tests/browser_smoke.py
    python3 tests/browser_integrity.py
    python3 tests/browser_opening.py

A suíte nova aceita BASE_URL, APP_PATHS, BROWSER_ORIGINS e BROWSER_APP_ROOT para selecionar servidor, artefatos e snapshot. O próprio cabeçalho do teste explica a simulação e seus limites.

## Pendências e próxima entrega

R0b não corrige os achados de R0c: horários de folga, XP líquido visual, foco/contraste e editor/diálogos. Também não separa sessões de fases Python, nem adiciona agenda unificada, novos conteúdos, avatar, PWA ou sincronização.

**Próxima entrega recomendada: R0c**, encerrando as correções de confiabilidade/interação conhecidas antes da expansão de produto. Depois, manter a ordem solicitada: separar sessões de Python; melhorar Hoje e unificar agenda; aprofundar as primeiras sete fases; enriquecer avatar/refúgio/loja; adicionar revisão semanal acolhedora. Nenhuma dessas etapas foi iniciada automaticamente.
