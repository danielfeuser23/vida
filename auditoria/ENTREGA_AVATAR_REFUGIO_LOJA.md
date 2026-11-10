# Entrega — Avatar, refúgio e loja

**10/11/2026 · America/Sao_Paulo · aplicação 1.4.0.**

**Entrega concluída e validada localmente; envio ao GitHub em preparação.** A publicação só será registrada após confirmação. Sem deploy e sem início de revisão semanal ampliada, finanças ou outras entregas.

## Base e escopo

Base publicada: `efb9b1bcf6d578fbdf5bb21f40610d46755879b2`, versão 1.3.0. Foram conferidos README, PLANO, roadmap, pesquisa e relatórios anteriores. Os 208 testes Node anteriores passaram antes da integração.

Esta fatia do roadmap transforma o personagem em ilustração personalizável e acrescenta um refúgio com três áreas e uma coleção por marcos. A Loja mantém extras pessoais com preço e horário, informa o saldo após a reserva e pede confirmação antes de marcar o consumo. Não inclui comércio de cosméticos, inventário consumível, itens aleatórios, crafting ou novos tipos de moeda.

## Personagem e refúgio

As ilustrações são SVGs autorais em `illustrations.js`, desenhadas para esta interface, sem bibliotecas, fontes, imagens externas ou rede. Há três cores de roupa, três tons de pele, três cabelos e cinco escolhas de acessório, contando a opção básica sem acessório. O editor mostra uma prévia sem gravar; salvar usa a mesma transação protegida do restante do app. Cancelar preserva os dados.

O refúgio tem biblioteca, bancada de Python e espaço do companheiro. Até três objetos mudam com a prática. O cachorro ilustrado permanece presente desde o início; sua imagem não comprova cuidados reais. Dados e critérios aparecem em cartões/textos legíveis, separados da arte.

O visual simples reduz detalhes de fundo, mantendo os marcos e as escolhas. Não há nova animação obrigatória ou som. A preferência de sons existente continua opcional e desligada por padrão. A personalização é opcional; concluir missões não ganha passos adicionais.

## Coleção por marcos

| Item | Liberação | Custo/recompensa |
|---|---|---|
| Sem acessório, roupa, pele e cabelo | Livres desde o início | Zero moedas e zero XP |
| Broche de folha | Uma missão ou sessão registrada | Zero moedas e zero XP |
| Lenço dos caminhos | Três dias de prática em uma mesma semana, sem sequência | Zero moedas e zero XP |
| Estrela de criação | Um projeto de Python concluído | Zero moedas e zero XP |
| Amuleto de retorno | Retomar após pelo menos um dia sem registro | Zero moedas e zero XP |
| Livros da jornada | Leitura registrada em três dias distintos | Zero moedas e zero XP |
| Luminária da bancada | Um projeto de Python concluído | Zero moedas e zero XP |
| Manta do companheiro | Cuidados do cachorro registrados em três dias distintos | Zero moedas e zero XP |

São sete cosméticos por marcos: quatro acessórios e três objetos. A opção básica não é outro desbloqueio. A coleção é separada dos resgates reais; não existe compra, resgate ou bônus financeiro por consultá-la. Os objetos preferidos aparecem automaticamente quando o marco fica disponível, sem botão de coleta. As cinco conquistas anteriores permanecem e há duas ligadas à leitura e ao cuidado.

Os critérios usam registros ativos e seus snapshots de habilidade, sem reinterpretá-los pela configuração atual. Pontuação zero editada não apaga uma atividade registrada. Várias missões/sessões no mesmo dia contam um único dia. A semana possível vale em qualquer semana histórica, e leitura/cuidados não exigem sequência. Sessões de Python e projetos continuam independentes de fases, inclusive depois da fase 120.

## Ausência, correções e preferências

Faltar, pausar ou mudar de semana não apaga a prática anterior. A coleção não exige uma sequência perfeita nem cria punições acumuladas.

Corrigir um registro falso ou reabrir um projeto pode retirar sua evidência e recalcular a disponibilidade. Uma preferência salva não é uma declaração de propriedade: se o acessório fica indisponível, o visual efetivo usa a opção básica; um objeto indisponível fica oculto. A preferência permanece guardada e o estado continua válido para salvar, reabrir e restaurar. Não se inventam eventos para manter um marco que foi corrigido.

