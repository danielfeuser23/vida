# Auditoria do Entre Trilhas — 05/11/2026

> Ciclo seguinte 1.4.0: avatar, refúgio e loja, com cosméticos por marcos e preferências opcionais, sem novas despesas de moedas. Estado e evidências em [ENTREGA_AVATAR_REFUGIO_LOJA.md](ENTREGA_AVATAR_REFUGIO_LOJA.md). As análises históricas abaixo permanecem como registro de suas respectivas versões.

> Ciclo de conteúdo 1.3.0: aprofundamento das fases Python 1–7, sem alteração do formato de progresso ou da economia. Evidências e estado de validação em [ENTREGA_PYTHON_1_7.md](ENTREGA_PYTHON_1_7.md). Os resultados históricos abaixo não são apresentados como uma nova auditoria integral.

> Atualização de 09/11/2026: R0a/R0b/R0c e [sessões de Python independentes](ENTREGA_SESSOES_PYTHON.md) foram entregues; a versão 1.1.0 foi publicada no GitHub. [Hoje e agenda unificada](ENTREGA_HOJE_AGENDA.md), versão 1.2.0, foi implementada, validada e publicada; distribuição e referências estão no relatório. O diagnóstico histórico abaixo foi preservado; não representa a lista atual de pendências.

Revisão histórica da versão 1.0.0 em `/workspace/vida`. O objetivo foi testar a base existente, reproduzir problemas e definir uma evolução verificável. A lógica não foi alterada naquela auditoria; as correções posteriores estão registradas nas entregas. O arquivo único foi regenerado pelo build.

## Status após R0a, R0b e R0c

R0a corrigiu B01/B04 e o falso sucesso de gravação B09. R0b corrigiu B08 (IDs e tratamento de falhas), com [matriz de abertura](ENTREGA_R0B.md): localhost/loopback real, HTTP e HTTPS simulados; file:// permanece sem homologação funcional. A validação não equivale a teste em aparelho físico ou certificado externo.

R0c corrigiu B02/B03/B06/B07/B10/B11 nos cenários documentados: preferência de sábado/domingo no editor e em Hoje, XP líquido por data de lançamento, foco estável, contraste medido, habilidades compatíveis e diálogos nomeados. Na entrega R0c, a agenda fixa ainda era separada das missões; a unificação foi concluída em 1.2.0. Teclado, 320–430 CSS px e zoom nativo de 200% foram testados no Chromium; leitores de tela e outros navegadores ainda precisam de verificação. Isso não é certificação completa de acessibilidade.

