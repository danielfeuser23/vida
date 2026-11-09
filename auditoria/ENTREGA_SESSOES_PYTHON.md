# Entrega — Sessões de Python independentes

**09/11/2026 · America/Sao_Paulo · aplicação 1.1.0 · formatos de progresso v1 e v2.**

**Estado desta revisão: implementação, testes e pacotes concluídos.** O envio ao GitHub será confirmado separadamente após o commit. Não houve deploy do aplicativo.

## Problema e comportamento resultante

B05 vinculava o registro normal de Python ao avanço de fase. Isso impedia registrar duas horas quando o critério exigia vários dias e bloqueava novos estudos normais depois das 120 fases.

Agora há três ações independentes:

- **Registrar sessão:** informa objetivo, minutos sem pausas, tipo de prática e quantidade de exercícios realmente resolvidos. É possível registrar várias sessões no dia, vinculá-las a uma fase ou projeto e continuar em outra data.
- **Concluir fase:** marca um critério conferido pelo usuário, após o pré-requisito e no máximo uma nova fase por dia. Não exige declarar 120 minutos novamente no dia da conclusão e não paga XP/moedas.
- **Concluir projeto:** marca o resultado de um projeto nomeado. O projeto pode reunir sessões de vários dias, ser livre ou ligado a uma fase, e continuar após o fim do mapa. Criar, concluir e reabrir não gera pontos adicionais.

Os 120 minutos diários continuam editáveis. Os blocos propostos são 18:00–19:00 e 19:10–20:10, com dez minutos de pausa fora da contagem. A mínima de cinco minutos continua disponível e não equivale a cumprir duas horas. Descanso, alimentação, lazer básico e cuidados essenciais do cachorro foram preservados.

## Como usar

1. Se aparecer o aviso de dados anteriores, escolha **Ativar sessões independentes**, confira a prévia e pressione **Ativar e preservar cópia anterior**. É possível exportar o backup antes da troca.
2. Em Hoje ou Trilha Python, abra **Registrar sessão**. Registre somente a prática realizada; a pausa não entra nos minutos.
3. Na Trilha, confira o critério da fase no seu editor e marque o marco separadamente quando estiver pronto. A mesma fase pode ocupar várias sessões e dias.
4. Use **Criar projeto** para nomear um projeto. Nas próximas sessões, escolha o tipo Projeto e o projeto em andamento. Marque a conclusão quando terminar, sem outro pagamento.
5. Consulte e corrija sessões na Trilha ou no Histórico. Reabra uma conclusão de projeto ou corrija a última fase se tiver marcado por engano.

O app continua sem executar, corrigir ou inspecionar o código Python. Duração, exercícios e critérios são autorrelatos, não certificação de competência.

## Pontuação: soma diária com teto

O orçamento usa os valores salvos da missão Python no primeiro registro daquele dia. A meta, mínima, pontos e distribuição de habilidades são guardados como um snapshot; mudar Ajustes depois não reescreve o orçamento de um dia já iniciado.

Padrões:

| Minutos ativos do dia | XP acumulado de estudo | Moedas acumuladas de estudo |
|---:|---:|---:|
| 0 | 0 | 0 |
| 5 | 5 | 2 |
| 60 | 60 | 18 |
| 120 | 120 | 36 |
| 165 | 120 | 36 |

Cada sessão recebe apenas a diferença para o total já creditado. Portanto, 60 + 60 minutos e 5 + 115 minutos chegam a 120 XP/36 moedas. Dividir os mesmos cinco minutos em várias sessões não aumenta sua recompensa. Tempo extra e exercícios continuam registrados, sem ultrapassar o teto de pontos.

Para um orçamento com meta `G`, mínima `g` e recompensa `R`/`r`, a função cumulativa é:

- Abaixo de `g`: `piso(r × minutos ÷ g)`.
- Entre `g` e `G`: `r + piso((R − r) × (minutos − g) ÷ (G − g))`.
- Ao atingir `G`: `R`, sem acréscimo por tempo excedente.

A mesma regra é aplicada separadamente a XP e moedas, com aritmética de inteiros antes da divisão. Se mínima e meta forem iguais, a meta encerra o cálculo. Duas habilidades repartem o XP desse orçamento; não duplicam o XP total ou as moedas.

No mesmo dia de um registro v1, seus pontos ativos servem de piso. A recompensa nova é `máximo(0, recompensa calculada − pontos antigos)`. Uma normal antiga já paga não rende outra normal no mesmo dia. Uma mínima antiga já paga permite apenas o complemento até o teto; os minutos antigos continuam desconhecidos.

## Correções sem apagar prática ou marcos

