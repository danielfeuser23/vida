# Entrega — Python do zero: fases 1–7

**10/11/2026 · America/Sao_Paulo · aplicação 1.3.0 · progresso v1/v2 preservado.**

**Entrega concluída, validada e publicada no GitHub.** Código em `main`, commit [5f89600605cbb4e1aafd423b6aab32b713932bd8](https://github.com/danielfeuser23/vida/commit/5f89600605cbb4e1aafd423b6aab32b713932bd8). O push e a referência remota foram confirmados. Este registro final e os pacotes documentais acompanham um fechamento posterior, sem alterar o código validado. Não há deploy e nenhuma entrega posterior foi iniciada.

## Base, escopo e sequência

Base: `main` em `06f7e3834808d64703ec6477cdc4eaeda0698211`, com sessões independentes e Hoje/agenda já entregues. Foram conferidos README, PLANO, roadmap, relatórios anteriores, código e conteúdo efetivo antes das mudanças. Os 197 testes Node da base passaram.

A sequência original é mantida: preparar/executar → mensagens → variáveis → aritmética → textos → entrada/conversão → revisão integrada. A fase 1 explica editor, arquivo e janela de saída pelo IDLE, sem exigir terminal. O critério legado que exigia terminal passa a aceitar IDLE ou terminal. Condicionais, comparações, coleções, laços, funções próprias, módulos e tratamento de exceções não são requisitos destes exercícios. Os erros de conversão são investigados sem antecipar `try/except`.

Não se transforma cada fase em compromisso diário: ela pode ocupar várias sessões/dias. O limite anterior de uma nova fase por dia continua sendo um limite técnico, não uma cobrança de concluir uma fase diariamente.

## Material entregue e métricas

| Fase / ID preservado | Foco | Básicos | Extras opcionais |
|---|---|---:|---:|
| 1 · Preparar a mochila | Preparar o ambiente e executar mensagens em arquivo | 4 | 6 |
| 2 · Mensagens que fazem sentido | `print`, mensagens, linhas, `sep` e `end` | 4 | 6 |
| 3 · Variáveis do cotidiano | Nomes, valores, atribuição e atualização simples | 4 | 6 |
| 4 · Contas de uma jornada | Aritmética, divisão, resto e parênteses | 4 | 6 |
| 5 · Trabalhe com palavras | Textos, f-strings, `strip`, `casefold`, `len`, `replace` | 4 | 6 |
| 6 · Receba informações | `input`, `int`, tipos e investigação de entrada inválida | 4 | 6 |
| 7 · Revisão da primeira semana | Boletim de hábitos com entradas, cálculo e mensagens | 4 | 6 |
| **Total guiado** | **Sete exemplos completos, 70 exercícios** | **28** | **42** |

Cada fase inclui objetivo, pré-requisitos, revisão curta, explicações, exemplo com entrada/saída esperada, erros comuns/investigação, fontes e critério de conclusão. Cada exercício tem enunciado, dicas progressivas, casos para conferir e solução comentada independente. A preparação fica separada: instalar/configurar não é contado como exercício de programação resolvido. Casos inválidos sinalizam o erro esperado; a saída capturada inclui prompts de `input`, sem o eco das teclas.

O módulo autoral `python-content.js` é somente leitura e não faz parte do backup. Os **120 IDs** e os valores legados `exercises`/`practice` ficam preservados. O catálogo legado contém 600 sugestões: 35 das fases 1–7 cedem lugar, na leitura, aos 70 exercícios guiados; as **565 sugestões das fases 8–120** permanecem com o aprofundamento anterior. Não são 670 exercícios novos nem uma academia completa.

## Interface e rotina

Na Trilha, o conteúdo abre no diálogo existente. Explicação, revisão, básicos, extras, erros e fontes usam seções recolhidas; exercícios, dicas e soluções também começam fechados. Dicas são progressivas e opcionais. Código e saídas têm foco e rolagem por teclado. Summaries têm IDs estáveis para preservar o foco e áreas de toque.

Proposta editável: bloco de 60 minutos para revisão/explicação/exemplo/início dos básicos, dez minutos de pausa fora da contagem, outro bloco de 60 para continuar, escolher extras e anotar dúvidas. Nem todos os extras precisam ser feitos e não há metas crescentes. A mínima permanece alternativa de retomada. Trabalho, trajeto, refeições, descanso, lazer básico, cuidados essenciais e janela 05:30–22:30 não mudam.

## Contabilidade e compatibilidade

Não há alteração do esquema ou migração nova. A chave `entre-trilhas-v1`, backups v1/v2, ativação explícita v1→v2 e cópia recuperável continuam os mesmos. O catálogo não recalcula fases ou contadores passados. Os motores de estudo, agenda, armazenamento e IDs permanecem sem mudanças nesta entrega.

Ler conteúdo, revelar dicas/soluções ou marcar fase não concede recompensa adicional nem registra exercício. Sessões, fases e projetos permanecem independentes. Exercícios continuam sendo um número informado pelo usuário em cada sessão, sem identificação persistida por enunciado; o app não detecta se um mesmo exercício foi informado em duas sessões distintas.

Pontuação padrão preservada: 5 min → 5 XP/2 moedas, 60 min → 60 XP/18 moedas, 120 min → 120 XP/36 moedas; duas sessões de 60 somam o mesmo teto. A pausa não entra. Marcar a fase/projeto não paga outra vez. Correções, saldo não negativo e idempotência continuam sujeitos às regressões anteriores.

## Fontes oficiais e limites da consulta

Consulta em **10/11/2026**, por HTTPS aos arquivos públicos oficiais do CPython. Os conceitos foram explicados com exemplos autorais; não foram incorporados textos, código ou recursos gráficos de terceiros, nem bibliotecas novas.

| Fonte efetivamente lida | Uso |
|---|---|
| [Introdução — CPython, main](https://raw.githubusercontent.com/python/cpython/main/Doc/tutorial/introduction.rst) | Comentários, mensagens, atribuição, números e diferença entre shell e arquivo |
| [Funções embutidas — CPython v3.12.0](https://raw.githubusercontent.com/python/cpython/v3.12.0/Doc/library/functions.rst) | `print`, `input`, `int`, `len`, prompts e conversão |
| [Tipos embutidos — CPython v3.12.0](https://raw.githubusercontent.com/python/cpython/v3.12.0/Doc/library/stdtypes.rst) | Operações numéricas e semântica de `strip`, `casefold`, `replace` |
| [Entrada e saída — CPython v3.12.0](https://raw.githubusercontent.com/python/cpython/v3.12.0/Doc/tutorial/inputoutput.rst) | F-strings e substituição de valores entre chaves |
| [Erros — CPython v3.12.0](https://raw.githubusercontent.com/python/cpython/v3.12.0/Doc/tutorial/errors.rst) | Leitura de mensagem, linha indicada, `SyntaxError` e erros em execução; sem exigir tratamento de exceções |
| [IDLE — CPython, main](https://raw.githubusercontent.com/python/cpython/main/Doc/library/idle.rst) | File → New File, Save As, Run → Run Module e janela Shell |
| [Windows — CPython, main](https://raw.githubusercontent.com/python/cpython/main/Doc/using/windows.rst) | Instalação oficial e disponibilidade do IDLE |
| [macOS — CPython, main](https://raw.githubusercontent.com/python/cpython/main/Doc/using/mac.rst) | Instalador oficial e editor |
| [Unix/Linux — CPython, main](https://raw.githubusercontent.com/python/cpython/main/Doc/using/unix.rst) | Python da distribuição e IDLE instalado separadamente quando necessário |

A página [Introdução em português](https://docs.python.org/pt-br/3/tutorial/introduction.html) foi tentada e recusada com **403 CONNECT** pelo proxy, antes de receber seu conteúdo. Portanto, a página renderizada não foi verificada. Tentativas dos arquivos `Doc/library/functions.rst` em `3.13`/`main` e `Doc/library/stdtypes.rst` em `main` retornaram **404**; a consulta desses assuntos usou os arquivos versionados v3.12.0 listados acima, compatíveis com o interpretador local 3.12. Não se atribui verificação às páginas inacessíveis.

Os arquivos `main` podem evoluir; a data identifica a consulta, sem alegar execução de um instalador em Windows/macOS/Linux do usuário. Os testes locais executam programas em Python 3.12, sem simular todas as versões/instalações dos alunos.

## Regressões e verificação

Antes da integração, a nova suíte Node falhou pela ausência do módulo guiado. No navegador, o HTML único 1.2.0 abriu e reproduziu a ausência do conteúdo aprofundado. Uma tentativa no módulo fonte durante a edição encontrou import ainda inexistente; isso foi descartado como estado intermediário de desenvolvimento, não como bug da versão anterior.

A revisão pedagógica independente percorreu explicações, pré-requisitos, enunciados, dicas e soluções. Ajustou um enunciado da fase 7 para aceitar o cálculo em variáveis antes da f-string, diferenciou converter com `int` de validar um valor não negativo e explicitou o teste com zero nos campos numéricos da fase 6. Os 19 casos de borda independentes não repetem apenas as saídas do catálogo: cobrem 0/59/60/61/120/1.440 minutos, limpeza Unicode/espaços/texto vazio e conversão de inteiros com zeros à esquerda, espaços e entradas inválidas. As asserções antigas não foram alteradas ou removidas.

| Verificação | Resultado |
|---|---|
| Sintaxe, testes Node e build | Aprovados: **208 testes Node**, zero falhas/ignorados (197 anteriores + 11 de conteúdo/compatibilidade); HTML único regenerado. |
| Execução local de exemplos/soluções e entradas de borda | **25 testes aprovados, 128 execuções Python 3.12**: sete exemplos + 102 casos das 70 soluções + 19 bordas independentes. AST dos 77 programas verificado contra conceitos posteriores. |
| Novo fluxo de conteúdo, teclado, celular e zoom nativo | **7 testes / 20 contextos aprovados**, fonte e HTML único. Inclui backups v1/v2, restauração/reabertura, 35 exercícios históricos preservados, leitura/dicas/soluções sem gravar, sessão manual/fase sem pagamento duplicado, 320/430 px e dois perfis em zoom nativo de 200%. Repetição móvel após ajuste apenas da captura: 1 teste / 4 contextos aprovado. Capturas móveis e de zoom inspecionadas. |
| Suítes anteriores de navegador | Smoke aprovado na fonte e no HTML único; integridade **14/36**, abertura **7/32**, sessões **14/32**, acessibilidade **16/44**, zoom nativo **6/12** e agenda **17/36** aprovados (testes/contextos ou perfis). Sem alteração das suítes anteriores. Para repetir o smoke no HTML único, foi trocada apenas a URL em memória, preservando todas as asserções e o arquivo original. |
| HTML único, ZIPs e cópia extraída | Build determinístico, sintaxe do bundle e CRC/bytes dos dois ZIPs conferidos; 54 arquivos no app e 17 no pacote de auditoria. Na cópia extraída: sintaxe, **208 testes Node, 25 testes de conteúdo/128 execuções Python e build** aprovados. Quatro testes de conteúdo/12 contextos e um de compra/cancelamento/dois contextos aprovados nos dois artefatos. Os 14 arquivos de runtime/build extraídos são idênticos às fontes. A documentação final acompanha o reempacotamento. |
| GitHub, commit separado e envio sem force push | Confirmado em `main`: [5f89600605cbb4e1aafd423b6aab32b713932bd8](https://github.com/danielfeuser23/vida/commit/5f89600605cbb4e1aafd423b6aab32b713932bd8), descendente de `06f7e38`. Push normal e `git ls-remote` confirmaram o mesmo identificador. Sem deploy. |

Comandos reprodutíveis: `npm run check`, `npm test`, `npm run test:content`, `npm run build`; com `npm start` ativo, `python3 tests/browser_content.py` e as suítes anteriores `browser_smoke.py`, `browser_integrity.py`, `browser_opening.py`, `browser_sessions.py`, `browser_accessibility.py`, `browser_zoom.py`, `browser_agenda.py`. Todos usam dados fictícios/contextos temporários, sem ler ou substituir progresso pessoal.

Os testes de Python são ferramentas locais de desenvolvimento: executam arquivos autorais em subprocessos temporários com entrada controlada e limite de tempo. **Não existe executor de Python no app/servidor**, corretor automático ou checklist persistido por exercício.

Uma rodada paralela de agenda executou os 17 métodos/36 contextos e teve um `Page.goto: Timeout 4000ms exceeded`, antes da interação no cenário de segundo passeio/restauração; o HTML único desse cenário passou. Sem alterar as asserções nem o limite de espera, a repetição isolada da suíte inteira passou: 17 métodos/36 contextos em 54,573 s. O tempo limite foi registrado como ocorrência intermitente da execução, sem atribuir uma causa não demonstrada e sem anunciar a primeira rodada como aprovada.

## Limites e próxima entrega

Dados permanecem locais ao navegador/perfil/origem. Timer não persiste ao fechar e não conclui nada automaticamente. Não há homologação em aparelhos físicos, leitor de tela, Safari ou Firefox nem declaração de conformidade completa WCAG. Rede local HTTP e HTTPS continuam distintos das simulações documentadas; não há novo teste de roteador/certificado, e `file://` continua sem homologação funcional.

Esta entrega não expande o conteúdo das fases 8–120, não implementa finanças F1–F3, avatar/refúgio, revisão semanal ampliada, PWA ou sincronização. Depois da conclusão deste piloto, a próxima recomendação do roadmap é **enriquecer avatar, refúgio e loja**, em entrega própria; não iniciada automaticamente.