O editor recusa uma nova seleção bloqueada, mas permite manter uma preferência indisponível já guardada ao editar outra característica. Isso evita prender o usuário depois de uma correção. Salvar repetidamente a mesma escolha não cria pagamentos nem eventos. Os três objetos estão inicialmente preferidos para aparecer quando seus critérios forem alcançados; isso não concede disponibilidade antecipada.

## Integridade e compatibilidade

O único campo persistido novo é `config.appearance`, opcional e completo quando presente: roupa, pele, cabelo, acessório, objetos preferidos e visual simples. São valores enumerados e uma lista única de objetos conhecidos; estruturas, campos e tipos inválidos são recusados. A validação de mapas, registros, eventos, habilidades, compras, saldos e JSON estável continua intacta.

Não muda o formato v1/v2 ou a chave `entre-trilhas-v1`; não há migração automática para personalizar. Dados antigos abrem sem acrescentar defaults nem regravar o arquivo. A ativação explícita v1→v2 preserva a preferência e a cópia anterior recuperável. **Backups com `appearance` exigem a versão 1.4.0 ou posterior**: versões anteriores podem recusá-los. Essa compatibilidade de leitura é distinta de prometer que aplicativos antigos reconhecem campos novos.

Prévia e cancelamento não gravam. Falha de quota não deve anunciar sucesso nem perder o formulário. Restauração continua validando antes de substituir o estado, preservando a cópia anterior e recusando uma prévia desatualizada. Nenhum teste acessa o progresso pessoal: dados, origens e perfis são fictícios e isolados.

## Loja e economia preservada

Os preços e limites anteriores não aumentam. Extras continuam cabendo no tempo livre calculado pela agenda; moedas não criam tempo. Alimentação, descanso, lazer básico e cuidados essenciais permanecem independentes do saldo. O estudo conserva os dois blocos de 60 minutos e a pausa adicional de dez minutos fora da contagem. Nenhum cosmético modifica XP, moedas, preço, duração, frequência ou habilidade.

Simulações de domínio:

| Cenário | Resultado esperado e conferido nos testes |
|---|---|
| Dia parcialmente cumprido | Leitura normal, Python mínimo, cachorro manhã/noite e casa: **50 XP/20 moedas**. Vídeo de 15 moedas deixa **5**, reservado 21:30–21:50. Pedido repetido não debita novamente. |
| Semana mínima | Sete sessões de 5 min: **35 min, 35 XP/14 moedas** de estudo, sem concluir fase. Os cuidados essenciais registrados acrescentam 420 XP/140 moedas; total **455 XP/154 moedas**. Não se exige cumprir todos os opcionais. |
| Semana intensa de estudo | Sete dias com duas sessões de 60 min: **840 XP/252 moedas**. Mais 15 min/dia preservam a prática extra, sem ultrapassar o teto diário. Filme de 60 moedas no domingo 14:00–16:00 deixa **192**; outra recompensa sobreposta é recusada. |
| Personalização nos três cenários | Mesmos saldos, eventos e compras; nenhuma recompensa duplicada ou saldo negativo. |

Marcar um resgate como utilizado pede confirmação. Fechar ou cancelar o diálogo mantém a reserva. Após confirmar, o consumo permanece sem estorno, conforme a regra anterior; o aviso explica isso. Compras não utilizadas continuam canceláveis com um único estorno.

## Regressões e verificações

As primeiras 31 regressões de domínio, antes da integração, tiveram 18 falhas por APIs ausentes e 13 aprovações; são evidências de cobertura nova, não 18 bugs financeiros antigos. O módulo novo tem verificação de disponibilidade, correção, idempotência, históricos v1/v2, migração/recuperação, armazenamento, JSON e continuidade após as 120 fases. Quatro simulações adicionais cobrem economia e agenda. Nenhum teste anterior foi enfraquecido.

