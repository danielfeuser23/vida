# Entrega R0a — Integridade e restauração recuperável

> Histórico da entrega. Estado atual: [R0c entregue em 06/11/2026](ENTREGA_R0C.md); as garantias de integridade e recuperação descritas aqui continuam cobertas pelas regressões.

> Atualização: R0b foi entregue em 05/11/2026. Consulte [ENTREGA_R0B.md](ENTREGA_R0B.md) para a correção de IDs e a matriz de abertura. Este documento preserva o registro da etapa anterior.

Data: **05/11/2026**, fuso America/Sao_Paulo. Aplicação local; sem publicação. Formato de backup continua **versão 1**, sem migração de dados.

## Problemas reproduzidos antes da correção

Os 35 testes existentes passaram na base anterior. Os diagnósticos adicionais confirmaram:

- records/overrides/difficult podiam ser arrays; propriedades nomeadas desapareciam no JSON.
- Eventos de ganho sem ocorrência ou habilidades eram aceitos.
- Habilidades dos registros podiam divergir das habilidades creditadas nos eventos.
- Compras, estornos, referências e IDs repetidos tinham validação insuficiente.
- A preferência exibida como salva podia não ter sido gravada quando faltava espaço.

As primeiras 15 regressões de integridade tiveram **11 falhas esperadas** contra o motor anterior. Outros casos foram acrescentados durante a implementação e revisão.

A revisão também encontrou e cobriu três riscos na implementação da recuperação: perda do alvo quando a gravação principal falhava, ambiguidade ao restaurar bytes idênticos e exportação do armazenamento corrompido no lugar de uma cópia válida em memória.

## O que mudou

### Validação e contabilidade

O motor agora confere o esquema e os tipos antes de usar os dados. Mapas precisam ser objetos; valores que não sobrevivem ao JSON, objetos exóticos, ciclos, propriedades omitidas e acessores são rejeitados sem executar getters.

O histórico é reconstruído na ordem dos eventos, conferindo:

- ocorrências, conclusões, upgrade e correção exata;
- XP e moedas inteiros e saldos não negativos após cada evento;
- distribuição de habilidades por ocorrência e seus totais;
- vínculo entre eventos, registros, fases Python e compras;
- compra única por transação, requestId único e estorno único com valor/status coerente;
- referências existentes, datas, configurações e IDs utilizáveis pela interface.

Os valores históricos são conferidos pelos próprios snapshots. Editar hoje o nome, a pontuação ou a habilidade não reescreve o passado. Também continuam válidas correções retroativas e conclusões com recompensa zero.

parseState e serializeState validam na leitura e antes/depois da serialização. A interface persiste somente o estado validado e só atualiza a memória depois de confirmar a gravação.

### Restauração, recuperação e interrupção

Antes de substituir o progresso, o backup é validado e a cópia atual é preservada. O arquivo selecionado tem prévia e confirmação. Se outra aba mudar o progresso depois da prévia, a confirmação é recusada e pede nova conferência.

A área Ajustes oferece **Recuperar cópia anterior** e **Exportar cópia anterior**. A recuperação também preserva o estado substituído, permitindo revertê-la. Restaurar bytes já idênticos ao progresso é uma operação sem gravação e não apaga uma cópia anterior distinta.

Como localStorage não oferece transação entre chaves, a substituição usa um checkpoint na chave de recuperação. Ele preserva o principal anterior, o alvo e a recuperação que já existia antes de alterar a chave principal. Se houver falha ou interrupção, as cópias continuam disponíveis. Antes de uma gravação posterior, um checkpoint pendente precisa ser consolidado, impedindo que sua interpretação mude após novas alterações.

Se não houver espaço para preservar as cópias, a restauração é abortada. Uma falha de consolidação mantém o checkpoint completo; não é tratada como perda dos snapshots. Corrupção externa que deixe o checkpoint ambíguo exige exportação para análise, sem substituir silenciosamente os dados.

Há apenas um slot de cópia anterior, além dos snapshots transitórios do checkpoint. Uma nova restauração bem-sucedida substitui esse slot, com aviso na confirmação. Isso não é histórico ilimitado de versões.

### Erros e exportação

Falhas de gravação mantêm o progresso salvo, preservam o formulário e mostram erro. Preferências não anuncia sucesso quando a transação falha.

