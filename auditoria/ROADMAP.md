# Roadmap de evolução — Entre Trilhas

> Atualização de 09/11/2026: sessões de Python independentes foram concluídas, validadas e publicadas em `main` no commit [51fecc7e87b906f366791833272fd7c212bd7bbb](https://github.com/danielfeuser23/vida/commit/51fecc7e87b906f366791833272fd7c212bd7bbb). A entrega separada [Hoje e agenda unificada](ENTREGA_HOJE_AGENDA.md), versão 1.2.0, foi implementada, validada e publicada; distribuição e referências estão no relatório.

Este é um plano de produto e engenharia, não uma lista de recursos já implementados. Revisão em 09/11/2026. Leia `AUDITORIA.md` para resultados e limitações. Aumentar riqueza significa primeiro aumentar confiança e utilidade; quantidade de telas não é uma métrica de sucesso.

## Direção do produto

Um companheiro de rotina em português que ajuda a decidir o próximo passo, registra prática com justiça e transforma estudo em uma jornada de aprendizado. Manter: dia difícil, descanso/lazer básico independente de moedas, cuidados essenciais, retomada sem punição e fuso São Paulo. Evitar metas que aumentam sozinhas, competição obrigatória e distrações que substituam a atividade real.

Indicadores úteis: tempo para registrar uma missão; sessões de Python registradas mesmo sem finalizar fase; exercícios realmente resolvidos; clareza do que fazer agora; recuperação após uma pausa; restauração de backup bem-sucedida. Não usar quantidade de cliques ou tempo dentro do app como sucesso.

## Status da entrega

R0a, R0b e R0c concluídas e verificadas; consulte [ENTREGA_R0A.md](ENTREGA_R0A.md), [ENTREGA_R0B.md](ENTREGA_R0B.md) e [ENTREGA_R0C.md](ENTREGA_R0C.md). A geração de IDs funciona nos contextos testados, inclusive HTTP não confiável simulado. Horários, XP visual, foco, contraste e editor foram corrigidos. A matriz de abertura distingue servidor local real, origens simuladas e aparelhos ainda não testados. Não houve publicação nem declaração de conformidade completa de acessibilidade.

**Sessões de Python independentes — entregues e publicadas:** B05 resolvido, com registro de duração, fases/projetos sem novo pagamento e migração recuperável v1→v2. A prática depois da fase 120 passou nos testes. A versão 1.1.0 teve 155 testes Node e, no navegador, smoke, integridade, abertura, sessões, acessibilidade e zoom nativo aprovados. O pacote foi conferido na cópia extraída; a publicação foi confirmada no commit ligado acima. Consulte [ENTREGA_SESSOES_PYTHON.md](ENTREGA_SESSOES_PYTHON.md).

**Entrega concluída e publicada: melhorar Hoje e unificar a agenda**, iniciada depois da validação e publicação de 1.1.0. A autorização atual abrange esse ciclo, sem avançar além dele. Finanças, novas fases, avatar, PWA e sincronização permanecem no backlog.

## Sequência vigente solicitada

| Ordem | Entrega | Dependência e aceite principal |
|---:|---|---|
| 1 | **Concluir a confiabilidade — entregue** | R0a/R0b/R0c verificadas, com limites de ambiente e acessibilidade documentados. Manter regressões nas entregas seguintes. |
| 2 | **Separar sessões de Python da conclusão de fases — entregue** | Versão 1.1.0 validada e publicada: várias sessões/dia, revisão após fase 120, fases/projetos independentes e pontuação única até o teto. |
| 3 | **Melhorar Hoje e unificar a agenda — entregue** | Modelo único de blocos, próxima ação pelo horário, consulta por data, prévia semanal/conflitos e disponibilidade da Loja; 197 testes Node, novas regressões de agenda e suítes anteriores aprovados; pacotes e publicação confirmados no relatório. |
| 4 | **Aprofundar as primeiras sete fases de Python** | Exercícios/sessões separados. Exemplos, pistas e testes locais autorais conferidos antes de expandir o catálogo. |
| 5 | **Enriquecer avatar, refúgio e loja** | Economia estável. Identidade própria, cosméticos por marcos, extras que cabem no tempo, poucos cliques. |
| 6 | **Adicionar revisão semanal acolhedora** | Totais confiáveis e rotina integrada. Manter ou ajustar sem metas automáticas ou punições. |
| 7 | **Finanças pessoais — melhoria solicitada em 06/11/2026** | Entregas F1–F3 abaixo: gastos mensais, quanto foi guardado e investimentos. Dinheiro real separado da economia do RPG. Ainda não implementado. |

As áreas detalhadas abaixo conservam o planejamento amplo, mas a prioridade de implementação é a sequência acima. A posição de finanças após as seis entregas anteriores é uma proposta editável; a implementação atual é Hoje/agenda, após o fechamento e envio de sessões. Persistência avançada, offline e sincronização ficam no backlog posterior. Porte e prazos precisam ser avaliados em cada etapa; não são compromissos de calendário.

## Confiabilidade — progresso e pendências

**R0a entregue:** validação estrutural e replay, backups v1 compatíveis, checkpoint/recuperação, recusa de dados inconsistentes e de prévia desatualizada, erro real em falha de gravação.

**R0b entregue:** gerador UUID v4 criptográfico compatível, IDs preparados antes das mutações, erro amigável sem API, regressões de duplicidade e matriz de abertura. Nativos, fallback, duas abas com Web Locks e backup/recuperação foram verificados nos contextos documentados. Sem Web Locks, permanece uma aba por vez.

**R0c entregue:** preferências explícitas seg–sex/sáb–dom, correções incluídas no XP líquido pela data do lançamento, gráfico com débitos, foco preservado, controles estáveis do cronômetro, contraste medido, diálogos nomeados e erros específicos no editor de habilidades. 108 testes Node; 15 testes/42 contextos de comportamento/acessibilidade e 2 testes/4 perfis de zoom nativo, além das suítes anteriores, aprovados. Backups v1 anteriores, recuperação e IDs preservados. Não inclui agenda unificada, leitor de tela ou aparelhos físicos.

**Critério de encerramento da base:** concluir/desfazer mostra saldo e XP líquido coerentes; horário salvo prevalece; controles não perdem foco; backup/restauração/recuperação e falhas de armazenamento continuam corretos; instruções distinguem caminhos verificados, simulações e requisitos. R0b não resolve aparelhos físicos ou hospedagem ainda não testados.

## Área: Hoje e agenda única

**Fatia atual 1.2.0, implementada e validada:** cálculo comum para Hoje/Agenda/Loja; próxima ação pelo horário; opcionais concluídas recolhíveis; essenciais visíveis; dois blocos de Python com pausa e dois passeios na folga; consulta por data; prévia de sete dias no editor e recusa de novos conflitos; avisos para conflitos legados; condições de resgate antes da compra. A publicação de 1.1.0 não valida automaticamente esta implementação.

**Fora desta fatia:** criar/arquivar missões ou recompensas, editor arbitrário de todos os compromissos fixos, calendário externo, mudanças automáticas por pendência, modelos pessoais completos de dia e avaliação com leitores de tela/aparelhos não disponíveis. Esses itens continuam objetivos do planejamento amplo abaixo.

- Manter as correções de R0c: foco após registro, navegação e fechamento de modal; cronômetro atualiza texto sem destruir os controles.
- Manter diálogos nomeados, contraste e alvos verificados em R0c; ampliar avaliação com leitores de tela, outros navegadores e aparelhos físicos.
- Destacar próxima ação que cabe no tempo disponível; distinguir pendências, missões disponíveis e programação futura. Nunca transformar pendência em dívida.
- Recolher concluídas e reduzir texto repetido nos cartões; permitir detalhes sob demanda. Manter botão de versão mínima fácil de alcançar.
- Criar um modelo único de agenda usado por Hoje, Ver agenda e Loja. Representar dois blocos de Python com pausa e dois passeios de folga; separar duração de esforço de intervalo ocupado.
- Editor de horários por dia de trabalho/folga, frequência e exceção, com prévia semanal e aviso claro de conflito antes de salvar.
- Backlog posterior à fatia atual: CRUD de missões e recompensas para criar/arquivar, preservando nomes/valores históricos. A edição já existente continua; cuidados essenciais exigem manutenção ou delegação explícita, não desaparecem no modo difícil.
- Loja mostra saldo que falta, janela possível e limite antes de abrir a compra. Confirmar consumo ou oferecer correção consistente do estado “utilizada”.

**Critérios de pronto:** fluxos principais completos só com teclado; leitor de tela identifica diálogos e estados; nenhuma rolagem horizontal em 320–430 px e zoom; edição aparece de forma coerente nas três telas; conflitos e ausência de janela são explicados antes do resgate.

## Área: sessões, exercícios e academia Python

- **Entregue na versão 1.1.0 publicada:** sessões de estudo, fases e projetos têm ações separadas. É possível somar duas horas sem concluir fase, continuar projeto por vários dias e estudar depois da fase 120. Exercícios têm contagem declarada por sessão; o registro individual de exercícios continua no backlog.
- **Compatibilidade implementada:** novos progressos usam v2; v1 abre sem regravação e pode ser ativado por prévia com cópia recuperável. Os pontos históricos entram no teto do mesmo dia, sem inventar minutos ou sessões.
- **Pontuação implementada:** soma diária, orçamento congelado no primeiro registro, mínima de 5 min/5 XP/2 moedas e teto padrão de 120 min/120 XP/36 moedas. Marco de fase ou projeto não paga novamente. Correções mantêm histórico e independência entre prática e marcos.
- Sessões diárias com objetivos claros: revisão, conteúdo, exercícios de base, variações e registro. Manter meta de 120 minutos editável e pausa fora da contagem de estudo.
- Checklist por exercício com estado, tentativas, observação e evidência opcional. Soma de resolvidos vem desses registros; evitar estimativas automáticas de competência.
- Ampliar exemplos progressivamente: conceito, exemplo executável, saída esperada, erros comuns, dica em camadas e solução comentada disponível sob demanda.
- Oferecer exercícios extras por dificuldade, não apenas mais quantidade. Ligar desafios a hábitos, agenda, pontos, cachorro, casa e gastos fictícios.
- Revisão espaçada proposta e editável: exercícios marcados como difíceis reaparecem sem impedir a trilha; retomada começa com uma revisão pequena.
- Projetos com marcos: Diário de pontos → persistência JSON → CLI testada → banco de dados → API → projeto integrador com documentação e testes.
- Referências oficiais de Python por assunto, pré-requisitos e critérios de conclusão verificáveis. Revisão pedagógica de cada mundo antes de ampliar o conteúdo.
- Manter código no editor local como opção principal. Um executor futuro só deve ser incluído com limites claros; nunca executar código não confiável diretamente no servidor do aplicativo.

**Critérios de pronto:** sessão pode ser registrada sem liberar fase; mínimos não fingem cumprir duas horas; exercício não pontua duas vezes; projetos não são somados repetidamente; há revisão depois da trilha; primeira semana tem exemplos e critérios testados, com expansão gradual para os demais mundos.

## Área: avatar, refúgio e loja

- Avatar ilustrado personalizável, com cores, acessórios e itens conquistados. Desenvolver identidade visual original, mantendo tipografia legível e paleta natural.
- Refúgio que muda com marcos significativos: biblioteca, bancada de Python e espaço do companheiro. Preferir pequenas mudanças visuais a uma tela cheia de barras.
- Conquistas por retomada, semanas possíveis, projetos e cuidado consistente; sem perder itens por faltar.
- Inventário cosmético e recompensas pessoais separados. Não exigir compra para comer, descansar, cuidar do cachorro ou ter lazer básico.
- Animação breve e discreta, som opcional, movimento reduzido e opção de simplificar os efeitos.
- Revisar economia com simulações de dia parcial, semana mínima e semana intensa. Não aumentar preços apenas para consumir saldo acumulado.

**Critérios de pronto:** o fluxo de concluir missão mantém poucos cliques; cosméticos não interferem nos cuidados; XP continua separado de moedas; feedback não bloqueia a próxima ação; melhorias visuais passam pelos mesmos critérios de contraste e desempenho.

## Área planejada: finanças pessoais

Solicitação de 06/11/2026: ter a “planilha de gastos mensais” dentro do Entre Trilhas, acompanhando quanto foi gasto, quanto foi guardado e os investimentos. Esta seção é planejamento; não existe uma tela financeira na aplicação atual. Não foi feita pesquisa externa para esta inclusão.

Proposta de interface: uma área **Finanças**, com seletor de mês, botão rápido de lançamento, resumo legível e tabela de movimentações. Gráficos terão os mesmos números da tabela e alternativa textual acessível. Começar com registro manual em reais; evoluir em entregas pequenas:

| Entrega | Escopo | Critério de aceite |
|---|---|---|
| **F1 — Gastos do mês** | Receitas e despesas manuais com data, descrição e categorias editáveis; filtros, correção de lançamentos, totais e comparação entre meses. Identificar o resultado mensal como receitas menos despesas, sem presumir que toda sobra foi guardada. | R$ 3.000 de receitas e R$ 1.200 de despesas mostram resultado de R$ 1.800; editar uma despesa para R$ 1.300 muda o resultado para R$ 1.700. Repetir um clique não cria outro lançamento; reabrir e restaurar mantêm os totais. |
| **F2 — Quanto guardei e metas** | Contas/reservas, saldo inicial informado, transferências, aportes e retiradas, meta de reserva editável e histórico mensal. Mostrar separadamente resultado do mês, valor destinado à reserva e aportes líquidos (aportes menos retiradas). | Destinar R$ 500 de uma conta própria para uma reserva registra R$ 500 guardados, mantém as despesas em R$ 1.200 e não cria receita nem patrimônio extra. Retirar R$ 100 deixa o aporte líquido em R$ 400; o passado permanece consultável. |
| **F3 — Investimentos acompanhados manualmente** | Cadastro simples de posições, aportes, resgates e valor atualizado informado pelo usuário com data. Separar capital aplicado, fluxos, rendimentos informados e variação de valor; sinalizar informações desatualizadas. | Uma posição de R$ 500 atualizada manualmente para R$ 520 mostra variação de R$ 20 e data de avaliação, sem transformar isso em depósito de dinheiro ou novo aporte. Corrigir a avaliação e restaurar backup preservam posição e histórico coerentes. |

Regras e dependências:

- **R$ são dinheiro real; moedas e XP continuam virtuais.** Não converter os saldos entre si nem recompensar valores gastos/investidos. Não exigir saldo da loja para registrar ou consultar finanças.
- Valores financeiros serão armazenados em centavos inteiros e exibidos em pt-BR/BRL. Déficit financeiro pode ser registrado; a regra de não negatividade das moedas do jogo não deve esconder uma situação financeira real negativa.
- Transferência entre contas próprias, aporte e resgate não são automaticamente receita/despesa de consumo. Totais de reserva e de investimentos são partes do patrimônio: não somá-los novamente ao total das contas.
- Definir a convenção de data dos relatórios. Cartão, parcelas e recorrências ficam para uma entrega própria posterior: compra, parcela e pagamento de fatura não podem contar a mesma despesa mais de uma vez.
- Preservar correções rastreáveis, prevenção de duplicidade e consistência após salvar/reabrir. Exportação/restauração e eventuais migrações precisam incluir o novo módulo sem perder o progresso existente.
- Dados financeiros continuarão locais inicialmente, com explicação dessa limitação e do conteúdo sensível de backups/exportações. Testes usarão somente dados fictícios. CSV para planilhas pode ser uma exportação adicional; não substitui backup completo.
- Não incluir inicialmente conexão bancária, ordens de investimento, cotações automáticas, recomendações de ativos ou promessas de rentabilidade. Esses recursos não são necessários para o acompanhamento manual solicitado.
- Não transformar alimentação, moradia, lazer básico, saúde ou cuidados do cachorro em metas de corte automáticas. Metas de economia serão escolhidas pelo usuário, sem culpa ou aumento automático.

**Dependência principal:** manter as garantias R0a/R0b/R0c e definir o modelo financeiro antes de F1. F2 depende de F1; F3 depende do tratamento correto de transferências e reservas de F2. A implementação exige seus próprios testes de cálculo, correção, virada de mês, duplicação e backup; esta atualização documental não altera dados ou funcionamento.

## Backlog posterior: aplicativo durável e rápido

- Indexar eventos em uma passagem para validar compras e registros; remover filtros aninhados desnecessários. Cachear agregados semanais e habilidades com invalidação correta.
- Paginar ou virtualizar histórico; filtrar por período/habilidade/tipo e oferecer resumo mensal. Renderizar somente regiões alteradas.
- Benchmark com 30, 365 e 1.095 dias, registrando ambiente, repetições e percentis. Proposta inicial: medir até atingir interações comuns abaixo de 100 ms no desktop de referência e sem travamentos perceptíveis em simulação de CPU reduzida; ajustar metas a aparelhos reais.
- Persistência versionada e migrações testadas; avaliar IndexedDB por registros, com transações e limites de retenção explícitos. Não migrar silenciosamente sem backup e recuperação.
- PWA instalável e offline com atualização segura do cache. Distinguir “salvo neste aparelho”, “offline” e “sincronizado”, se houver sincronização no futuro.
- Cronômetro persistente com instante final, pausa, recuperação ao reabrir e proteção contra mudança de dia. Ele nunca conclui automaticamente uma atividade.
- Backup com data, versão, resumo, prévia e restauração reversível. Lembrete opcional para exportar; não prometer proteção em nuvem sem implementá-la.
- Modularizar domínio, armazenamento, telas e conteúdo. Formatação, lint, testes de regressão e CI. Build do HTML e ZIP na mesma release; conferir que todos correspondem à mesma versão.

**Critérios de pronto:** histórico longo não congela a navegação; migração interrompida é recuperável; abrir/fechar offline funciona; atualizações não descartam progresso; pacote distribuído passa no mesmo smoke que as fontes.

## Backlog posterior: sincronização opcional

Somente quando a necessidade de usar celular e computador estiver confirmada e o modelo local estiver estável:

- Definir conta, dados mínimos, privacidade e opção de exportar/excluir.
- Autorização por usuário no servidor; nunca depender de ocultar IDs. Segredos ficam fora do código e dos backups exportados.
- Fila offline e resolução de conflitos com identificadores de operação; duas conclusões em aparelhos diferentes não podem duplicar saldo.
- Sincronização de eventos com recuperação de versões. Tornar estado de envio e conflito visível e compreensível.
- Compartilhamento familiar por convite e permissões, se desejado, sem atribuir tarefa a outra pessoa automaticamente.
- Notificações opcionais e configuráveis, com horários de silêncio. Não usar pressão por sequências ou culpa.

**Critérios de pronto:** testes com dois aparelhos/contextos, alterações simultâneas, desconexão e reconexão; dados de um usuário não acessíveis por outro; backup e exclusão exercitados; os recursos locais permanecem utilizáveis sem a rede.

## Ordem prática para os próximos ciclos

1. R0a/R0b/R0c: base de confiabilidade entregue; manter os testes e limites documentados.
2. Sessões de Python independentes: versão 1.1.0 entregue, validada e publicada; manter as regressões.
3. Melhorar Hoje e unificar a agenda: versão 1.2.0 implementada e validada; pacotes e publicação confirmados no relatório.
4. Aprofundar as primeiras sete fases de Python, validando um piloto de conteúdo.
5. Enriquecer avatar, refúgio e loja.
6. Adicionar revisão semanal acolhedora, com opção de manter tudo igual.
7. Finanças pessoais, em entregas F1–F3: gastos mensais, valores guardados/metas e investimentos manuais. Posição sugerida no backlog; não iniciar junto com a próxima entrega.

Depois dessas entregas, avaliar histórico escalável/offline e sincronização conforme medidas e necessidade real. Cada entrega termina com evidências de testes, limitações e critérios de aceite; build aprovado sozinho não encerra uma etapa. A autorização de 09/11/2026 permite executar Hoje/agenda após concluir, validar e publicar sessões. Não avançar além dessa entrega sem nova autorização.

Escopo original da entrega de sessões: [PROMPT_SESSOES_PYTHON.md](PROMPT_SESSOES_PYTHON.md). Ele é um registro histórico; a autorização atual de revisão/publicação e continuidade está refletida no status acima.