No navegador, um snapshot publicado 1.3.0 reproduziu a ausência do refúgio (um teste/dois contextos). Depois da integração, a revisão encontrou um problema real no segundo botão de personalizar, dentro da coleção: Escape ou Salvar podia levar ao botão do cabeçalho ou recolher o grupo. A nova regressão falhou nos dois artefatos antes da correção. IDs estáveis e preservação do estado aberto do grupo corrigiram o caso, inclusive após atualização de outra aba; o alvo e a suíte completa passaram.

O novo perfil substitui os vários títulos `h1` antigos por uma hierarquia de títulos e dados mais clara. Um teste anterior de projetos dependia especificamente do `h1` do contador e falhou nos dois artefatos. Somente seus dois seletores foram trocados por `[data-stat="projects"]`, mantendo os valores esperados **1 e 0**, o texto e todas as verificações de sessões, exercícios, projetos e saldos. O cenário passou novamente. O teste novo também passou a esperar um cuidado essencial para identificar carregamento, pois sua fixture já tinha leitura concluída dentro do grupo recolhido; isso ajusta a preparação do teste, sem reduzir as verificações do produto.

| Verificação | Estado |
|---|---|
| Sintaxe e testes Node | Aprovados: **243 testes** (208 anteriores + 31 de refúgio + quatro de economia), zero falhas/ignorados. |
| Conteúdo Python | **25 testes, 128 execuções locais aprovadas**; catálogo das fases não alterado. |
| Navegador novo | **10 testes / 26 contextos ou perfis aprovados**, fonte e HTML único, após a correção de foco. Inclui v1/v2, prévia/cancelamento, bloqueios, idempotência, backup/recuperação, reabertura, ausência/correção, quota, consumo e cancelamento concorrente, teclado, 320/430 px e zoom nativo de 200%. Capturas desktop/móveis/zoom inspecionadas. |
| Navegador anterior | Smoke aprovado na fonte e HTML único; integridade **14/36**, abertura **7/32**, sessões **14/32** em rodadas 13 + 1 após o ajuste de seletor, acessibilidade **16/44**, zoom nativo **6/12**, agenda **17/36** e conteúdo **7/20** aprovados (testes/contextos ou perfis). No smoke do HTML único mudou apenas a URL em cópia temporária, mantendo todas as asserções. |
| Build, HTML único e pacotes extraídos | Aprovados: build determinístico, script do bundle sintaticamente válido; CRC e bytes de todos os arquivos conferidos. ZIP do aplicativo com 60 arquivos e auditoria com 18. Na cópia extraída, sintaxe, **243 testes Node, 25 testes Python/128 execuções e build** passaram. Quatro testes/dez contextos de navegador passaram nos dois artefatos, incluindo aparência, v1/v2, restauração, correção, quota, compra/cancelamento e consumo confirmado. Documentação final reempacotada antes do commit. |
| GitHub | Pendente de validação e confirmação do envio |

Comandos: `npm run check`, `npm test`, `npm run test:content`, `npm run build`; com `npm start` ativo, `python3 tests/browser_refuge.py` e as suítes anteriores de smoke, integridade, abertura, sessões, acessibilidade, zoom nativo, agenda e conteúdo.

A revisão independente do domínio não encontrou bloqueios nos cenários analisados. Medição exploratória local em Node 24, com 20 consultas e 365 sessões fictícias válidas: mediana de 5,95 ms para aparência e 5,11 ms para progresso. Não é benchmark de aparelho físico nem garantia de desempenho; reconstruções repetidas do histórico ainda podem ser reduzidas em uma entrega de desempenho.

## Limites e continuidade

O progresso permanece local ao navegador/perfil/origem, sem sincronização ou conta. Não há teste em aparelho físico, leitor de tela, Safari ou Firefox nem declaração de conformidade completa WCAG. Os limites anteriores de rede local/HTTPS simulados e abertura direta `file://` continuam válidos até nova verificação específica.

Não houve nova pesquisa online de produtos nesta entrega; a proposta retoma a pesquisa anterior e desenvolve arte e código autorais. Não foram adotadas bibliotecas ou ativos de terceiros. Não se implementam finanças F1–F3, novas fases, academia/corretor, PWA, sincronização ou revisão semanal ampliada.

Após encerrar este ciclo, a próxima entrega recomendada é **adicionar revisão semanal acolhedora**, com opção de manter tudo igual. Não iniciá-la automaticamente.
