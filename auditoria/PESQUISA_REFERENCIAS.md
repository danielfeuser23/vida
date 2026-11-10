# Pesquisa de referências e evolução do Entre Trilhas

> Estado em 09/11/2026: sessões de Python independentes foram validadas e publicadas em 1.1.0, conforme [ENTREGA_SESSOES_PYTHON.md](ENTREGA_SESSOES_PYTHON.md). [Hoje e agenda 1.2.0](ENTREGA_HOJE_AGENDA.md) foi implementada e validada; consulte o relatório para distribuição/publicação. Este documento preserva a pesquisa de 05/11/2026; não houve nova consulta online nessa atualização.

> Estado em 06/11/2026: R0a/R0b/R0c entregues; [ENTREGA_R0C.md](ENTREGA_R0C.md) documenta comportamento e acessibilidade. A pesquisa abaixo mantém sua data e suas limitações originais; não houve nova consulta online nesta entrega. Próxima expansão: separar sessões de Python das fases.

> Atualização: R0b foi entregue em 05/11/2026. Consulte [ENTREGA_R0B.md](ENTREGA_R0B.md) para a correção de IDs e a matriz de abertura. Este documento preserva o registro da etapa anterior.

> Atualização de 05/11/2026: R0a implementa validação e restauração recuperável, além de falhas de gravação. Consulte [ENTREGA_R0A.md](ENTREGA_R0A.md). O conteúdo abaixo preserva o diagnóstico/plano anterior; as demais etapas continuam pendentes.

**Consulta online: 05/11/2026 · America/Sao_Paulo. Escopo: pesquisa e planejamento, sem implementação.**

## 1. Recomendação e contexto

A principal expansão de valor é transformar o mapa de Python em prática contínua apoiada por uma agenda confiável. Antes dela, permanecem prioritárias as correções de integridade, gravação e abertura já identificadas na auditoria.

Foram lidos README.md, PLANO.md e os documentos Markdown preexistentes de auditoria: AUDITORIA.md, ROADMAP.md e PROMPT_REVISAO.md. A aplicação atual é estática, sem dependências externas, com seis telas, localStorage, backup JSON, 120 fases e 600 desafios. A auditoria registra apenas dez fases com exemplos de código, sessão vinculada à conclusão de fase e problemas de backup, horários, foco e desempenho. Esses achados são contexto: não foram novamente testados nem corrigidos nesta pesquisa.

Requisitos preservados:

- Trabalho seg–sex, 08:00–17:00; uma hora total de trajeto com o cachorro, que fica com a mãe durante o expediente.
- Python **18:00–19:00 e 19:10–20:10**, com pausa de dez minutos fora das duas horas. Nada depende de estudar no trabalho ou trajeto.
- Alimentação, higiene, descanso, lazer básico e cuidados essenciais do cachorro independem de moedas. Horários alimentares e divisão de responsabilidades continuam ajustáveis à rotina real.
- Extras cabem nas janelas existentes: 21:30–21:50; nas folgas também 14:00–16:00. Moedas não criam tempo; dormir continua às 22:30.
- Faltar não reduz XP acumulado, remove conquistas legítimas ou cria dívida. Não aumentar metas automaticamente nem exigir sequência perfeita. Correções de marcações acidentais continuam necessárias.

## 2. Método e limites de evidência

Foram consultados por HTTPS documentação oficial, código/configurações públicos, licenças, releases e uma discussão de usuário. Não foram instalados os produtos, executado seu código, copiados ativos ou adicionadas dependências.

**Documentado** significa descrito pelo mantenedor, não testado por nós. **Observado no código** significa regra no arquivo consultado, sem garantir equivalência à produção. **Beta/planejado** não equivale a lançado. **Relato** é uma issue, não funcionalidade. Toda adaptação abaixo é **proposta nossa**, ainda não implementada.

As páginas diretas de LifeUp Wiki, Habitica e Finch retornaram **403 CONNECT** antes de receber conteúdo. Também houve bloqueio dos sites Exercism e Anki. Repositórios oficiais acessíveis no GitHub foram consultados como fontes independentes permitidas; não foram usados proxies de re-hospedagem para contornar a política.

**LifeUp agora tem evidência verificável pelo repositório oficial e fonte da wiki**, embora seu site continue bloqueado. **Finch permanece não verificado** e não fundamenta a seleção das dez ideias. Não afirmar que páginas bloqueadas foram lidas.

Não houve teste de interfaces externas, assinaturas, notificações, sincronização, entrevistas ou estudo empírico de eficácia. As propostas visuais são autorais, não cópias de screenshots. Releases recentes são sinais pontuais, não garantia de manutenção futura.

## 3. Comparação das referências reais

