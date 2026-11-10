# Prompt para continuar — sessões de Python independentes

> Registro histórico do escopo. Em 09/11/2026, sessões foram concluídas, validadas e publicadas em 1.1.0; veja [ENTREGA_SESSOES_PYTHON.md](ENTREGA_SESSOES_PYTHON.md). A solicitação mais recente autorizou revisar, corrigir e publicar a versão validada no GitHub e, depois, executar Hoje/agenda em ciclo separado, agora implementado e validado, com resultados no relatório de Hoje/agenda. As restrições de publicação/continuidade no prompt original abaixo descrevem aquela etapa anterior.

Preparado em 06/11/2026. A área de finanças pessoais foi incluída no roadmap como melhoria futura; este prompt continua a próxima entrega já recomendada após R0c. Copie o texto abaixo:

```text
Execute a próxima entrega do Entre Trilhas: separar sessões de Python da conclusão das fases, resolvendo B05.

Leia README.md, PLANO.md e os documentos de auditoria, especialmente AUDITORIA.md, ROADMAP.md, ENTREGA_R0A.md, ENTREGA_R0B.md, ENTREGA_R0C.md e PESQUISA_REFERENCIAS.md. Confira o código atual e reproduza o comportamento antes de alterá-lo.

Escopo desta entrega:
1. Permitir registrar sessões reais de estudo, com duração e objetivo, sem exigir concluir uma fase. Permitir várias sessões no mesmo dia e continuar uma fase ou projeto por vários dias.
2. Manter a meta editável de 120 minutos diários e os blocos 18:00–19:00 e 19:10–20:10; a pausa de dez minutos fica fora da contagem. A versão mínima continua disponível e não equivale a cumprir duas horas.
3. Separar registro de prática, avanço de fase e conclusão de projeto. A fase avança pelo seu critério e pré-requisito, respeitando a regra vigente de no máximo uma nova fase por dia, sem avanço automático por cronômetro.
4. Definir uma regra simples e editável de recompensa pela prática, preservando o orçamento diário atual. Várias sessões, mínima→normal e conclusão posterior de fase/projeto não podem pagar duas vezes pelo mesmo esforço. Mostrar minutos, XP e moedas com rótulos claros.
5. Permitir revisão e projeto livre depois da fase 120, sem bloquear o registro de estudo ou a habilidade Python.
6. Preservar contagens reais de exercícios e projetos, sem recontá-los ao avançar uma fase. Não ampliar o catálogo nem criar uma academia completa nesta entrega.
7. Permitir corrigir registros acidentais mantendo histórico, minutos e saldos coerentes. Corrigir uma sessão não deve apagar silenciosamente uma fase; corrigir uma fase não deve apagar prática real ou conceder novo ganho. Defina e teste essas relações.
8. Preservar backups existentes e o progresso histórico, sem inventar duração, exercícios ou sessões para registros antigos. Se o formato mudar, implemente migração explícita e testada, com cópia recuperável. Dias já pontuados no formato antigo não podem render outro pagamento pelo mesmo esforço após migrar.

Crie regressões antes das correções. Preserve as garantias de R0a/R0b/R0c: validação e contabilidade, recuperação anterior, falhas de armazenamento sem falso sucesso, IDs criptográficos, operações sem duplicação, horários salvos, foco estável, cronômetro e acessibilidade.

Use contextos isolados e dados fictícios. Verifique duas sessões no mesmo dia, retomada em outro dia, mínima→normal, conclusão posterior da fase, fim da trilha, correções, cliques repetidos, mudança de dia, backup antigo/novo, restauração, reabertura e falha de gravação.

Execute testes existentes e novos, build e fluxos reais no navegador na aplicação normal e no HTML único. Atualize e confira o pacote distribuído; diferencie ambientes reais, simulações e caminhos não testados.

Mantenha descanso, alimentação, lazer básico e cuidados essenciais do cachorro. Não aumente metas automaticamente nem crie punições por pausas ou faltas.

Finanças pessoais (gastos mensais, valores guardados e investimentos) já estão no roadmap como F1–F3. Preserve esse planejamento, sem implementar o módulo nesta entrega. Também não implemente agenda unificada, novas fases, avatar, PWA ou sincronização.

Prossiga até cumprir os critérios de aceite ou demonstrar um bloqueio concreto. Não pare no planejamento nem peça confirmação para decisões rotineiras e reversíveis. Não publique e não avance automaticamente para outra etapa.

Ao terminar, atualize a documentação e informe o que mudou, a regra de pontuação escolhida, a compatibilidade dos backups, testes, limitações e arquivos entregues. A próxima recomendação será melhorar Hoje e unificar a agenda.
```