- Corrigir uma sessão mantém a ação original e uma correção no histórico, reduz minutos/exercícios ativos e recalcula somente a diferença de pontos necessária.
- Uma sessão corrigida não apaga a fase ou o projeto. Se havia prática acima do teto, a redução de pontos pode ser menor que o pagamento original daquela sessão.
- Corrigir a fase mais recente preserva sessões, exercícios e pontos. Fases dependentes precisam ser corrigidas da mais recente para a anterior.
- Reabrir um projeto preserva suas sessões. Um projeto existente continua estudável mesmo após corrigir uma fase à qual ele foi associado.
- As correções continuam possíveis enquanto a jornada está pausada; novos registros de estudo ou marcos exigem retomar.
- Se a retirada de moedas deixaria saldo negativo, a correção é recusada sem alteração parcial. Cancele resgates ainda não utilizados ou recomponha o saldo antes.
- Para corrigir o pagamento de um registro Python v1 no formato novo, corrija primeiro as sessões novas ativas daquele mesmo dia. Isso evita trocar o piso histórico enquanto ele está sendo usado pelo cálculo.
- Reagendar Python após registrar prática naquele dia exige corrigir as sessões ativas antes, preservando o mesmo princípio usado pelas demais missões já registradas.

XP do dia e gráfico semanal continuam usando a **data de lançamento**. Corrigir amanhã uma sessão de hoje lança o débito amanhã e identifica hoje como data da atividade original. Não há punição por faltar nem cobrança acumulada.

## Migração explícita e recuperação

Novos progressos usam **versão 2**. A chave de armazenamento permanece `entre-trilhas-v1`, evitando que uma troca de chave esconda os dados existentes. A aplicação lê e valida v1 e v2.

Abrir ou restaurar um v1 não o converte silenciosamente. A ativação apresenta prévia e usa a mesma substituição recuperável de R0a:

1. Valida o progresso v1 e prepara uma cópia v2.
2. Confere novamente se o progresso continua igual à prévia.
3. Preserva os bytes anteriores no slot de recuperação antes de gravar.
4. Instala e confirma o estado novo. Em falta de espaço ou falha, não anuncia sucesso nem descarta as cópias.

Todos os campos anteriores são preservados, exceto o número da versão; acrescenta-se `study`, com o limite do histórico legado (`legacyEventCount`), snapshots das fases anteriores (`legacyLessons`), orçamentos diários e ações de estudo. Não se inventam sessões, minutos ou exercícios para preencher informações que o formato antigo não tinha.

Exercícios históricos são contados a partir dos registros antigos ativos. Projetos históricos mantêm o autorregistro anterior e são identificados como legados. Novos exercícios vêm das sessões ativas; marcar a fase não soma a contagem novamente.

**Compatibilidade inversa:** versões antigas não reconhecem backups v2. Use a aplicação atual para restaurá-los. A cópia anterior também é local, há apenas um slot, e uma nova substituição bem-sucedida troca seu conteúdo após o aviso. Limpar os dados do navegador pode apagar tanto o progresso quanto a recuperação; continue exportando arquivos externos.

O modelo valida ações, referências, orçamentos, marcos e seus eventos de XP/moedas em conjunto. Dados inconsistentes não são “reparados” inventando saldos ou descartando registros. IDs novos continuam criptográficos, preparados antes de qualquer mutação; pedidos repetidos não repetem o ganho, inclusive depois de uma correção.

## Reprodução e regressões

A base anterior tinha **108 testes Node aprovados**. Antes da implementação:

- O motor reproduziu o bloqueio no dia posterior às 120 fases.
- O navegador reproduziu B05 em quatro contextos isolados, fonte e HTML único, com os próprios arquivos locais servidos por interceptação. Isso é navegador real com transporte simulado, não rede física.
- As primeiras 39 regressões de domínio falharam pela ausência das APIs novas; não representam 39 bugs diferentes.
- A suíte de sessões, contra o snapshot anterior, executou 14 métodos em 30 contextos, com 30 erros esperados pela ausência dos controles de sessão/migração.

A revisão acrescentou casos e corrigiu três inconsistências de domínio:

1. Uma sessão podia preceder a criação do projeto ao qual estava ligada.
2. Um backup podia usar o ID de um projeto histórico em uma criação nova e sobrescrevê-lo na reconstrução.
3. Python podia ser reagendado mesmo com sessões ativas já registradas naquele dia.