| Referência | Verificado em fonte oficial | Estado e cuidado | O que adaptar |
|---|---|---|---|
| **LifeUp** [L1], [L2], [L3], [L4] | XP/moedas, habilidades personalizadas, loja, conquistas, repetição, checklists, Pomodoro e backups. Templates e temas documentados em v1.93. | App fechado; repo principal é apresentação/feedback. Google Calendar bidirecional está **planejado/em desenvolvimento** [L5], não confirmado como lançado. | Templates de rotina, loja de extras, conquistas por marcos e backup recuperável. |
| **Habitica** [H1], [H2] | README: RPG, níveis, Gold, equipamentos e perda de HP. Código trata hábitos, diárias, tarefas pontuais, recompensas, checklists, desfazer e saldo insuficiente. | Código de develop, não teste da produção. README informa pausa de PRs públicos desde 04/08/2026. | Tipos de missão e cosméticos; **rejeitar HP perdido por faltas**. |
| **Finch** [F0] | Nenhuma funcionalidade oficial verificada nesta consulta. | Página bloqueada por 403. Não pontuado na seleção baseada em evidências. | Acolhimento continua decisão nossa, sem atribuir recurso específico ao Finch. |
| **Super Productivity** [S1], [S2] | Planner/timeline, timeboxing, subtarefas, tempo, pausas, Pomodoro/Flowtime/countdown, notas, métricas, backup e offline-first. | v19.3.1 observada em 25/10/2026. Não foi confirmada uma função específica chamada revisão semanal. | Agenda única, foco adaptável e estimado versus realizado. |
| **Loop Habit Tracker** [U1], [U2] | Frequências flexíveis, estatísticas, lembretes, widgets, CSV/SQLite, offline sem conta. | Android; v2.3.2 observada em 17/10/2026. O score enfraquece com faltas: **não importar essa regra**. | Frequência editável, visão semanal e portabilidade. |
| **Exercism Python** [E1], [E2], [E3] | Conceitos/prática separados, pré-requisitos, instruções, dicas por tarefa e testes verificáveis. | Config contém beta/wip/deprecated; o exemplo de conceito consultado está beta. README pausa contribuições comunitárias. | Exercícios autorais com critérios e pistas, extras sem exigir outra fase. |
| **Microsoft Getting started with Python** [M1] | Três séries progressivas: fundamentos, sintaxe mais profunda e ferramentas de dados. | Pressupõe experiência leve em outra linguagem e Git. Vídeos externos não testados. Complemento, não currículo pronto do zero. | Organização em camadas, reescrevendo a base e os projetos para nosso usuário. |
| **Anki** [A1], [A2] | Revisão espaçada; manual explica recordação ativa e feedback de dificuldade. | Manual consultado avisa migração ao repo principal. Não se confirmou algoritmo padrão de uma versão instalada. | Revisões pequenas e adiáveis dentro das duas horas. |
| **Dexie.js / IndexedDB** [D1], [T1] | Wrapper com exemplo JS puro, consultas e esquema versionado. IndexedDB é transacional/assíncrono. | Candidato técnico, não requisito. Dexie v4.4.7 observada em 19/10/2026. Banco local não cria sincronização entre aparelhos. | Avaliar após corrigir algoritmos/paginar, comparando com API nativa. |
| **W3C / MDN** [W1], [W2], [W3], [T2], [T3] | Contraste, foco, alvos, armazenamento e contextos seguros/service workers. | Documentação técnica; não certifica nosso aplicativo. | Acessibilidade em cada entrega e offline com atualização segura. |

### Um relato e uma correção: lição sobre migrações

