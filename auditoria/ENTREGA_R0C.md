# Entrega R0c — Correção de comportamento e acessibilidade

**06/11/2026 · America/Sao_Paulo · aplicação 1.0.3 · backup versão 1. Sem publicação.**

## Resultado

Foram corrigidos os achados B02, B03, B06, B07, B10 e B11 nos cenários verificados. As regressões de integridade, armazenamento e IDs de R0a/R0b continuam aprovadas. Esta entrega não implementa sessões independentes de Python, agenda unificada, novas fases, avatar, PWA ou sincronização.

Foram lidos README, PLANO e os documentos de auditoria antes das alterações. O código atual foi conferido; os achados históricos não foram tratados como prova suficiente por si só.

## Reprodução e regressões

A base de R0b tinha **88 testes Node aprovados**. Antes das correções:

- As 14 novas regressões de comportamento tiveram 11 falhas e 3 aprovações contra o motor anterior: horários personalizados, preferência explícita de folga e ausência do cálculo líquido.
- As seis regressões de paleta tiveram cinco falhas e uma aprovação.
- No navegador foram reproduzidos o foco indo para o body após concluir/navegar, botões do cronômetro recriados, diálogo sem nome, XP visual que ignorava correções, horários personalizados ignorados e erro genérico no editor.
- A comparação final da mesma suíte de navegador com o snapshot 1.0.2 executou 15 métodos em 38 contextos: dois métodos passaram; os outros tiveram **28 falhas de subcenários e dois erros por ausência do novo controle de habilidade secundária**. Não são 30 defeitos diferentes. Dia difícil e reflow móvel/emulado já passaram nessa comparação.
- A revisão identificou um texto fixo “+ movimento” no cartão quando a secundária era outra habilidade. Uma regressão específica falhou nos dois artefatos antes do ajuste; depois conferiu nome exibido, crédito de 10 XP para cada habilidade em uma missão de 20 XP e persistência após recarregar.

Os testes anteriores de Node e navegador foram preservados byte a byte em relação ao pacote R0b, sem reduzir asserções. Os novos testes verificam resultados esperados; a baseline é uma comparação com um snapshot separado em `/tmp`, não uma substituição do aplicativo atual.

Durante a construção dos testes, esperas do fechamento por Escape, a seleção da barra de débito e a leitura de `option.disabled` foram corrigidas para medir o comportamento real do DOM. A exploração com CSS `zoom` foi separada da medição de zoom nativo: ela não reproduz o viewport e a top layer do zoom do navegador.

## O que mudou

### Horários de sábado e domingo

O editor agora mostra **Horário seg–sex** e **Horário sáb/dom**. O motor usa a preferência explícita de fim de semana, e um reagendamento pontual continua prevalecendo.

Backups antigos sem `weekendTime` seguem esta regra de leitura, sem mutação dos dados ao abrir:

- Exercício/casa ainda no horário padrão antigo preservam a proposta de 09:00 na folga.
- Se o horário legado foi personalizado, por exemplo 10:30, ele passa a ser respeitado também no fim de semana.
- Outras missões mantêm seu horário salvo.

Isso corrige a seleção do horário de ocorrência em Hoje; a frequência continua sendo a configurada. **Ver agenda ainda mostra a proposta fixa**, com aviso de que não acompanha automaticamente as edições. A unificação de toda a agenda pertence à entrega posterior, conforme o escopo solicitado.

### XP líquido e correções antigas

Hoje e o gráfico semanal somam todos os valores de XP dos eventos **pela data do lançamento**, incluindo débitos. Não há alteração da contabilidade real nem reescrita de eventos passados.

| Operação | Ontem | Hoje | XP geral |
|---|---:|---:|---:|
| Leitura normal registrada ontem | +10 | 0 | 10 |
| Corrigir hoje aquela leitura | +10 | −10 | 0 |

Uma conclusão e correção no mesmo dia resultam em zero líquido. Repetir o ciclo não infla o cartão. O gráfico desenha ganhos acima da linha de zero e correções abaixo. O histórico mostra a data do lançamento e, em correções retroativas, a data da atividade original. O texto explica que um débito de correção não é punição por faltar.

### Foco, diálogos e cronômetro