**B05 foi corrigido, validado e publicado em 1.1.0:** sessões podem somar duas horas sem concluir fase, projetos continuam entre dias e revisão/projeto livre ficam disponíveis após a fase 120. Testes e pacote foram conferidos nos ambientes delimitados no relatório de sessões. A publicação foi confirmada em `main` no commit [51fecc7e87b906f366791833272fd7c212bd7bbb](https://github.com/danielfeuser23/vida/commit/51fecc7e87b906f366791833272fd7c212bd7bbb), sem deploy.

**Hoje/agenda 1.2.0 entregue e publicada:** o código passa a calcular uma agenda comum e a contextualizar a próxima ação. A validação própria desta segunda entrega confirmou 197 testes Node e os fluxos de navegador delimitados no relatório de Hoje/agenda. Os pacotes foram conferidos após extração e o envio ao GitHub foi confirmado.

Na revisão do novo modelo, também foram reproduzidos e corrigidos: sessão anterior à criação do projeto e colisão de ID entre projeto novo e projeto histórico em um backup. As respectivas regressões falharam antes das correções. A conferência de teclado/zoom nos formulários novos também integra a validação atual. O conteúdo abaixo preserva o diagnóstico histórico da versão 1.0.0; números de linha e resultados antigos descrevem aquela versão.

## Resultado executivo

O fluxo principal funciona nos cenários cobertos: os 35 testes existentes passaram, sem casos ignorados, e o teste real de navegador passou. Isso não significa ausência de bugs: cenários exploratórios revelaram problemas de validação de backup, feedback, horários, acessibilidade e continuidade do estudo. A prioridade é tornar a base confiável antes de acrescentar mecânicas ou sincronização.

O risco mais relevante encontrado depende de importar um backup malformado: um campo de registros como array é aceito e permite salvar um estado que depois não reabre. Não foi demonstrada perda de dados em um backup normal exportado pelo aplicativo; o roundtrip normal passou no teste de navegador.

## O que foi executado

| Verificação | Resultado e limite |
|---|---|
| `npm run check` | Passou; valida sintaxe de app, engine, data e roadmap. |
| `npm test` | 35 testes passaram, 0 falhas e 0 ignorados. |
| `npm run build` | Passou; gerou o HTML único. Não publica o aplicativo. |
| `python3 tests/browser_smoke.py` | Passou no Chromium: mínima→normal, reabertura, compra, cancelamento, Python, correção, download/restauração de backup, rejeição de backup inválido, virada de data São Paulo e seis telas a 390 px. Sem erros JavaScript nesse percurso. |
| `node auditoria/reproduzir.mjs --save` | Reproduziu quatro falhas de domínio. Saída em `reproducoes.json`; o script é diagnóstico, não uma suíte que confirma comportamento correto. |
| Exemplos de Python | Os dez exemplos de código existentes passaram em compilação sintática Python. Isso não executa exemplos, verifica saídas ou comprova correção pedagógica dos 600 desafios. |
| Histórico sintético | Estados de 30, 365 e 1.095 dias, com missões diárias e um vídeo por dia, foram gerados e validados. Medições abaixo. |
| Inspeção visual e de código | Fluxo principal, navegação, cronômetro, formulários, contraste e persistência. Não é certificação de acessibilidade. |

Não foram executados testes em Safari, Firefox, iPhone/Android físicos ou rede móvel. Não foram feitas publicação, sincronização entre aparelhos ou auditoria de um backend, pois esses recursos não existem nesta versão. As referências externas continuam com a limitação de acesso já registrada no PLANO.

## Bugs reproduzidos

Prioridades: **P1** = risco de dados/uso que deve anteceder expansão; **P2** = comportamento ou acessibilidade incorretos; **P3** = custo e refinamentos. Ordem de prioridade não equivale a prazo.

### B01 · P1 · Backup aceita arrays e pode impedir reabertura

- Código: `engine.js:74–82`.
- Reprodução: criar estado, definir `records=[]`, validar, concluir leitura, validar e fazer `JSON.parse(JSON.stringify(estado))`. O backup inicial e o estado antes da serialização são aceitos. O estado serializado é recusado na reabertura, pois propriedades nomeadas de arrays não são gravadas no JSON.
- `overrides=[]` e `difficult=[]` também são aceitos e podem perder alterações na serialização.
- Esperado: rejeitar mapas que não sejam objetos simples antes de substituir dados locais. Uma gravação aceita deve continuar válida após serializar e recarregar.
- Correção proposta: esquema de versão explícito, mapas tipados, validação de invariantes e roundtrip; manter uma cópia de recuperação antes da restauração.
- Aceite: esses backups são rejeitados sem alterar dados existentes; backups normais exportados continuam sendo restaurados; falhas de quota não são anunciadas como sucesso.

### B02 · P2 · Horário salvo é ignorado no fim de semana

- Código: `engine.js:12`.
- Reprodução: editar o horário permanente de exercício para 10:30; consultar um sábado. O horário efetivo continua 09:00. O mesmo ocorre com casa no domingo. Reagendamento pontual funciona; preferência permanente não.
- Esperado: a preferência salva deve prevalecer ou o editor deve representar explicitamente horários diferentes para trabalho e folga.
- Aceite: alterar horários em Ajustes reflete em Hoje e na agenda em todos os dias pertinentes, sem regras ocultas por ID.

### B03 · P2 · XP do dia ignora correções

- Código: `app.js:20`, cálculo `earned` com filtro de XP positivo.
- Reprodução no navegador: concluir leitura normal (+10 XP) e desfazer. XP geral volta a zero; o cartão do dia continua em +10 XP. Repetir o ciclo infla o cartão, sem inflar o saldo geral.
- Esperado: apresentar XP líquido ou distinguir ganhos brutos de correções com rótulos claros.
- Aceite: concluir e desfazer no mesmo dia mostra zero líquido; corrigir registros antigos não produz gráfico enganoso.

### B04 · P2 · Backup aceita ganho sem missão nem habilidade

- Código: `engine.js:75–79`.
- Reprodução: inserir evento `mission` com 50 XP e 20 moedas, sem `key`, `skills` ou registro correspondente. `validateState` aceita; personagem tem 50 XP, mas todas as habilidades permanecem zeradas.
- Esperado: validação por tipo de evento e relação consistente entre eventos, registros e habilidades. O problema não é impedir que o usuário edite seus próprios pontos; é não aceitar silenciosamente um estado que viola as regras internas.
- Aceite: eventos órfãos, referências ausentes e diferenças de totais são rejeitados ou migrados explicitamente, com diagnóstico legível.

### B05 · P2 · Concluir a trilha bloqueia estudo normal

- Código: `engine.js:25` e `app.js:30–41`.
- Reprodução: concluir as 120 fases em datas consecutivas e tentar registrar Python no dia 121. O motor recusa e recomenda criar uma missão de revisão; a interface só permite editar missões existentes.
- Esperado: revisão, projeto livre e novas sessões continuam registráveis depois da trilha. Também deve ser possível estudar por duas horas sem concluir uma fase que exige vários dias.
- Aceite: sessão e fase têm registros separados; fechar uma fase não impede outras práticas; terminar o mapa não desativa a habilidade.

### B06 · P2 · Atualizações removem foco do teclado

- Código: `app.js:14,18,38,69`.
- Reprodução no Chromium: concluir uma missão pelo botão focado; após renderizar a página inteira, o foco vai ao `body`. No cronômetro, focar Pausar e aguardar um segundo também perde o foco, porque o controle é removido e recriado a cada atualização.
- Esperado: foco estável; o cronômetro atualiza somente o texto do tempo e o estado do botão.
- Aceite: concluir, pausar, retomar, navegar e fechar diálogos funcionam somente com teclado, sem perda ou salto inesperado de foco.

### B07 · P2 · Texto auxiliar com contraste insuficiente

- Código: `style.css`, `--muted:#788278` e fundos `#fffefa`/`#f4f3ed`.
- Contraste calculado pela luminância relativa WCAG: **3,95:1** no fundo do cartão e **3,59:1** no fundo da página. Esses textos pequenos precisam de pelo menos 4,5:1 para atender ao critério AA de texto normal.
- Há ainda botões compactos, como o círculo de conclusão de 27×27 px. Recomenda-se área de toque de aproximadamente 44×44 px, mesmo preservando o desenho menor.
- Aceite: paleta medida, foco visível e legibilidade em 200% de zoom; auditoria automatizada complementada por teclado e leitor de tela.

### B08 · P1 · Fluxo no celular por HTTP de rede local falha

- Código: `engine.js:13,57` e `app.js:33`, uso direto de `crypto.randomUUID`.
- Reprodução: servir os próprios arquivos locais em uma origem HTTP não confiável, simulada por interceptação no Playwright. `isSecureContext=false`, `crypto.randomUUID` é `undefined`; concluir leitura mínima exibe erro e não grava. Abrir reserva também pode lançar erro JavaScript.
- Impacto: o caminho de uso por HTTP na rede local indicado no README não funciona nesses navegadores, embora localhost passe. Não foi necessário acessar um domínio externo para reproduzir.
- Aceite: todos os caminhos documentados de abertura funcionam; se HTTPS for requisito, isso deve ser comunicado e fornecido. Se suportar HTTP, usar geração de IDs compatível e testar unicidade/idempotência nesse contexto.

### B09 · P2 · Preferências anuncia gravação que falhou

- Código: `app.js:62`.
- Reprodução no Chromium: simular `QuotaExceededError` em `Storage.prototype.setItem` num contexto de teste e salvar o nome. `transact` retorna falso, mas o handler substitui o erro por “Preferências salvas.”; o dado não foi gravado.
- Aceite: sucesso apenas após persistência confirmada; em erro, mensagem clara com opção de exportar/recuperar e formulário preservado.

### B10 · P2 · Editor oferece habilidade incompatível

- Código: `app.js:31,63` e `engine.js:72`.
- Reprodução: editar “Caminho com companhia”, escolher “Atividade física” como habilidade principal e salvar. Como a secundária já é atividade física, a validação recusa com a mensagem genérica de backup inválido. O editor não mostra a secundária nem explica a incompatibilidade.
- Aceite: seleção compatível, edição explícita das duas habilidades ou distribuição automática sem duplicação; erro de campo compreensível antes de salvar.

### B11 · P3 · Diálogos sem nome acessível

- Código: `index.html:2` e `app.js:28`.
- O diálogo tem título visual, mas falta a associação via `aria-labelledby` ou um `aria-label`. A inspeção de acessibilidade mostra o elemento `dialog` sem nome.
- Aceite: leitor de tela anuncia título e contexto ao abrir, com foco inicial e retorno apropriados.

## Desempenho e crescimento dos dados

Medições locais de uma validação em Node.js 24, em uma única execução por tamanho; são indicadores exploratórios, não percentis ou promessa de desempenho em celular.

| Dias simulados | Eventos | Compras | JSON UTF-8 | Validação |
|---:|---:|---:|---:|---:|
| 30 | 231 | 30 | 94.796 bytes | 3,47 ms |
| 365 | 2.815 | 365 | 1.097.521 bytes | 35,17 ms |
| 1.095 | 8.447 | 1.095 | 3.283.261 bytes | 203,79 ms |

O custo cresce porque `engine.js:78` percorre todos os eventos para cada compra. Cada gravação valida antes e depois da alteração, lê e serializa todo o estado, grava `localStorage` sincronamente e renderiza a tela inteira. No histórico, todos os itens são montados de uma vez. O tamanho UTF-8 acima não equivale à quota ou ao tamanho UTF-16 de armazenamento do navegador.

Recomendação: primeiro indexar eventos em uma passagem e paginar o histórico; medir novamente. Migrar registros para IndexedDB com esquema/versionamento e recuperação quando os requisitos de histórico justificarem, mantendo exportação portátil. Definir estados claros para falta de espaço e evitar mensagens de sucesso após falha.

### Renderização no navegador

Medições exploratórias de renderização síncrona no Chromium, com os mesmos históricos legítimos; não incluem toda a interação, layout/pintura ou experiência em hardware real de celular.

| Dias | Hoje | Histórico | Personagem |
|---:|---:|---:|---:|
| 30 | 3,5 ms | 28 ms | 11 ms |
| 365 | 4 ms | 578 ms | 114 ms |
| 1.095 | 5,5 ms | 937 ms | 271 ms |

São amostras locais, sem repetição estatística. Há trabalho síncrono alto em Histórico e Personagem; paginação e agregações podem melhorar isso antes de trocar de framework.

## Reproduzir a revisão

Com o servidor ativo e Playwright/Chromium disponíveis:

```sh
node auditoria/reproduzir.mjs
python3 auditoria/reproduzir_http.py
python3 auditoria/reproduzir_ui.py
node auditoria/benchmark.mjs
python3 auditoria/benchmark_browser.py
```

Os scripts Python abrem navegadores de teste separados. Os dados sintéticos de benchmark são gravados em `/tmp/vida-audit-*.json`. `reproduzir_ui.py` simula uma falha de gravação apenas no contexto de teste, sem modificar as fontes ou o progresso do usuário. Os scripts registram o comportamento observado; os bugs ainda precisam de regressões com o resultado correto esperado na implementação futura.

## Melhorias de produto, sem confundir com bugs

- **Python:** os 120 marcos e 600 desafios existem, mas apenas dez fases têm exemplo de código. Faltam registro por exercício, dicas graduais, soluções comentadas, revisão espaçada, anotações e sessões independentes da fase.
- **Rotina:** a grade fixa exibida não acompanha automaticamente a edição das missões; os avisos atuais explicam essa limitação. Uma única fonte de agenda deve representar blocos separados, pausas e conflitos.
- **Uso diário:** manter a próxima ação mais visível no celular, reduzir a altura dos cartões e recolher concluídas, sem esconder cuidados essenciais. Diferenciar pendência passada de ação que cabe agora.
- **Loja:** indicar antes do clique quando não há saldo ou janela disponível; mostrar a diferença para a meta maior. Consumo de recompensa precisa de correção ou confirmação adequada.
- **Visual RPG:** avatar próprio e personalização do refúgio ligados às conquistas, com animações discretas e opção de movimento reduzido. Manter a economia cosmética separada de alimentação, descanso e lazer básico.
- **Qualidade:** código está muito concentrado em linhas extensas e funções de template. Separar domínio, armazenamento, telas e componentes, preservando os testes e o formato de backup.
- **Distribuição:** build do HTML e pacote ZIP devem fazer parte do mesmo processo de release; hoje regenerar o HTML não atualiza o ZIP automaticamente.

O roadmap e os critérios de entrega estão em `ROADMAP.md`. O prompt reutilizável está em `PROMPT_REVISAO.md`.