Cada caso teve reprodução e regressão antes da correção. Também foram conferidos cálculo por inteiros, continuidade de projeto após corrigir fase, correções durante pausa e a contenção de teclado nos formulários novos em zoom nativo. A verificação de zoom encontrou um escape do foco para o body na fronteira de Tab/Shift+Tab; esse caso passou a ter regressão persistida antes do ajuste de foco.

As mudanças no smoke acompanham a ação nova: primeiro registrar a sessão de 120 minutos e quatro exercícios, depois concluir a fase sem outro ganho. As verificações de missão, saldos, loja, backup, restauração e virada de dia foram mantidas. Os testes Node anteriores não foram enfraquecidos.

## Verificações finais

| Verificação | Resultado confirmado |
|---|---|
| `npm run check` | Aprovado. |
| `npm test` | **155 testes aprovados**, zero falhas/ignorados: 108 anteriores + 47 regressões de estudo e integridade v2. |
| `npm run build` | Aprovado; HTML único regenerado a partir das fontes. |
| `python3 tests/browser_smoke.py` | Aprovado: missão, saldos, compra/estorno, sessão de 120 min e quatro exercícios antes da fase sem novo ganho, backup/restauração e virada de dia. |
| `python3 tests/browser_integrity.py` | **14 testes / 36 contextos aprovados**, fonte e HTML único, incluindo recuperação e falhas de armazenamento. |
| `python3 tests/browser_opening.py` | **7 testes / 32 contextos aprovados**: loopback HTTP real e HTTP não confiável/HTTPS simulados, sem teste de transporte TLS ou aparelho físico. |
| `python3 tests/browser_accessibility.py` | **15 testes / 42 contextos aprovados**, teclado, contraste e larguras móveis nos dois artefatos. |
| `python3 tests/browser_zoom.py` | **4 testes / 8 perfis temporários aprovados**, zoom nativo de 200%, incluindo formulários de sessão/projeto e contenção de Tab/Shift+Tab. |
| `python3 tests/browser_sessions.py` | **14 testes / 32 contextos aprovados**, aplicação modular e HTML único. |
| Exemplos Python | Dez exemplos existentes (fases 1, 2, 3, 4, 5, 6, 8, 13, 20 e 25) passaram na compilação sintática/AST; não é execução ou revisão dos 600 desafios. |
| Pacotes | ZIPs atualizados; CRC e conteúdo comparados com as fontes, bundle sintaticamente válido e build determinístico. Na cópia extraída: sintaxe, 155 testes Node e build aprovados; quatro testes de navegador/oito contextos nos dois artefatos aprovados (sessões, migração após 120 fases, restauração/reabertura e falha de gravação). |
| GitHub | PENDENTE — enviar somente depois da validação; registrar commit/PR após confirmar o resultado. |

Todos os testes usam dados fictícios e perfis/contextos separados. Nenhum progresso pessoal do usuário é acessado ou sobrescrito.

## Limites e escopo preservado

- Dados continuam locais ao navegador, perfil e origem. Sem sincronização, PWA, conta ou backend de progresso.
- O cronômetro continua opcional, sem conclusão automática e sem persistência ao fechar/recarregar.
- Exercícios são contagens por autorregistro, sem identificação por enunciado. O sistema evita reaplicar o mesmo pedido e recontar exercícios ao marcar fase; não detecta se o usuário informou o mesmo exercício em sessões diferentes.
- O limite técnico é 1.440 minutos ativos por dia e 1.000 exercícios por sessão; isso não é meta de estudo nem cria tempo na agenda.
- Não há testes em aparelhos físicos, Safari, Firefox ou leitores de tela. Chromium automatizado, contraste amostrado e zoom nativo não equivalem a certificação WCAG.
- HTTP de rede local e HTTPS seguem os cenários simulados documentados; não houve verificação de roteador, certificado ou handshake TLS. O caminho `file://` segue sem homologação funcional; use o HTML servido.
- A agenda fixa ainda não acompanha automaticamente todas as edições. A unificação de Hoje/Agenda/Loja pertence à próxima entrega.
- Finanças F1–F3, novas fases, dicas/checklist por exercício, avatar, PWA e sincronização não foram implementados neste ciclo.

## Próxima entrega e publicação

A solicitação atual autoriza publicar o código validado em `danielfeuser23/vida`, preservando o histórico existente, sem force push e sem deploy. O histórico remoto consultado tinha apenas o commit inicial com README; o envio efetivo ainda precisa ser confirmado na tabela acima.

Depois de concluir as verificações e confirmar a publicação desta versão, executar **melhorar Hoje e unificar a agenda** em uma entrega separada, com seus testes, documentação e pacote. Não avançar além desse ciclo. Descanso, refeições, lazer básico e cuidados essenciais continuam preservados e independentes de moedas.
