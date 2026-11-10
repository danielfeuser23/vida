# Entre Trilhas

Um RPG de rotina em português, responsivo e sem dependências de instalação. Feito com HTML, CSS e JavaScript; Python é a trilha de aprendizado, não um requisito para usar o app. Node.js 22 ou superior permite executar servidor, gerar o arquivo único e rodar os testes.

A versão **1.1.0**, com sessões de Python independentes, foi [publicada no GitHub](https://github.com/danielfeuser23/vida/commit/51fecc7e87b906f366791833272fd7c212bd7bbb). A versão **1.2.0 — Hoje e agenda unificada** foi implementada, validada e [publicada no GitHub](https://github.com/danielfeuser23/vida/commit/1d2aa88f288a8b979a40d61e1f0b486a040d695d). Veja testes, pacotes e limites no [relatório da entrega](auditoria/ENTREGA_HOJE_AGENDA.md). Não houve deploy do aplicativo.

A entrega **1.3.0 — Primeiras sete fases de Python** aprofunda o começo da trilha para iniciantes. Estado de validação, fontes e limites em [ENTREGA_PYTHON_1_7.md](auditoria/ENTREGA_PYTHON_1_7.md).

## Abrir e usar

Na pasta do projeto:

```sh
npm start
```

O caminho verificado é `http://localhost:5173` ou `http://127.0.0.1:5173` no navegador **do computador que executou o comando**. No ambiente na nuvem, a porta 5173 é de desenvolvimento; não há publicação pública automática. No celular, localhost aponta para o próprio celular, não para esse computador. Os cenários de rede local e HTTPS foram simulados, como detalhado na matriz abaixo; não houve homologação em aparelho físico ou hospedagem externa. Nunca compartilhe seu backup se ele contiver registros pessoais que deseja manter privados.

Não precisa executar `npm install`: não há dependências externas. Uma alternativa também verificada usa Python: execute `python3 -m http.server 5174 --bind 127.0.0.1` nesta pasta e abra `http://127.0.0.1:5174`. Esse comando atende somente no próprio computador.

Há também `ENTRE-TRILHAS.html`, com toda a interface, estilo e trilha em um único arquivo. Com um dos servidores acima iniciado, abra `/ENTRE-TRILHAS.html` no mesmo endereço. Esse uso servido foi verificado. A abertura direta `file://` foi tentada novamente e bloqueada pelo Chromium gerenciado (`ERR_BLOCKED_BY_ADMINISTRATOR`); não é um caminho funcional homologado neste ambiente. Use a versão servida e mantenha o mesmo endereço para reencontrar seu progresso.

1. Em **Hoje**, conclua uma missão ou escolha a versão mínima. Em **Dia difícil**, as mínimas ficam em destaque, preservando os cuidados do cachorro.
2. Para Python, use **Registrar sessão** em Hoje ou na Trilha: informe os minutos de prática, o objetivo e os exercícios realmente resolvidos, sem contar pausas. Registre várias sessões se preferir. Na **Trilha Python**, marque a fase separadamente após conferir seu critério; isso não gera outro pagamento. Crie um projeto para reunir sessões de vários dias e marque sua conclusão quando terminar. Depois da fase 120, revisões e projetos livres continuam disponíveis.
3. Em **Loja**, reserve um horário que caiba na janela. A compra desconta moedas uma vez; se não utilizar, cancele para estornar. Marque como utilizada quando consumir.
4. **Histórico** mostra ganhos, compras, estornos e correções. **Personagem** acompanha XP, habilidades e conquistas.
5. Em **Ajustes**, edite missões, frequência, horários de segunda–sexta e sábado/domingo, habilidades, pontos, preços e duração/limites das recompensas. Exporte um backup regularmente.

## Sua proposta de rotina

O [PLANO.md](PLANO.md) contém as tabelas completas para trabalho e folga, missões, economia, referências e quatro semanas de Python. As agendas também aparecem no botão **Ver agenda**.

Python diário: **18:00–19:00 e 19:10–20:10**, com dez minutos de pausa fora das duas horas. Duas horas já são uma carga relevante: a primeira semana usa versões mínimas nos demais objetivos opcionais. Revise após sete dias, sem aumento automático.

Os horários alimentares e as porções do cachorro não foram confirmados. Os blocos de cuidados são propostas para conferir alimentação habitual, água, higiene e interação, compartilhadas com sua esposa e sua mãe. Passeios de folga devem ser ajustados às necessidades dele.

## Dados, segurança de saldo e limites

- Dados em `localStorage`, chave `entre-trilhas-v1`. Não há conta, servidor de dados, sincronização, rastreamento ou transmissão de progresso.
- Cada navegador, perfil, aparelho, endereço e protocolo pode manter uma cópia diferente. Trocar de origem ou limpar dados pode fazer o progresso desaparecer daquela cópia. Exporte antes.
- Backups JSON versões 1 e 2 são validados antes de substituir o progresso. Novos progressos usam a versão 2. Um backup v1 continua abrindo sem regravação até você ativar as sessões independentes; a migração mostra prévia e preserva uma cópia anterior. A restauração também recusa uma prévia desatualizada por outra aba. Não use dados de procedência desconhecida. Backup não é criptografado.
- Data e renovação usam `America/Sao_Paulo`, incluindo uma página deixada aberta durante a virada do dia. O relógio do aparelho precisa estar correto.
- Recompensas são limitadas pelo saldo, período e faixas para extras: **21:30–21:50** todos os dias; também **14:00–16:00** nas folgas. Esses limites protegem alimentação, lazer básico e sono. No modelo de agenda de 1.2.0, a janela realmente livre exclui os blocos ocupados pelas missões, transições e outras reservas; moedas não criam tempo extra.
- XP e moedas são separados. Missões comuns têm uma conclusão por ocorrência, com upgrade mínima→normal apenas pela diferença. Em Python, as sessões somam os minutos do dia e pagam apenas a diferença até o limite diário; fase e projeto não geram outro ganho. Duas habilidades repartem o XP.
- **XP líquido do dia** soma ganhos e correções lançados naquela data. Exemplo: leitura +10 ontem e correção −10 hoje mantêm ontem em +10, mostram hoje em −10 e deixam o total geral em zero. O Histórico identifica a data da atividade corrigida; o gráfico mostra débitos abaixo de zero. Corrigir uma marcação não é punição por faltar.
- Abas no mesmo navegador usam Web Locks quando disponível para serializar gravações; cada ação persiste uma transação completa. Navegadores atuais são recomendados. Sem Web Locks, use apenas uma aba para evitar gravações concorrentes.
- Desfazer mantém a correção no histórico. Se as moedas já foram gastas, cancele compras não usadas ou obtenha saldo suficiente antes de desfazer; o sistema nunca cria saldo negativo. Uma fase com dependentes exige desfazer primeiro a fase mais recente.
- Pausa e reagendamento não criam dívida. Cuidados essenciais não são adiados: ajuste horários e combine ajuda real.
- Cronômetro opcional usa tempo decorrido, não conclui missões automaticamente e não persiste após fechar/recarregar. Sons discretos são opcionais e desligados por padrão.
- Não há execução/correção automática de Python, bloqueio de apps, lembretes push, pagamentos reais, edição de toda a grade fixa ou compartilhamento familiar nesta versão.
- O mapa mantém os 120 identificadores. As fases 1–7 oferecem **70 exercícios guiados** (28 básicos e 42 extras opcionais), sete exemplos completos, dicas progressivas e soluções comentadas. Nas fases 8–120 permanecem 565 sugestões do catálogo anterior, ainda sem o mesmo aprofundamento. Os 600 itens legados de `roadmap.js` continuam preservados para compatibilidade; seus primeiros 35 itens são substituídos na leitura pelo conteúdo novo, sem recontar exercícios históricos. Não é certificação ou promessa de domínio em 120 dias. Projetos e fases podem levar várias sessões.
- Os sites de LifeUp, Habitica e Finch foram bloqueados na pesquisa inicial (403). A pesquisa posterior consultou repositórios oficiais de LifeUp e Habitica; Finch permanece sem verificação. Veja fontes, datas e limites em [PESQUISA_REFERENCIAS.md](auditoria/PESQUISA_REFERENCIAS.md).

## Desenvolvimento e validação

```sh
npm run check
npm test
npm run test:content
npm run build
```

O build regenera `ENTRE-TRILHAS.html` a partir dos arquivos fonte. Não edite o arquivo gerado diretamente. A suíte inclui os testes anteriores e regressões de integridade, recuperação e sessões de Python. O validador aceita v1 e v2; a ativação explícita converte o progresso v1 para v2 com recuperação. Há teste real de navegador em `tests/browser_smoke.py`, usando Playwright/Chromium já disponíveis neste ambiente:

```sh
# Deixe npm start rodando em outro terminal:
python3 tests/browser_smoke.py
```

O teste abre um contexto separado, sem alterar seu progresso, e verifica mínimo→normal, persistência ao reabrir, compra, estorno, Python, correção, exportação/restauração de backup, rejeição de backup inválido, mudança de dia e seis telas em largura de celular. Os testes de navegador são ferramenta de desenvolvimento; não são necessários para usar o aplicativo.

`npm run test:content` exige Python 3.10+ somente no ambiente de desenvolvimento: executa exemplos e soluções autorais em processos locais temporários e confere saídas e entradas de borda. Não instala executor no app ou servidor. Para a leitura guiada, use também `python3 tests/browser_content.py` com o servidor iniciado.

## Como estudar nas primeiras sete fases

Em **Trilha Python**, abra a fase atual. Comece por **Antes de começar** e, na fase 1, **Preparar o ambiente**: há um caminho pelo editor IDLE sem exigir conhecimento de terminal. Execute o exemplo no Python do computador, tente os exercícios básicos e abra uma dica por vez se precisar. Soluções ficam recolhidas; comparar sua tentativa é parte da prática. Os extras são opcionais e não bloqueiam a fase.

Preparar o ambiente não conta como exercício de programação resolvido. Registre os minutos efetivamente dedicados ao estudo e somente os exercícios realmente resolvidos e ainda não contados. Ler, consultar dicas/soluções e concluir o marco não acrescentam XP, moedas ou exercícios automaticamente. A contagem continua sendo autorregistro por sessão, sem detectar um mesmo enunciado informado novamente em outra sessão.

Proposta editável para cada encontro: primeiro bloco de 60 min com revisão, explicação, exemplo e início da prática; dez minutos de pausa; segundo bloco de 60 min para continuar os básicos, escolher extras e registrar dúvidas. Esse roteiro pode ocupar vários dias. A mínima de cinco minutos continua disponível para retomar; não há obrigação de terminar uma fase por dia nem de fazer todos os extras.

## R0a: restauração recuperável

Em Ajustes, **Restaurar backup** mostra uma prévia. Antes da substituição, o estado atual é preservado em uma cópia anterior. **Recuperar cópia anterior** troca as cópias após confirmação; **Exportar cópia anterior** permite guardá-la fora do navegador. Uma nova restauração bem-sucedida substitui o slot anterior, como indicado na confirmação.

Se não houver espaço para preservar as cópias, a restauração será cancelada. Um checkpoint protege a troca contra falhas e interrupção. Uma restauração idêntica não altera o progresso nem a recuperação existente.

Se os dados forem danificados em outra aba ou a leitura do armazenamento falhar, **Exportar backup** usa a cópia válida que ainda estiver na memória desta aba. Guarde-a antes de recarregar. **Exportar arquivo original** guarda os bytes danificados separadamente para análise. Se a página já abrir com arquivo ilegível, não haverá uma cópia válida anterior em memória; o original será preservado para exportação e você poderá restaurar um backup válido.

A cópia recuperável também é local: limpar os dados do navegador pode apagar tudo. Continue exportando arquivos externos. Dados inconsistentes não são reparados inventando pontos ou descartando histórico.

Validação adicional no navegador, com fonte e HTML único e sem usar seu perfil:

```sh
python3 tests/browser_integrity.py
```

Veja [a entrega e os limites de R0a](auditoria/ENTREGA_R0A.md). R0b corrigiu a geração de IDs em HTTP; a matriz abaixo delimita a verificação realizada. [R0c](auditoria/ENTREGA_R0C.md) corrige horários, XP visual, foco, contraste e editor.

Resultado verificado da entrega R0a (05/11/2026): 71 testes Node e 14 testes de navegador em 36 contextos isolados, cobrindo fonte e HTML único, todos aprovados.

## R0b: compatibilidade de abertura e IDs

Desde a aplicação 1.0.2, os IDs são UUID v4: API nativa quando disponível ou getRandomValues para aleatoriedade criptográfica quando randomUUID não existe. Não usa horário ou Math.random. Se o navegador não oferecer a API necessária, a ação mostra erro e não grava uma fase, compra ou correção parcial. R0b manteve o backup v1; a entrega de sessões acrescenta o formato v2 com leitura de ambos.

| Caminho | Conferência realizada | Limite |
|---|---|---|
| Node: localhost/127.0.0.1:5173 | HTTP real, missão, compra e reabertura na fonte e no HTML único | Chromium neste ambiente; não é telefone físico. |
| Python: 127.0.0.1:5174 | Servidor real e os mesmos fluxos de missão/compra nos dois formatos | Somente loopback. |
| HTTP em endereço de rede local | Origem não confiável simulada no navegador, com arquivos locais interceptados; fallback de IDs e fluxos aprovados | Não testou IP/rede física, roteador ou celular. Sem Web Locks, use uma aba por vez. |
| HTTPS | Origem segura simulada; API nativa, fallback e duas abas com Web Locks aprovados | Sem teste de certificado, handshake TLS ou hospedagem externa. |
| file:// | Tentativa bloqueada por política administrativa | Sem validação funcional; não recomendado como caminho homologado aqui. |

A simulação HTTP permanece um contexto não seguro: a correção usa getRandomValues, que o Chromium disponibiliza ali. Web Locks depende de contexto seguro; o suporte a operações simultâneas entre abas continua exigindo essa API. HTTPS será o caminho apropriado para uma implantação com APIs de contexto seguro, mas uma implantação/certificado real ainda precisa ser validado; nada foi publicado nesta entrega. Safari, Firefox e aparelhos físicos também não foram testados.

Protocolo, hostname e porta fazem parte da origem dos dados. Mudar entre localhost, IP, HTTP e HTTPS pode mostrar outro progresso local. Exporte antes da troca e restaure no destino; isso não é sincronização.

Com o servidor Node ativo, execute também:

```sh
python3 tests/browser_opening.py
```

Resultado R0b: 88 testes Node, smoke existente, 14 testes de integridade e 7 testes de abertura aprovados. A suíte de abertura cobre 32 contextos isolados em fonte e HTML único. Consulte [ENTREGA_R0B.md](auditoria/ENTREGA_R0B.md) para matriz, reproduções, comandos e limitações.

## R0c: comportamento e acessibilidade

A entrega R0c, na aplicação **1.0.3**, corrigiu o foco ao concluir missões e o retorno ao controle de origem ao fechar diálogos, inclusive por Escape. Navegar entre telas posiciona o foco no título. O cronômetro atualiza o tempo sem recriar os botões a cada segundo. Diálogos têm título acessível, o contraste foi ajustado e os controles principais têm área de pelo menos 44×44 CSS px nos cenários medidos.

O editor apresenta habilidades principal e secundária, impede escolhas iguais e explica erros nos campos. O cartão mostra a habilidade secundária escolhida; o XP é repartido, sem segundo pagamento. Dia difícil e cuidados essenciais foram preservados.

Os horários **seg–sex** e **sáb/dom** ficam explícitos. Backups antigos sem preferência de fim de semana preservam a proposta de 09:00 para exercício/casa quando ainda usam o horário original; horários antigos personalizados passam a valer também nas folgas. O reagendamento pontual continua prevalecendo. Na entrega R0c, a tabela de **Ver agenda** ainda era fixa; a unificação com as preferências é o escopo da implementação 1.2.0 descrita abaixo.

Backups válidos anteriores continuam aceitos e não são convertidos nem regravados ao abrir. A preferência opcional `weekendTime` é gravada ao editar uma missão, mantendo a versão 1. **Use a aplicação atual para restaurar backups com esse campo**; versões anteriores não reconhecem essa extensão. Recuperação anterior, erros de armazenamento e IDs criptográficos continuam protegidos pelos testes.

Com o servidor iniciado e Playwright/Chromium disponíveis:

```sh
python3 tests/browser_accessibility.py
python3 tests/browser_zoom.py
```

A primeira suíte verifica comportamento, teclado, contraste, alvos e larguras de 320, 360, 390 e 430 CSS px, além de ampliação emulada. A segunda altera o zoom **nativo de 200%** em perfis Chromium temporários, sem emular o viewport: janelas de 640/1.280 px resultam em 320/640 CSS px. Ambas verificam fonte e HTML único. Não usam seu perfil ou progresso.

Resultado R0c: **108 testes Node**, **15 testes/42 contextos** de comportamento/acessibilidade e **2 testes/4 perfis** de zoom nativo aprovados, além das suítes anteriores. Essas evidências não comprovam conformidade WCAG completa: não houve teste com leitor de tela, aparelho físico, Safari ou Firefox. Consulte [ENTREGA_R0C.md](auditoria/ENTREGA_R0C.md) para limites e critérios de aceite.

## Sessões de Python independentes

As sessões de estudo estão separadas dos marcos da trilha. O registro é por autorrelato: o app não mede seu editor, executa Python ou comprova o tempo.

- **Sessão:** minutos, objetivo, exercícios e vínculo opcional com fase ou projeto. Os minutos reais das sessões ativas se somam no dia; a pausa não entra.
- **Fase:** marca o critério conferido, no máximo uma nova fase por dia e após a anterior. Pode ser concluída em outro dia, sem exigir uma nova sessão de 120 minutos e sem repetir exercícios ou pontos.
- **Projeto:** reúne prática por vários dias e tem conclusão/reabertura próprias. Criar, concluir ou reabrir não paga XP ou moedas.

A meta padrão continua **120 minutos**, com mínima de **5 minutos**. O orçamento é congelado no primeiro registro do dia a partir dos valores salvos em Ajustes; edições afetam o próximo dia de estudo. Com os padrões: 5 min → 5 XP/2 moedas; 60 min → 60 XP/18 moedas; 120 min → 120 XP/36 moedas. Registrar 5 + 115 min chega ao mesmo total de 120 min. Prática extra mantém seus minutos e exercícios, sem ultrapassar o teto de pontos daquele dia.

Em **Trilha Python**, veja e corrija sessões, crie projetos, associe novas sessões a eles e conclua a fase pelo seu critério. Corrigir uma sessão recalcula os minutos, exercícios e pontos sem apagar a fase ou o projeto. Corrigir uma fase mantém a prática; comece pela fase mais recente se houver dependentes. Reabrir um projeto mantém suas sessões. Correções continuam possíveis durante a pausa, mas novos estudos/marcos exigem retomar a jornada.

Se você abrir dados antigos, escolha **Ativar sessões independentes**, confira a prévia e use **Ativar e preservar cópia anterior**. Os registros, eventos, fases e saldos existentes são preservados, com cópia recuperável em Ajustes. Não se inventam minutos ou sessões para registros v1. Pontos antigos do mesmo dia contam no teto: uma normal v1 já paga não rende outro pagamento por uma nova sessão nesse dia; uma mínima já paga só permite o complemento.

Novos backups são **v2** e precisam da aplicação atual. A chave local continua `entre-trilhas-v1` para reencontrar o progresso existente. Abrir/restaurar um v1 não o migra automaticamente. Há um único slot de cópia anterior; a ativação substitui esse slot após o aviso. Se faltar espaço ou a prévia mudar em outra aba, a troca é recusada.

Os exercícios são contagens declaradas em cada sessão; não há checklist por exercício nem identificação automática de exercícios repetidos entre sessões. Conte apenas os resolvidos e ainda não registrados. Contagens antigas são preservadas a partir dos registros históricos ativos; marcar uma fase nova não as soma novamente.

Veja [ENTREGA_SESSOES_PYTHON.md](auditoria/ENTREGA_SESSOES_PYTHON.md) para a fórmula, compatibilidade, regressões e estado da validação. Com o servidor iniciado, a suíte específica usa:

```sh
python3 tests/browser_sessions.py
```

A validação de 1.1.0 passou: **155 testes Node**, smoke e suítes de integridade, abertura, sessões, acessibilidade e zoom nativo. Os pacotes foram conferidos também após extração. A publicação foi confirmada no commit [51fecc7e87b906f366791833272fd7c212bd7bbb](https://github.com/danielfeuser23/vida/commit/51fecc7e87b906f366791833272fd7c212bd7bbb). Depois disso, foi iniciada a entrega separada **Hoje e agenda unificada**.

## Hoje e agenda unificada

A versão 1.2.0 usa um modelo único para Hoje, **Ver agenda** e disponibilidade da Loja. Passaram 197 testes Node, 17 cenários de agenda nos dois formatos e as suítes anteriores, incluindo teclado, backup e zoom nativo. Os limites de evidência estão no relatório da entrega.

- **Hoje:** próxima ação com contexto de horário, distinção entre bloco atual e missão futura, opcionais concluídas recolhíveis e cuidados essenciais sempre visíveis. O painel muda textos por minuto sem recriar seus controles. Trabalho, trajeto, refeições, pausas e descanso não viram sugestões de estudo.
- **Agenda:** consulte uma data pelos controles de dia anterior/próximo, Hoje, Amanhã e Próxima folga. A tabela apresenta missões, blocos reservados, pausas, reservas e tempo flexível calculados com as preferências atuais. Consultar uma data passada não recria o planejamento histórico; os registros reais permanecem no Histórico.
- **Python e passeios:** os 120 minutos normais são mostrados em dois blocos de 60 minutos, com dez minutos de pausa fora da contagem. O passeio de folga aparece em dois blocos de 30 minutos. Em Ajustes, o segundo horário desse passeio tem campo próprio; a conclusão continua sendo uma missão diária única que confirma os dois cuidados.
- **Editar:** a prévia mostra os próximos sete dias. Novos conflitos precisam ser resolvidos antes de salvar. Conflitos de dados antigos aparecem como avisos e não invalidam um backup por si só. Um horário legado pode continuar sinalizado enquanto você combina uma rotina possível.
- **Loja:** mostra saldo que falta, limites e uma janela possível antes da reserva. O cálculo considera os mesmos blocos da agenda; a compra continua descontando uma vez e o cancelamento válido estorna uma vez.

A janela do dia continua 05:30–22:30. Os blocos reservados de trabalho, refeições, preparação, higiene, lazer básico e desaceleração vêm da proposta do PLANO e ainda não possuem editor completo. Esta fatia não cria/arquiva missões ou recompensas e não implementa calendário pessoal arbitrário.

O campo opcional do segundo passeio (`secondTime`) é uma extensão aceita pela versão atual em backups v1/v2; versões anteriores, inclusive 1.1.0, podem recusá-lo. Abrir dados existentes não muda automaticamente seu formato nem suas preferências. A contabilidade de sessões, fases e pontos permanece a da entrega 1.1.0.

## Melhoria planejada: finanças pessoais

Foi incluída no [roadmap](auditoria/ROADMAP.md) uma área para receitas/despesas mensais, quanto foi guardado, metas de reserva e acompanhamento manual de investimentos. Valores em reais ficarão separados das moedas do RPG. O módulo ainda não está implementado. O [prompt de sessões](auditoria/PROMPT_SESSOES_PYTHON.md) preserva o escopo dessa entrega; finanças permanecem no backlog F1–F3.