Se outra aba danificar o armazenamento ou a leitura passar a falhar, mas esta aba ainda tiver uma cópia válida em memória, **Exportar backup** exporta essa cópia válida. **Exportar arquivo original** permite guardar os bytes danificados separadamente. Se a aplicação já abre com dados ilegíveis, eles são preservados e podem ser exportados para análise antes de restaurar um arquivo válido.

Uma cópia anterior com conteúdo inválido pode ser exportada fielmente, mas nunca é reinstalada automaticamente como progresso. O arquivo interno de recuperação também pode ser exportado para análise se seus metadados estiverem ilegíveis; ele não é apresentado como backup de importação direta.

## Compatibilidade

O esquema de progresso e a chave entre-trilhas-v1 foram mantidos. Não houve reset ou migração de backups válidos.

A fixture tests/fixtures/legacy-v1.json foi produzida pelo motor anterior e preservada. Ela inclui dez eventos com recompensas zero, mudança de habilidade com delta negativo, compra, estorno e correção/nova conclusão retroativa. Ela continua validando, restaurando, reabrindo e exportando sem alteração dos dados.

Dados inconsistentes que o validador anterior aceitava por engano passam a ser recusados. Eles não são reparados descartando eventos ou inventando saldos. Os bytes originais permanecem disponíveis para exportação/análise.

Limitação do legado: eventos v1 não registram rank. Quando não houve upgrade, não é possível provar pelo evento se uma conclusão não Python era mínima ou normal; o rank do registro final continua aceito como 1 ou 2. Não foi inventado esse dado ausente.

## Verificações

- Sintaxe: npm run check.
- Regressões existentes, integridade e armazenamento: npm test.
- Artefato único: npm run build.
- Fluxos existentes: python3 tests/browser_smoke.py.
- Regressões no navegador: python3 tests/browser_integrity.py; usa contextos isolados e roda fonte e HTML único.

Resultado final confirmado:

| Verificação | Resultado |
|---|---|
| Sintaxe | Passou, incluindo storage.js e build.js. |
| Testes Node | **71 passaram**, 0 falhas, 0 ignorados: 35 originais + 20 de integridade + 16 de armazenamento. |
| Build | Passou; HTML único regenerado com motor e persistência. |
| Smoke existente no Chromium | Passou: missões, loja, correções, fases, reabertura, backup, virada de dia e seis telas mobile; sem erros JavaScript. |
| Suíte R0a no Chromium | **14 testes / 36 contextos isolados passaram** na aplicação normal e no HTML único; sem exceções JavaScript não tratadas. |

A suíte R0a cobre arrays/eventos órfãos/JSON malformado, fixture v1, exportação real, restauração, recuperação, reabertura, duas abas/prévia desatualizada, quota no principal e na recuperação, corrupção externa e exportação da memória mesmo após SecurityError de leitura. Os testes Node também simulam falha da consolidação e reabertura de checkpoint interrompido.

Safari, Firefox, aparelhos físicos e falha física de disco não foram testados. A falha de gravação é injetada em contextos de teste; nenhum perfil real ou progresso do usuário foi utilizado.

## Arquivos principais

- engine.js: validação, replay e parse/serialização.
- storage.js: persistência, checkpoint, restauração e recuperação.
- app.js: integração, prévias, erro de gravação e exportações.
- build.js: inclui armazenamento no HTML único.
- tests/integrity.test.js e fixture v1: regressões do motor.
- tests/storage.test.js: falhas, interrupção e recuperação.
- tests/browser_integrity.py: fluxos reais em perfis de teste separados.

## Limites e próxima entrega

Dados continuam locais ao navegador/aparelho, sem sincronização e sem backup em nuvem. Limpar dados do navegador pode remover tanto o progresso quanto a cópia anterior: exportação externa continua necessária. Sem Web Locks, use uma aba de cada vez; a comparação da prévia evita conflitos detectados, mas não fornece uma transação atômica entre processos de navegadores antigos.

Não há garantia contra arquivo adulterado de modo completamente autoconsistente, relógio incorreto, falha física do armazenamento ou limpeza deliberada do navegador. A validação garante invariantes do formato, não autentica autoria.

As demais correções do roadmap continuam pendentes: UUID/abertura HTTP fora de localhost, horários de folga, XP líquido visual, foco/contraste e sessões Python independentes de fase. O tratamento de gravação solicitado nesta etapa já cobre o falso sucesso de preferências, que era parte de B09.

**Próxima entrega recomendada: R0b — concluir a compatibilidade dos caminhos de abertura e identidade das operações.** Não foi iniciada nem publicada nesta entrega.
