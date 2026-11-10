# Entrega — Hoje e agenda unificada

**Revisão iniciada em 09/11/2026 · America/Sao_Paulo · aplicação 1.2.0.**

**Implementação e validação funcional concluídas.** Os resultados confirmados estão abaixo; pacote extraído e envio ao GitHub são registrados separadamente. Não houve deploy.

## Base e autorização

A versão 1.1.0, com sessões de Python independentes, foi validada e publicada em `main` no commit [51fecc7e87b906f366791833272fd7c212bd7bbb](https://github.com/danielfeuser23/vida/commit/51fecc7e87b906f366791833272fd7c212bd7bbb). Essa publicação foi confirmada antes de iniciar esta entrega separada. Não houve deploy.

A solicitação atual autoriza concluir Hoje/agenda com seus testes, documentação e pacote, sem avançar além desse ciclo. Finanças F1–F3, novas fases, avatar, PWA e sincronização continuam fora desta implementação.

## Problema e implementação

Antes desta fatia, Hoje consultava missões, Ver agenda mostrava uma tabela fixa e a reserva tratava algumas durações como um intervalo contínuo. Isso podia ocultar a pausa adicional do estudo, o segundo passeio de folga e diferenças entre uma preferência salva e a agenda exibida.

O módulo puro `agenda.js` passa a representar blocos do dia, tempo flexível, faixas para extras e conflitos. O motor expõe o mesmo planejamento a Hoje, consulta de Agenda e disponibilidade da Loja. Horários usam o dia já resolvido em America/Sao_Paulo; o modelo não converte estudo no expediente ou trajeto em tempo disponível.

### Hoje

- O painel de próxima ação distingue o bloco atual, uma missão futura, descanso, pausa da jornada e conflito de horário.
- Um bloco reservado de trabalho, refeição, transição, pausa ou descanso é explicado antes de sugerir outra tarefa.
- Uma mínima opcional pode ser sugerida em tempo flexível quando couber; isso não reagenda a missão nem cria dívida.
- Cuidado essencial atrasado pede conferência ou ajuda, sem reduzir a duração necessária.
- Opcionais concluídas podem ser recolhidas e expandidas para correção. Cuidados essenciais continuam visíveis mesmo depois de registrados.
- A atualização por minuto altera textos e atributos do painel existente, preservando controles e foco; não re-renderiza a tela inteira a cada minuto.

### Agenda por data

A consulta usa os mesmos blocos do dia e oferece dia anterior/próximo, Hoje, Amanhã e Próxima folga. A tabela distingue missões, rotina reservada, pausas, extras reservados e tempo flexível. Mostra conflitos e janelas disponíveis para extras.

Consultar uma data passada aplica as **preferências atuais** àquele dia; não pretende reconstruir o planejamento histórico. Os registros reais e seus snapshots continuam no Histórico e não são reescritos.

### Esforço separado de ocupação

Com a configuração padrão:

| Atividade | Ocupação planejada | Esforço/recompensa |
|---|---|---|
| Python | 18:00–19:00, pausa 19:00–19:10, prática 19:10–20:10 | 120 min de prática; a pausa ocupa a agenda mas não pontua. |
| Passeios de folga | 07:20–07:50 e 17:00–17:30 | Uma missão diária de 60 min; confirmar a missão declara os dois cuidados, sem duas recompensas. |

Ao editar os minutos normais de Python, o modelo divide o esforço em dois blocos e acrescenta a pausa de dez minutos. A exceção técnica de meta de um minuto usa um único bloco sem inventar outro minuto nem pausa; metas maiores dividem sem perder esforço. Nas folgas, o banho de manhã é preservado às 09:20 quando não há exercício, ou após o exercício quando houver. O orçamento já iniciado naquele dia preserva seu snapshot; não há alteração dos XP, moedas ou minutos históricos. A preferência opcional `secondTime` controla o segundo passeio de folga, sem mudar a frequência da missão ou duplicar cuidados.

### Editor e conflitos

O editor de missão calcula uma prévia dos próximos sete dias usando frequência, horários úteis/folga, duração e exceções. A prévia não grava alterações. Salvar verifica novos conflitos antes de substituir o progresso.

Conflitos já presentes em preferências antigas são sinalizados, mas não tornam o backup inválido por si só. Alterar um título sem piorar os horários não deve exigir apagar ou “consertar” o passado. Novos conflitos com refeições, trabalho, cuidados, transições ou descanso precisam ser resolvidos antes da gravação.

Reagendar uma missão não cria pontos ou punições. Missões e sessões já registradas continuam exigindo a correção correspondente antes de mover a ocorrência. Cuidados essenciais não são adiados; apenas seus horários podem ser ajustados com ajuda real combinada.

### Loja

Os cartões passam a informar saldo que falta, duração, limite e disponibilidade antes da compra. A janela deve comportar a recompensa inteira e não invadir os blocos ocupados, inclusive pausa de Python e segundo passeio.

As faixas base para extras permanecem 21:30–21:50 e, nas folgas, também 14:00–16:00. O espaço efetivamente disponível é calculado após descontar ocupações e outras reservas. Moedas não criam tempo extra.

A API legada de reservas v1 mantém compatibilidade com operações anteriores. A interface usa o modelo comum para apresentar as condições. A interface valida novamente, dentro da transação, o intervalo efetivamente informado, tanto em v1 quanto em v2. A regressão com segundo passeio às 15:00 confirmou que alterar o início sugerido para invadir esse cuidado não cria compra nem muda o progresso. Pedidos já salvos continuam idempotentes.

## Compatibilidade e escopo

Não há uma migração automática de progresso apenas para consultar a agenda. O modelo deriva os blocos das preferências e registros existentes. A ativação v1→v2 de sessões continua explícita e recuperável, como em 1.1.0.

O formato aceita a preferência opcional `secondTime` somente no passeio de folga. Dados antigos sem o campo usam 17:00 para a segunda parte. Backups v1/v2 existentes continuam sendo lidos; backups que passem a incluir esse campo precisam da versão atual, pois versões anteriores, incluindo 1.1.0, podem recusá-lo.

Os blocos reservados de trabalho, refeições, preparação, higiene, lazer básico e desaceleração vêm da proposta do PLANO. A janela continua 05:30–22:30. Esses compromissos fixos ainda não têm editor arbitrário; horários de missões, frequência e exceções continuam editáveis dentro dos critérios.

Esta é uma fatia do objetivo amplo de agenda. Não inclui criar/arquivar missões ou recompensas, calendário externo, templates pessoais completos, sincronização, replanejamento automático por pendência ou avaliação com leitores de tela/aparelhos indisponíveis.

## Critérios de aceite desta fatia

1. Hoje, Agenda e disponibilidade de Loja calculam os mesmos intervalos para uma data.
2. Dois blocos de Python somam a meta de prática sem contar a pausa; passeios de folga têm duas partes visíveis sem pagar duas vezes.
3. Preferência editada e reagendamento aparecem nas três consultas. A prévia semanal não muda o progresso e o novo conflito é recusado antes de salvar.
4. Um backup antigo com conflito continua restaurável; o aviso explica o problema sem descartar dados.
5. Próxima ação respeita trabalho, trajeto, refeições, transições, lazer básico, sono e necessidades do cachorro. Uma missão futura não é apresentada como se devesse começar agora.
6. O painel e o cronômetro mantêm os controles/foco entre atualizações; teclado, diálogo, 320–430 px e zoom nativo são conferidos nos novos fluxos.
7. Uma recompensa só pode ser reservada no intervalo livre efetivo, com preço e limite corretos; cliques repetidos e cancelamentos preservam as garantias anteriores.
8. Sessões, fases, projetos, XP, moedas, backups, migração e recuperação continuam passando nas regressões da versão anterior.

## Regressões e verificações

A base publicada de 1.1.0 tinha 155 testes Node aprovados. A versão atual tem 197: os 155 anteriores, 29 do modelo e 13 de integração. As regressões foram criadas antes das alterações: a baseline do modelo teve 27 falhas pela API ausente; a integração teve 11 falhas e uma aprovação. Uma das falhas demonstrou a reserva que ignorava os dez minutos adicionais ocupados por Python.

A comparação de navegador com o snapshot publicado de 1.1.0 executou 16 métodos/34 contextos e teve 30 falhas de subcenários e quatro erros; isso não representa 34 bugs diferentes. A implementação também corrigiu a sugestão de uma mínima de cinco minutos quando restavam só dois, preservou o banho de domingo previsto no plano e protegeu os caminhos de UI v1 que continuam usando APIs legadas.

O último caso reproduziu perda de foco no grupo de concluídas quando outra aba atualizava dados após a primeira semana: dois contextos falharam antes dos IDs estáveis dos summaries. Depois da correção, o cenário passou nos dois artefatos, com XP/moedas preservados; os dois casos de teclado relacionados foram repetidos. Os testes antigos só tiveram adaptações de navegação para abrir o grupo recolhido por clique e uma preferência antes conflitante foi substituída por horário válido, acrescentando regressão específica da recusa do horário antigo. As asserções financeiras e de backup não foram reduzidas.

| Verificação | Estado |
|---|---|
| Reproduções antes da correção e regressões de modelo | Confirmadas nos snapshots e logs descritos acima. |
| `npm run check` | Aprovado, incluindo agenda.js. |
| `npm test` | **197 aprovados**, zero falhas/ignorados: 155 anteriores + 29 de modelo + 13 de integração. |
| `npm run build` e bundle | Aprovado; HTML único regenerado, build determinístico e sintaxe do script conferida no empacotamento. |
| `python3 tests/browser_agenda.py` | **17 cenários/36 contextos aprovados em rodadas 16 + 1**, aplicação normal e HTML único; último cenário de foco repetido depois da correção. |
| Suítes anteriores de navegador | Smoke aprovado; integridade **14/36**, abertura **7/32**, sessões **14/32**, acessibilidade **16/44** e zoom nativo **6/12** aprovados (testes/contextos ou perfis). Após os IDs finais, dois cenários de teclado/quatro contextos passaram novamente. |
| ZIP extraído | Aprovado: módulo agenda.js incluído, CRC e conteúdo comparados com as fontes; sintaxe, 197 testes Node e build passaram na cópia extraída. Quatro testes de navegador/oito contextos passaram nos dois artefatos (Python, passeios/backup, compra/estorno e prévia/recusa de conflito). |
| Publicação 1.2.0 | PENDENTE — não confundir com o commit publicado de 1.1.0. |

Todas as verificações devem usar dados fictícios e contextos/perfis isolados, sem abrir o progresso pessoal do usuário.

Algumas tentativas iniciais foram impedidas por limite de uso da revisão automática ou por SIGTRAP/EPERM no contexto restrito; outra rodada encontrou o servidor encerrado após a retomada. Esses resultados de infraestrutura não foram tratados como bugs do produto nem aprovações. As rodadas válidas usaram o servidor reiniciado, com HTTP 200 confirmado, sem contornar restrições.

## Limites de evidência e continuidade

Os testes usaram Chromium automatizado, com larguras de 320–430 CSS px e zoom nativo de 200%. Foram medidas 129 amostras de texto por artefato, mínimo de 4,826:1 e nenhuma falha nos limiares aplicáveis. Capturas móveis e de zoom foram inspecionadas. Não houve homologação em aparelho físico, Safari, Firefox ou leitor de tela; não se declara conformidade WCAG completa. HTTP não confiável e HTTPS simulados continuam distintos de rede física e certificado real; abertura `file://` não é um caminho funcional homologado.

Depois de concluir esta entrega, o próximo item recomendado é aprofundar as primeiras sete fases de Python. Essa implementação não está autorizada neste ciclo. Finanças F1–F3 permanecem planejadas e separadas das moedas do RPG.