A [issue Dexie #1050][D3], criada em 15/05/2020, relata falha de importação após upgrade. Foi observada **CLOSED/COMPLETED**. O [PR #2329][D4], **MERGED em 19/10/2026**, trata esquema legado; a release [v4.4.7][D2] lista a correção no pacote relacionado dexie-export-import 4.4.2. Não confundir a versão do addon com a do banco, nem tratar relato fechado como falha atual. A lição é exigir backups antigos→versão nova e reversão, mesmo usando biblioteca madura.

## 4. Dez melhorias priorizadas

A ordem é avaliação qualitativa de aderência, benefício e problema conhecido; não é ranking científico. **P/M/G** são portes relativos, não prazos. Todas dependem de manter o progresso e a economia consistentes.

| Ordem | Proposta original | Origem | Benefício / porte | Dependência principal |
|---:|---|---|---|---|
| 1 | Backup com recuperação e portabilidade | LifeUp, Loop, MDN e discussão Dexie | Muito alto / M | Integridade corrigida |
| 2 | Hoje compacto e acessível | W3C e foco/subtarefas Super Productivity | Alto / M | Foco, contraste e feedback |
| 3 | Sessão de estudo independente da fase | Tempo/tarefa Super Productivity + conceitos/prática Exercism | Muito alto / M–G | Novo modelo de sessão |
| 4 | Agenda única, templates e frequência flexível | Super Productivity, Loop, LifeUp | Muito alto / M–G | Ocorrências e blocos unificados |
| 5 | Caderno de exercícios verificáveis com dicas | Exercism | Muito alto / G de conteúdo | Sessão/exercício separados |
| 6 | Revisão curta por recordação ativa | Anki | Alto / M | Registro de exercício/dificuldade |
| 7 | Projetos por marcos e pré-requisitos | Microsoft e Exercism | Alto / G de conteúdo | Sequência pedagógica revisada |
| 8 | Revisão semanal acolhedora | Estatísticas Loop + métricas Super Productivity | Alto / P–M | Datas/totais confiáveis |
| 9 | Loja de extras e refúgio por conquistas | LifeUp e Habitica | Médio–alto / M | Economia estável e arte própria |
| 10 | Histórico escalável e abertura offline | Loop, MDN e candidato Dexie | Alto no uso prolongado / G | Medições, migrações e HTTPS |

### 1. Backup recuperável

**Origem/mecânica:** LifeUp documenta exportar/importar e backups [L3]; Loop oferece formatos portáteis [U1]; IndexedDB usa transações [T1]. O relato de migração [D3], [D4] reforça a necessidade de testar versões antigas.

**Problema/adaptação:** enfrentar backup malformado e gravação enganosa. Mostrar versão/data/resumo, validar em cópia, preservar o estado anterior e permitir reversão. JSON completo restaura; CSV opcional serve à análise, não substitui o livro de eventos.

**Benefício, esforço e dependências:** muito alto, M; R0 e esquema versionado. **Risco:** cópias locais também desaparecem se o navegador for limpo; não prometer nuvem inexistente.

**Aceite:** arquivo inconsistente não altera a cópia atual; exportar/fechar/restaurar mantém eventos e saldos; quota/interrupção preserva recuperação; teste de backups antigos e duas abas. Sucesso só após persistência confirmada.

### 2. Hoje como bússola acessível

**Origem/mecânica:** foco, contraste e alvos W3C [W1], [W2], [W3]; subtarefas e foco documentados no Super Productivity [S1]. A composição é nossa.

**Problema/adaptação:** cartões longos e foco perdido. Destacar próxima ação que cabe agora, diferenciar pendência passada, recolher concluídas e manter essenciais visíveis. Detalhes e mínima sob demanda; cronômetro atualiza texto sem recriar controles; diálogos recebem nome acessível.

**Benefício, esforço e dependências:** alto, M; foco/feedback corrigidos e componentes estáveis. **Risco:** simplificar escondendo necessidades do cachorro ou falhas.

**Aceite:** iniciar e registrar tarefa comum com poucos cliques; teclado completo sem perda de foco; texto normal ≥4,5:1; zoom 200% e 320–430 px sem corte horizontal. Buscar toque confortável de 44×44 px. **Precisão:** WCAG 2.2 mínimo é 24×24 CSS px com exceções; 44×44 pertence ao critério aprimorado, não é o mínimo universal.

### 3. Estudar sem precisar terminar a fase

**Origem/mecânica:** tarefas/tempo [S1], conceitos/prática [E1], [E2]. O vínculo entre sessão, fase e pontos é nossa proposta.

**Problema/adaptação:** fase difícil pode exigir dias e o mapa concluído bloqueia estudo normal. Separar sessão, exercício, fase e projeto. Sessão registra prática; fase avança pelo critério, no máximo uma nova por dia. Revisão/projeto livre continuam após fase 120. Manter os dois blocos escolhidos e cronômetro opcional, persistente, sem conclusão automática.

**Benefício, esforço e dependências:** muito alto, M–G; modelo versionado e migração. **Risco:** pagar duas vezes pelo mesmo esforço.

**Aceite:** registrar 120 minutos sem liberar fase; concluir o marco depois sem repetir o ganho da sessão; mínima→normal concede só a diferença. Proposta inicial: preservar o orçamento atual normal **120 XP/36 moedas**, associado à prática; fase é marco sem segundo pagamento automático. Valores continuam editáveis; estudar não depende das moedas.

### 4. Uma agenda nas três telas

**Origem/mecânica:** planner/timeboxing [S1], frequência flexível [U1], templates LifeUp v1.93 [L4].

**Problema/adaptação:** horários editados e grade fixa divergem. Um modelo alimenta Hoje, Agenda e Loja, com dois blocos de estudo, pausa e dois passeios separados. Templates trabalho/folga/dia difícil editáveis não alteram passado; frequência pode usar dias escolhidos ou meta semanal pertinente. Essenciais do cachorro continuam ou recebem ajuda combinada, sem presumir disponibilidade da esposa/mãe.

**Benefício, esforço e dependências:** muito alto, M–G; ocorrências/exceções/blocos. **Risco:** automatizar retirando descanso ou empilhando pendências.

**Aceite:** editar sábado reflete nas três telas; Python soma 120 minutos fora de trabalho/trajeto e pausa; resgate não invade refeições/lazer básico/sono; conflito aparece antes de salvar; reagendar não cria dívida nem recompensa.

### 5. Exercícios com resultado conferível e pistas

**Origem/mecânica:** instruções, dicas e testes Exercism [E3], [E4]; nenhum enunciado será copiado.

**Problema/adaptação:** muitos desafios, pouco apoio ao iniciante. Cada exercício autoral terá objetivo, entrada/saída, casos normais/borda, três pistas, solução comentada e estado. Extras por dificuldade ocupam a sessão disponível, sem obrigar novas fases. Exemplos próprios: somar pontos de hábitos, validar horários, calcular passeio.

**Benefício, esforço e dependências:** muito alto; G de conteúdo/M de interface; registros separados e revisão pedagógica. **Risco:** solução prematura, conteúdo superficial ou autorregistro parecer correção automática.

**Aceite:** primeira semana piloto com exemplos executáveis e testes locais conferidos; pistas não concluem; exercício conta uma vez. Começar com editor local e testes autorais, sem executor de código não confiável no servidor. Validar qualidade antes de ampliar o catálogo.

### 6. Revisão curta, sem fila punitiva

**Origem/mecânica:** recordação ativa e espaçamento Anki [A1], [A2]. Agenda simples original, sem chamar nossa lógica de FSRS.

**Problema/adaptação:** avançar não garante recordar; retorno após pausa é difícil. Oferecer uma a três questões já praticadas, tentar antes da solução e marcar dificuldade. Reservar 10–15 minutos **dentro** das duas horas; programar continua central. Datas sugeridas são editáveis e dispensáveis.

**Benefício, esforço e dependências:** alto, M; exercício/dificuldade/fuso. **Risco:** atraso virar culpa ou flashcards substituírem prática.

**Aceite:** faltar não cria pilha obrigatória ou perda de XP; revisão não bloqueia fase; adiamento controlado pelo usuário; perguntas e exercícios distintos sem pontuação duplicada. Não prometer resultados de memória específicos.

### 7. Projetos por evidência

**Origem/mecânica:** camadas Microsoft [M1] e pré-requisitos Exercism [E2]. Projetos de rotina são nossos.

**Problema/adaptação:** 120 dias ou nível alto não certificam domínio. Organizar mundos com marcos: Diário de pontos → JSON → CLI testada → banco → API → projeto integrador. Cada entrega pode durar vários dias. Ensinar terminal/arquivos/erros desde zero; a referência Microsoft presume outra linguagem e Git.

**Benefício, esforço e dependências:** alto, G de conteúdo; exercícios e sequência revisados. **Risco:** correr para ferramentas avançadas sem base.

**Aceite:** pré-requisitos visíveis; demonstração concreta por marco; projeto conta uma vez; progresso mostra exercícios/entregas além de XP; revisão continua após o mapa. Conferir idioma, requisitos e funcionamento antes de indicar links externos ao aluno.

### 8. Revisão semanal que permite manter tudo igual

**Origem/mecânica:** estatísticas/frequências Loop [U1] + métricas Super Productivity [S1]. **O ritual semanal é proposta nossa**, não função específica confirmada nesses produtos.

**Problema/adaptação:** duas horas já são carga relevante. Após sete dias, mostrar prática, mínimas, retomadas, tempo, exercícios e projetos. Três reflexões: o que coube, o que pesou, o que manter/ajustar. Nenhuma alteração automática.

**Benefício, esforço e dependências:** alto, P–M; totais líquidos e datas. **Risco:** percentual de perfeição virar julgamento.

**Aceite:** até dez minutos dentro do tempo livre de domingo; opção manter; pausa sem fracasso; mudanças afetam só futuras ocorrências; não reproduzir score enfraquecido do Loop.

### 9. Refúgio e loja com autoria própria

**Origem/mecânica:** loja/conquistas LifeUp [L1], [L2]; personagem/equipamentos Habitica [H1]. Finch não é usado como evidência.

**Problema/adaptação:** RPG principalmente numérico e compra sem clareza de tempo. Separar inventário cosmético de extras reais. Marcos liberam objetos autorais: luminária após projeto, livros por leitura, cores do avatar. Loja mostra saldo restante, duração, limite e janela antes da reserva. Companheiro ilustrado não valida cuidados reais.

**Benefício, esforço e dependências:** médio–alto, M; economia corrigida e arte original. **Risco:** distração, inflação ou confusão entre conquista e compra.

**Aceite:** básicos livres; recompensa pequena alcançável em dia parcial; resgate/estorno únicos; saldo não cria tempo; cosméticos não somem por faltar; correção de registro falso recalcula critérios. Feedback breve/desligável, sem aumentar cliques diários.

### 10. Histórico rápido e offline explícito

**Origem/mecânica:** offline Loop [U1], IndexedDB [T1], service workers [T2], candidato Dexie [D1].

**Problema/adaptação:** histórico integral e validações crescentes. Primeiro paginar/indexar; depois avaliar armazenamento assíncrono e PWA com cache versionado. Distinguir salvo local, offline e sincronizado — este último só quando implementado. HTML único é artefato separado; não prometer service worker em abertura direta de arquivo.

**Benefício, esforço e dependências:** alto no longo prazo, G; R0, medições, migração e HTTPS. **Risco:** cache antigo com dados novos ou migração irreversível.

**Aceite:** comparar 30/365/1.095 dias antes/depois com repetições; paginação mantém totais; reabrir offline após instalação; interromper atualização e recuperar; testar quota, abas e legado. Nunca apagar cópia antiga antes de confirmar nova.

## 5. Três propostas visuais concretas e originais

Não são telas implementadas ou screenshots copiados. Podem coexistir como telas do mesmo produto.

### A — Bússola do dia

**Hoje no celular:** cabeçalho pequeno com data/nível/moedas, paisagem menor, próxima ação acima da lista, essenciais visíveis, concluídas recolhidas.

    ENTRE TRILHAS                         20 moedas
    Quarta · seu ritmo vale
    PRÓXIMO BLOCO · 18:00–19:00
    Python: praticar condicionais
    [ Começar sessão ]  [ Dia difícil ]
    Pausa às 19:00 · fora do tempo de estudo
    ESSENCIAIS: água · alimentação · passeio
    MANHÃ 3 feitas ▾         NOITE 2 pendentes ▾

Texto principal de 16 px como ponto inicial; ícone com rótulo; mínima fácil de achar. A decoração não ocupa o primeiro scroll inteiro. **Aceite de protótipo:** em 390 px a próxima ação e botão aparecem sem rolar; tarefa comum exige até dois acionamentos após abrir Hoje; teclado/zoom funcionam. É meta, não medição já realizada.

### B — Caderno do aprendiz

**Python:** mapa compacto à esquerda e exercício à direita no desktop; no celular, mapa recolhível e foco no exercício. Sem editor falso que pareça executar código.

    Mundo: Decisões                    Sessão 45/120 min
    Fase 9 · em prática                [ Pausar ]
    Exercício: distribuir pontos de três hábitos
    Entrada esperada → resultado esperado
    [ Ver pista 1 ] [ Abrir referência ]
    [ Conferi no meu editor ]
    [ Registrar sessão ] [ Ver critério da fase ]

Monoespaçada apenas no código; números discretos; prática e marco têm ações distintas. **Aceite:** registrar duas horas sem precisar afirmar que terminou fase; retornar preserva notas/estado; nenhum nível equivale a certificação.

### C — Refúgio vivo

**Personagem/Loja:** cena autoral leve de acampamento/floresta, avatar e companheiro; até três objetos com mudança por marcos. Dados sobre cartões opacos, nunca perdidos sobre a imagem.

    Viajante · nível 3          35/100 XP
    Refúgio: biblioteca · bancada · jardim
    Luminária: primeiro projeto demonstrado
    Vídeo extra · 15 moedas · 20 min
    Cabe 21:30–21:50 · saldo após compra: 5
    [ Reservar ]

Arte própria SVG/ilustração, efeitos breves e movimento reduzido. **Aceite:** decoração não adiciona passos à conclusão; ausência da imagem não impede uso; recompensa sem janela é explicada antes da compra.

**Paleta proposta, ainda não aplicada:** fundo #fffdf7, texto #243c32, auxiliar #566755, ouro textual #735514, botão #315c49 com branco. Contrastes calculados por luminância relativa: **11,68:1**, **5,95:1**, **6,79:1** e **7,62:1**, respectivamente. São medidas dessas combinações opacas, não validação de estados, imagens, hover, foco ou modo escuro.

## 6. Roadmap revisado em entregas pequenas

As correções conhecidas continuam antes das expansões. Nenhuma entrega abaixo está implementada.

| Entrega | Conteúdo / dependência | Critério de aceite |
|---|---|---|
| **R0a — Integridade** | B01/B04: mapas, eventos, referências, roundtrip e recuperação; base de M1 | Backup inconsistente não substitui dados; backup normal restaura saldos/eventos; testar versões anteriores. |
| **R0b — Gravação e abertura** | B08/B09: contexto suportado, UUID, sucesso falso; após R0a | Todos os caminhos documentados funcionam; quota mantém erro real; repetições não duplicam ganho/compra/estorno. |
| **R0c — Correção e acesso** | B02/B03/B06/B07/B10/B11: horário, XP líquido, foco, contraste, editor/diálogo | Desfazer zera ganho líquido; horário salvo prevalece; teclado/zoom completos sem perder foco. |
| **R1 — Hoje compacto** | M2 e protótipo A; depende R0 | Próxima ação visível no celular, essenciais/mínimas claros e controles medidos. |
| **R2a — Sessão sem fase** | M3 e continuidade B05; modelo versionado | Registrar duas horas sem avançar; finalizar depois sem segundo pagamento; prática após fase 120. |
| **R2b — Agenda única** | M4; integrar R2a | Hoje/Agenda/Loja usam os mesmos intervalos; conflito antes do resgate; template preserva passado. |
| **R3a — Semana piloto Python** | M5/parte M7/protótipo B; após R2a | Fases 1–7 autorais desde zero, exemplos/testes locais conferidos, dicas e contagem única. |
| **R3b — Revisão e projeto** | M6/M7; ampliar até Diário de pontos | Revisão cabe nas duas horas; projeto pode ocupar dias; atraso não bloqueia retomada. |
| **R4 — Revisão semanal** | M8; após R2 e totais corretos | Após sete dias, manter/ajustar sem metas automáticas; distinguir prática, mínimas e entregas. |
| **R5 — Loja e refúgio** | M9/protótipo C; economia estável | Extras cabem; cosméticos sem punição; poucos cliques preservados. |
| **R6a — Histórico medido** | Parte M10; após R0 | Medições repetidas 365/1.095 dias melhoram sem divergência; definir metas com aparelho de referência. |
| **R6b — Persistência/offline** | Restante M10; após R6a, HTTPS e migração | Atualização interrompida recuperável; reabrir offline; backup continua portátil. |
| **R7 — Sincronização opcional** | Necessidade/custo confirmados; após R0/R6 | Dois aparelhos não duplicam operação; privacidade/exclusão e reconexão verificadas; offline preservado. |

**Mudanças em relação ao roadmap anterior:** sessão/fase vem cedo para atender às duas horas reais; conteúdo passa por piloto antes de multiplicar desafios; revisão semanal é explícita e pequena; paginação precede decisão de banco/biblioteca; sincronização continua posterior. O roadmap anterior foi preservado para rastrear a evolução.

Métricas propostas: passos/tempo para registrar missão, restauração confirmada, sessões sem bloqueio por fase, exercícios de fato conferidos, clareza da próxima ação e adequação da rotina após sete dias. Não usar tempo dentro do app, sequência perfeita ou cliques totais como metas de engajamento.

## 7. Ideias descartadas ou adiadas

| Ideia | Decisão e motivo |
|---|---|
| Perda de HP Habitica ou enfraquecimento de score Loop | **Descartar:** contrariam retomada sem punição e XP preservado. |
| Loot boxes/crafting complexo LifeUp | **Descartar neste escopo:** economia menos previsível, distração e esforço sem resolver problemas centrais. |
| Pomodoro 25/5 obrigatório | **Descartar como padrão:** usuário escolheu dois blocos de 60 minutos com dez de pausa. |
| Fase obrigatoriamente concluída por calendário | **Descartar:** fase pode durar dias; no máximo uma nova por dia, com pré-requisitos. |
| Importar integralmente currículo Microsoft/Exercism | **Descartar:** pré-requisitos, beta e autoria exigem conteúdo adequado do zero. |
| Copiar sprites, mascotes, imagens, textos ou aparência | **Descartar:** identidade própria e obrigações de licenças; adaptar princípios basta. |
| Calendar bidirecional LifeUp como recurso lançado | **Descartar essa afirmação:** fonte é plano em desenvolvimento. |
| Bloquear outros apps ou prometer efeitos de dopamina | **Descartar:** não são capacidades nem garantias deste aplicativo. |
| Nuvem/notificações obrigatórias | **Adiar:** primeiro dados confiáveis; futuras notificações opt-in, com silêncio noturno e suporte verificado. |
| Embutir Anki, SDK LifeUp ou backend Habitica | **Não recomendar:** complexidade/tecnologia/licenças sem necessidade para o escopo. |
| Executor Python no servidor | **Adiar:** conteúdo e testes locais primeiro; execução não confiável exige projeto específico. |
| Dexie Cloud/addons antigos automaticamente | **Não adotar:** Cloud é produto separado; dexie-observable e dexie-syncable são marcados legados/sem manutenção no README. |

## 8. Licenças, manutenção e adoção técnica

Nenhum pacote foi instalado. O padrão é código, conteúdo e arte autorais. Licença do repositório não cobre automaticamente marcas, vídeos, todos os assets ou serviços vinculados.

| Projeto | Licença observada / manutenção | Compatibilidade e decisão |
|---|---|---|
| LifeUp | README declara app fechado; wiki contém plano 2026–2027. Não presumir licença livre da wiki/SDK. | App Android não é componente web. SDK/Desktop não auditados para adoção; só inspiração. |
| Habitica | [Código GPLv3; assets BrowserQuest CC BY-SA 3.0 e HabitRPG CC BY-NC-SA 3.0][H3]. Pausa de PRs públicos no README. | Aplicação completa, não biblioteca. Não incorporar código/ativos. |
| Super Productivity | [MIT][S3]; release v19.3.1 em 25/10/2026. | Adaptar padrões, sem transportar aplicação/framework. Reuso exigiria avisos/licença. |
| Loop | README declara GPLv3 ou posterior [U1]; tentativas LICENSE/COPYING retornaram 404. Release v2.3.2 em 17/10/2026. | Android; widgets/notificações não são portáveis automaticamente. Não incorporar código. |
| Exercism Python | [MIT][E5]; config beta/wip e contribuições pausadas. | Referência de estrutura, não dependência runtime; conteúdo próprio. |
| Microsoft | [MIT][M2]; HEAD observado, sem verificação de release/data de manutenção. | Complemento; links de vídeo antigos precisam de revisão antes de indicação. |
| Anki/manual | [Core AGPLv3 ou posterior][A3] com outros componentes; [manual CC BY-SA 4.0][A4], com aviso de migração. | Não embutir core ou copiar texto/algoritmo. Revisão simples original, sem chamar de FSRS. |
| **Dexie.js: único candidato de biblioteca para avaliar** | [Apache-2.0][D5], [manifesto][D6]; v4.4.7 em 19/10/2026. | JS puro, sem exigir React. Exige camada assíncrona, migração e adaptar build do HTML único. Comparar com IndexedDB nativo após medir; fixar versão e conferir avisos/NOTICE se adotado. |

Releases recentes não são auditoria de vulnerabilidades. Não foram auditados binários/dependências transitivas; nenhuma biblioteca está aprovada para incorporação imediata. Não é necessário adicionar biblioteca de UI/ícones para as propostas visuais.

## 9. Fontes, data e rastreabilidade

**Todas consultadas em 05/11/2026.** Conteúdo descrito como lido retornou HTTP 200 em GitHub/raw; páginas bloqueadas e caminhos 404 estão explicitados. Revisões fixadas distinguem a fonte observada de mudanças futuras.

- **LifeUp:** [README][L1], SHA 284c6315e8cfa8289ef58607e86e037560b0158a, com links à wiki/SDK/Desktop; [introdução][L2], [backup][L3], [v1.93][L4] e [plano 2026–2027][L5] da wiki, SHA 82f157bffec2d638c92aecf3fe3e03a1743cc7bf.
- **Habitica:** [README][H1], [scoreTask.js][H2] e [LICENSE][H3], SHA 12091ca02990533fdf38c2f0947397f0b4e39d59.
- **Super Productivity:** [README][S1], SHA fcc77e7f472c5c442f2ebf0b42889494d08e5889; [release v19.3.1][S2], publicada em 25/10/2026; [LICENSE][S3].
- **Loop:** [README][U1], SHA 82c1ff287a8ac05321bfa95b61399fa8a2d1da5b; [release v2.3.2][U2], publicada em 17/10/2026.
- **Exercism:** [README][E1] e [config][E2], SHA 6105f6d9d3ef66ce3d5c8f529d2882af3d76b706; exemplo de conceito com [instruções][E3], [dicas][E3h], [testes][E3t]; prática two-fer com [instruções][E4] e [testes][E4t]; [LICENSE][E5]. Exemplos foram lidos, não executados.
- **Microsoft:** [README][M1], SHA a74d0ea8451a9709dcebbb29ae931a9cb82fc695; [LICENSE][M2]. O candidato microsoft/python-for-beginners retornou 404; a fonte encontrada é microsoft/c9-python-getting-started.
- **Anki:** [README][A1], SHA 31f1a034cd44908f74213202e01327fa1ac9176c; [manual background][A2], SHA 91f7485236db2a89d2a8abaed618976caf971de2; [LICENSE][A3] e [README do manual][A4].
- **Dexie:** [README][D1], SHA 45aade72aa19a601e6a13aa877beb7389e15b5d2; [release v4.4.7][D2], 19/10/2026; [issue #1050][D3], [PR #2329][D4], [LICENSE][D5] e [manifesto][D6].
- **W3C:** [contraste][W1], [ordem de foco][W2] e [tamanho de alvo][W3], SHA d1e063920a1574d7fb67823d9343e12bb6cf6829. Documentos explicativos, não certificação.
- **MDN:** [IndexedDB][T1], [service workers][T2] e [randomUUID][T3], SHA 5c76c9c822b4083750ff7fcabcd07422ad3a591b. Conteúdo fixado novamente baixado e conferido com a primeira leitura. Service workers exigem contexto seguro; localhost tem tratamento especial. Isso reforça corrigir o caminho HTTP de rede local antes de prometer PWA.

**Tentados e bloqueados, sem conteúdo recebido:** [LifeUp Wiki](https://wiki.lifeupapp.fun/), [Habitica](https://habitica.com/), [Finch][F0], [Exercism Python](https://exercism.org/tracks/python) e [Anki manual](https://docs.ankiweb.net/background.html). Para completar a comparação direta do Finch é necessário permitir finchcare.com pela configuração suportada e repetir a consulta. As recomendações atuais estão sustentadas nas demais fontes, com essa lacuna explícita.

**Limites finais:** sem teste funcional dos produtos externos, entrevistas, estudo de eficácia ou medição de aderência desta rotina. README, código de desenvolvimento, beta e plano foram diferenciados. A pesquisa não mudou dependências, configuração de rede ou aplicação. Este documento contém o roadmap revisado; a auditoria e o roadmap anteriores foram preservados.

[L1]: https://github.com/Ayagikei/LifeUp/blob/284c6315e8cfa8289ef58607e86e037560b0158a/README.md
[L2]: https://github.com/Ayagikei/LifeUp-Wiki/blob/82f157bffec2d638c92aecf3fe3e03a1743cc7bf/docs/en/guide/hello_lifeup.md
[L3]: https://github.com/Ayagikei/LifeUp-Wiki/blob/82f157bffec2d638c92aecf3fe3e03a1743cc7bf/docs/en/guide/backup.md
[L4]: https://github.com/Ayagikei/LifeUp-Wiki/blob/82f157bffec2d638c92aecf3fe3e03a1743cc7bf/docs/en/feature/193.md
[L5]: https://github.com/Ayagikei/LifeUp-Wiki/blob/82f157bffec2d638c92aecf3fe3e03a1743cc7bf/docs/en/introduction/development_plan_2026_2027.md
[H1]: https://github.com/HabitRPG/habitica/blob/12091ca02990533fdf38c2f0947397f0b4e39d59/README.md
[H2]: https://github.com/HabitRPG/habitica/blob/12091ca02990533fdf38c2f0947397f0b4e39d59/website/common/script/ops/scoreTask.js
[H3]: https://github.com/HabitRPG/habitica/blob/12091ca02990533fdf38c2f0947397f0b4e39d59/LICENSE
[F0]: https://finchcare.com/about-finch
[S1]: https://raw.githubusercontent.com/super-productivity/super-productivity/fcc77e7f472c5c442f2ebf0b42889494d08e5889/README.md
[S2]: https://github.com/super-productivity/super-productivity/releases/tag/v19.3.1
[S3]: https://raw.githubusercontent.com/super-productivity/super-productivity/master/LICENSE
[U1]: https://raw.githubusercontent.com/iSoron/uhabits/82c1ff287a8ac05321bfa95b61399fa8a2d1da5b/README.md
[U2]: https://github.com/iSoron/uhabits/releases/tag/v2.3.2
[E1]: https://raw.githubusercontent.com/exercism/python/6105f6d9d3ef66ce3d5c8f529d2882af3d76b706/README.md
[E2]: https://github.com/exercism/python/blob/6105f6d9d3ef66ce3d5c8f529d2882af3d76b706/config.json
[E3]: https://raw.githubusercontent.com/exercism/python/main/exercises/concept/guidos-gorgeous-lasagna/.docs/instructions.md
[E3h]: https://raw.githubusercontent.com/exercism/python/main/exercises/concept/guidos-gorgeous-lasagna/.docs/hints.md
[E3t]: https://raw.githubusercontent.com/exercism/python/main/exercises/concept/guidos-gorgeous-lasagna/lasagna_test.py
[E4]: https://raw.githubusercontent.com/exercism/python/main/exercises/practice/two-fer/.docs/instructions.md
[E4t]: https://raw.githubusercontent.com/exercism/python/main/exercises/practice/two-fer/two_fer_test.py
[E5]: https://raw.githubusercontent.com/exercism/python/main/LICENSE
[M1]: https://raw.githubusercontent.com/microsoft/c9-python-getting-started/a74d0ea8451a9709dcebbb29ae931a9cb82fc695/README.md
[M2]: https://raw.githubusercontent.com/microsoft/c9-python-getting-started/master/LICENSE
[A1]: https://raw.githubusercontent.com/ankitects/anki/31f1a034cd44908f74213202e01327fa1ac9176c/README.md
[A2]: https://raw.githubusercontent.com/ankitects/anki-manual/91f7485236db2a89d2a8abaed618976caf971de2/src/background.md
[A3]: https://raw.githubusercontent.com/ankitects/anki/main/LICENSE
[A4]: https://raw.githubusercontent.com/ankitects/anki-manual/main/README.md
[D1]: https://raw.githubusercontent.com/dexie/Dexie.js/45aade72aa19a601e6a13aa877beb7389e15b5d2/README.md
[D2]: https://github.com/dexie/Dexie.js/releases/tag/v4.4.7
[D3]: https://github.com/dexie/Dexie.js/issues/1050
[D4]: https://github.com/dexie/Dexie.js/pull/2329
[D5]: https://raw.githubusercontent.com/dexie/Dexie.js/master/LICENSE
[D6]: https://raw.githubusercontent.com/dexie/Dexie.js/master/package.json
[W1]: https://raw.githubusercontent.com/w3c/wcag/d1e063920a1574d7fb67823d9343e12bb6cf6829/understanding/20/contrast-minimum.html
[W2]: https://raw.githubusercontent.com/w3c/wcag/d1e063920a1574d7fb67823d9343e12bb6cf6829/understanding/20/focus-order.html
[W3]: https://raw.githubusercontent.com/w3c/wcag/d1e063920a1574d7fb67823d9343e12bb6cf6829/understanding/22/target-size-minimum.html
[T1]: https://raw.githubusercontent.com/mdn/content/5c76c9c822b4083750ff7fcabcd07422ad3a591b/files/en-us/web/api/indexeddb_api/index.md
[T2]: https://raw.githubusercontent.com/mdn/content/5c76c9c822b4083750ff7fcabcd07422ad3a591b/files/en-us/web/api/service_worker_api/index.md
[T3]: https://raw.githubusercontent.com/mdn/content/5c76c9c822b4083750ff7fcabcd07422ad3a591b/files/en-us/web/api/crypto/randomuuid/index.md