- Após registrar ou corrigir, o foco retorna ao controle equivalente na mesma missão; se o botão deixou de existir, vai para a ação disponível naquela missão.
- Navegar entre telas coloca o foco no título, com `tabindex="-1"`.
- Diálogos têm `aria-labelledby`, foco inicial no título e retorno ao controle de origem após Escape, cancelar ou salvar. Mantêm a contenção de teclado do diálogo modal nativo.
- O cronômetro cria sua estrutura uma vez e atualiza somente tempo e estado. Pausar/retomar mantém o mesmo botão no DOM e o foco, inclusive entre ticks.
- Ao fechar o cronômetro, o foco retorna ao controle que o iniciou. Ele segue opcional, sem conclusão automática e sem persistência após fechar/recarregar.

O registro comum continua exigindo um clique. O modo dia difícil preserva as versões mínimas e os cuidados essenciais do cachorro.

### Editor de habilidades e erros

Principal e secundária ficam explícitas; a opção igual à outra habilidade é desabilitada. Há também validação antes da transação, inclusive para um DOM adulterado no teste. O usuário pode escolher “Nenhuma” como secundária.

Erros de título/ação/critério, horários, frequência, números e pontuação mínima superior à normal são apresentados no formulário com mensagem específica, `role="alert"`, `aria-invalid`, associação ao campo e foco no primeiro campo inválido. O formulário e o progresso ficam preservados. Corrigir o valor limpa o erro sem remover a descrição de ajuda.

O cartão usa o nome real da habilidade secundária. As duas habilidades repartem o orçamento de XP; moedas e XP total não são duplicados. Editar habilidades não reescreve os snapshots das atividades anteriores.

### Contraste, toque e layout

A paleta de floresta e papel foi mantida, com cores auxiliares mais escuras, foco visível e ajustes de quebra de linha e formulários. Os controles principais medidos têm pelo menos **44×44 CSS px**; esse é um alvo de conforto, não uma declaração de conformidade universal.

| Medição | Resultado |
|---|---|
| Amostras de texto nas seis telas, antes | 124 por artefato; 80 abaixo do limiar aplicável; mínimo 3,13:1. |
| Amostras de texto nas seis telas, depois | 125 por artefato; nenhuma abaixo do limiar aplicável; mínimo 4,83:1. |
| Texto auxiliar `--muted` | 6,00:1 no papel, 5,45:1 na página, 5,39:1 na missão concluída. |
| Testes Node de cores | Seis verificações para texto, avisos, ícones relevantes, controle de conclusão e foco. |
| Larguras móveis | 320, 360, 390 e 430 CSS px, nas seis telas e no diálogo testado, sem overflow horizontal. |
| Ampliação emulada | 320/640 CSS px com DPR 2 via CDP; resultado separado do zoom nativo. |
| Zoom nativo 200% | Seletor do próprio Chromium em perfis novos: janelas de 640/1.280 px, viewport de 320/640 CSS px e DPR 2, CSS zoom igual a 1; seis telas, editor, reagendamento, foco e limites horizontais aprovados. |

As capturas de tela foram inspecionadas em largura móvel e zoom nativo. Para o zoom nativo, a captura usa a janela física via CDP, sem emular métricas: a captura `full_page` do Playwright usava a escala original do contexto e recortava a imagem, apesar de o layout medido estar correto.

## Preservação de R0a/R0b e compatibilidade

O esquema continua **versão 1**, na chave `entre-trilhas-v1`. Backups válidos anteriores continuam aceitos sem reset, conversão ou migração. A fixture legada mantém o mesmo conteúdo após validar, serializar e reabrir. `weekendTime` é uma preferência opcional HH:mm validada; só é gravada ao editar uma missão.

**Compatibilidade em sentido inverso:** versões anteriores, como 1.0.2, recusam backups novos que contenham `weekendTime`. Restaure-os na aplicação atual. Manter v1 compatível com os backups existentes não torna os validadores antigos capazes de reconhecer campos futuros.

Foram preservados byte a byte `storage.js`, `ids.js`, `data.js`, `roadmap.js` e a fixture v1, conferidos por SHA-256 contra a cópia anterior. Não houve alteração das recompensas padrão, cuidados, trilha ou mecanismos de recuperação/IDs.

As regressões confirmaram:

- mínima→normal paga apenas a diferença; cliques repetidos, compra, estorno e correção não duplicam valores;
- backup válido restaura/reabre; JSON malformado, mapas inválidos e eventos inconsistentes são recusados;
- recuperação anterior, checkpoint, prévia desatualizada e exportação da memória válida continuam funcionando;
- falha de gravação preserva os dados e o formulário e não anuncia sucesso;
- UUIDs continuam criptográficos nos contextos suportados; falha da API não deixa operação parcial.

Todos os dados são fictícios, em contextos ou perfis temporários. Não foi aberto o perfil pessoal do usuário nem sobrescrito seu progresso.

## Verificações finais

| Verificação | Resultado |
|---|---|
| `npm run check` | Aprovado. |
| `npm test` | **108 aprovados**, zero falhas/ignorados: 88 anteriores + 14 de comportamento + 6 de contraste. |
| `npm run build` | Aprovado; HTML único regenerado das fontes. |
| `python3 tests/browser_smoke.py` | Aprovado: conclusão, compra, correção, persistência, backup e mudança de dia São Paulo. |
| `python3 tests/browser_integrity.py` | **14 testes / 36 contextos aprovados**, fonte e HTML único. |
| `python3 tests/browser_opening.py` | **7 testes / 32 contextos aprovados**, loopback real, HTTP e HTTPS simulados. |
| `python3 tests/browser_accessibility.py` | **15 testes / 42 contextos aprovados**, nos dois artefatos. |
| `python3 tests/browser_zoom.py` | **2 testes / 4 perfis temporários aprovados**, zoom nativo nos dois artefatos. |
| Distribuição | ZIP do aplicativo e ZIP de auditoria atualizados; CRC e conteúdo comparados com os arquivos finais. O build é determinístico em relação ao HTML distribuído. |
| ZIP extraído | Sintaxe, 108 testes Node e build aprovados na cópia extraída; mais quatro testes de navegador em 14 contextos no servidor local da porta 5175, cobrindo os dois formatos: habilidades/XP, horários, correção e exportar/restaurar/reabrir/recuperar. |

Com Node.js 22+ e Playwright Python/Chromium disponíveis, deixe `npm start` em outro terminal e execute os comandos da tabela. Os testes Python são ferramentas de desenvolvimento, não requisitos para abrir o app.

Arquivos entregues: fontes `app.js`, `engine.js`, `style.css`; quatro arquivos novos de testes (`behavior.test.js`, `contrast.test.js`, `browser_accessibility.py`, `browser_zoom.py`); documentação atualizada; `ENTRE-TRILHAS.html`, `entre-trilhas.zip` e `auditoria-entre-trilhas.zip`. Não foram adicionadas dependências de instalação.

## Ambientes e limites

Execução real: Node.js 24.22.1, Chromium 155.0.8059.79 headless automatizado com Playwright Python 1.62.0, servidor HTTP local, aplicação modular e HTML único servido. As verificações de HTTP de rede local e HTTPS usam origens interceptadas com arquivos locais: **não verificam rede física, certificado ou handshake TLS**. O caminho `file://` permanece sem homologação funcional, após bloqueio administrativo já registrado em R0b; use o HTML servido.

Não foram testados aparelhos físicos, Safari, Firefox, leitores de tela (NVDA/VoiceOver/TalkBack), navegação por voz, alto contraste do sistema ou todas as combinações de conteúdo e preferências. Contraste é medido em amostras e pares definidos. Não há alegação de conformidade WCAG completa.

Os dados continuam apenas no navegador/origem, sem sincronização. Sem Web Locks, a orientação continua usar uma aba por vez. A agenda fixa, o cronômetro não persistente, o histórico sem paginação e os limites da trilha são os já documentados; não foram expandidos nesta etapa.

## Próxima entrega recomendada

**Separar sessões de Python da conclusão das fases (B05).** Permitir registrar duas horas de prática mesmo quando a fase exige vários dias, continuar revisões/projetos depois da fase 120 e evitar pagamento duplicado pelo mesmo esforço. Essa entrega precisa de modelo e compatibilidade de dados próprios; não foi iniciada.

Depois, manter a sequência: melhorar Hoje/unificar agenda; aprofundar sete fases; avatar/refúgio/loja; revisão semanal acolhedora. Descanso, alimentação, lazer básico e cuidados essenciais continuam independentes de moedas e sem metas crescentes automáticas.
