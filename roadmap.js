// Trilha editável: 120 fases, com sessões propostas de 120 minutos.
// Primeiras 28 fases: quatro semanas de fundamentos; desafios são prática sugerida.
// Uma fase pode precisar de vários dias; tempo ou XP não comprovam domínio técnico.
export const roadmap = [
  {
    "id": 1,
    "world": "01 · Primeiro acampamento",
    "title": "Preparar a mochila",
    "action": "Instalar Python 3 estável, criar uma pasta de estudo e executar jornada.py.",
    "criterion": "Executar o arquivo no terminal, alterar a mensagem e executá-lo novamente.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Separe editor, arquivo e terminal: escrever não executa o programa. Use Python oficial e confirme python --version, python3 --version ou py --version.",
    "code": "print(\"Minha jornada começou!\")",
    "practice": [
      "Confirmar a versão instalada no terminal",
      "Criar e executar jornada.py",
      "Mudar a mensagem e executar de novo",
      "Localizar o arquivo usando o explorador",
      "Provocar e corrigir uma aspa ausente"
    ]
  },
  {
    "id": 2,
    "world": "01 · Primeiro acampamento",
    "title": "Mensagens que fazem sentido",
    "action": "Usar print para criar uma apresentação e uma lista textual de hábitos.",
    "criterion": "O script mostra cinco mensagens, acentos e uma linha em branco sem erro.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Textos ficam entre aspas. print pode receber vários valores; uma nova chamada normalmente começa outra linha.",
    "code": "print(\"Leitura\", \"Casa\", \"Python\", sep=\" · \")",
    "practice": [
      "Imprimir três hábitos em linhas separadas",
      "Mostrar uma frase com acentos",
      "Criar uma linha em branco entre blocos",
      "Usar sep para separar três habilidades",
      "Usar end para continuar uma mensagem na mesma linha"
    ]
  },
  {
    "id": 3,
    "world": "01 · Primeiro acampamento",
    "title": "Variáveis do cotidiano",
    "action": "Criar variáveis para nome, minutos de leitura, passeios e moedas; mudar seus valores.",
    "criterion": "Mostrar o estado antes e depois de atualizar minutos e explicar cada nome escolhido.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Uma variável é um nome associado a um valor. Use nomes claros em snake_case; = atribui e não compara.",
    "code": "minutos_lidos = 10\nminutos_lidos = minutos_lidos + 5\nprint(minutos_lidos)",
    "practice": [
      "Guardar minutos e imprimir o valor",
      "Atualizar minutos sem repetir o número anterior",
      "Criar nomes em snake_case para cinco dados",
      "Trocar uma variável de texto por outro texto",
      "Explicar a diferença entre o nome e o valor de uma variável"
    ]
  },
  {
    "id": 4,
    "world": "01 · Primeiro acampamento",
    "title": "Contas de uma jornada",
    "action": "Calcular pontos, tempo disponível, divisão inteira e resto com números inteiros.",
    "criterion": "Conferir manualmente cinco contas e distinguir /, // e %.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "/ faz divisão comum, // obtém divisão inteira e % devolve o resto. Use inteiros para contar moedas virtuais.",
    "code": "pontos = 15 * 2\nnivel = pontos // 100 + 1\nprint(pontos, nivel)",
    "practice": [
      "Somar pontos de cinco atividades",
      "Calcular minutos livres entre 19h e 21h",
      "Converter 125 minutos em horas e resto",
      "Calcular quantas compras de 15 cabem em 47 moedas",
      "Conferir prioridade de operações com e sem parênteses"
    ]
  },
  {
    "id": 5,
    "world": "01 · Primeiro acampamento",
    "title": "Trabalhe com palavras",
    "action": "Montar frases com f-string e limpar nomes de hábitos usando strip e casefold.",
    "criterion": "Exibir nome e pontos na mesma frase; comparar uma entrada limpa com a original.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Strings são imutáveis: métodos devolvem novos textos. Preserve o nome exibido e use outra variável para a comparação.",
    "code": "nome = \" Leitura \"\nchave = nome.strip().casefold()\nprint(f\"Hábito: {chave}\")",
    "practice": [
      "Montar uma frase com nome e saldo",
      "Remover espaços das bordas de um nome",
      "Comparar nomes com maiúsculas diferentes",
      "Contar caracteres com len",
      "Trocar uma palavra com replace preservando o original"
    ]
  },
  {
    "id": 6,
    "world": "01 · Primeiro acampamento",
    "title": "Receba informações",
    "action": "Pedir nome e minutos com input; converter minutos para int antes de calcular pontos.",
    "criterion": "Entrar com 12 produz 24 pontos e explicar o que acontece com texto não numérico.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "input retorna str. Converta apenas o campo que representa um número. Vamos tratar entradas inválidas em fase posterior.",
    "code": "minutos = int(input(\"Minutos praticados: \"))\nprint(f\"Pontos: {minutos * 2}\")",
    "practice": [
      "Pedir o nome e dar boas-vindas",
      "Converter minutos digitados para inteiro",
      "Somar duas entradas numéricas",
      "Experimentar uma entrada vazia e explicar a falha",
      "Anotar o tipo de cada valor antes e depois da conversão"
    ]
  },
  {
    "id": 7,
    "world": "01 · Primeiro acampamento",
    "title": "Revisão da primeira semana",
    "action": "Recriar um boletim de hábitos com entradas, cálculos e mensagens sem copiar o arquivo anterior.",
    "criterion": "Conferir três entradas diferentes e anotar pelo menos uma dúvida ou correção.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Comece de um arquivo vazio e consulte suas notas depois da primeira tentativa. Revisar não é perder uma fase.",
    "practice": [
      "Recriar um boletim sem copiar",
      "Conferir o total com papel e lápis",
      "Experimentar minutos iguais a zero",
      "Melhorar nomes de três variáveis",
      "Explicar em voz alta as linhas do programa"
    ]
  },
  {
    "id": 8,
    "world": "01 · Primeiro acampamento",
    "title": "Comparações e limites",
    "action": "Comparar minutos com uma meta e testar igualdade, diferença e os limites da meta.",
    "criterion": "Prever e conferir resultados de cinco expressões booleanas.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "== compara valores; = atribui. >= inclui o limite. True e False são os dois valores booleanos.",
    "code": "meta = 10\nfor minutos in [0, 5, 10, 15]:\n    print(minutos, minutos >= meta)",
    "practice": [
      "Prever o resultado de cinco comparações",
      "Comparar meta exata e um minuto abaixo",
      "Distinguir == de != com nomes",
      "Comparar números negativos e zero",
      "Guardar o resultado booleano em uma variável"
    ]
  },
  {
    "id": 9,
    "world": "01 · Primeiro acampamento",
    "title": "Escolha com if e else",
    "action": "Classificar uma leitura como meta atingida ou ainda pendente usando if/else.",
    "criterion": "Testar valores abaixo, iguais e acima da meta; as mensagens correspondem à regra.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "A indentação define o bloco. Use quatro espaços e mantenha a condição pequena antes de adicionar mais decisões.",
    "practice": [
      "Mostrar mensagens para leitura abaixo da meta",
      "Testar a meta exata",
      "Testar um valor maior que a meta",
      "Adicionar uma decisão para saldo suficiente",
      "Corrigir um erro de indentação criado de propósito"
    ]
  },
  {
    "id": 10,
    "world": "01 · Primeiro acampamento",
    "title": "Normal, mínimo e pendente",
    "action": "Usar if/elif/else para diferenciar as três versões de uma missão.",
    "criterion": "As entradas 0, 5 e 25 são classificadas corretamente, incluindo os limites.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Uma cadeia if/elif executa o primeiro bloco verdadeiro. Teste o limite maior antes do menor.",
    "practice": [
      "Classificar 0, 5 e 25 minutos",
      "Testar os vizinhos de cada limite",
      "Aplicar três faixas à leitura",
      "Aplicar três faixas à organização",
      "Explicar por que a ordem dos elif importa"
    ]
  },
  {
    "id": 11,
    "world": "01 · Primeiro acampamento",
    "title": "Combine condições",
    "action": "Usar and, or e not para validar nome, minutos e uma escolha de dia de estudo.",
    "criterion": "Construir e conferir uma tabela com pelo menos seis combinações.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "and exige ambas condições; or aceita ao menos uma. Parênteses ajudam a tornar a intenção legível.",
    "practice": [
      "Validar nome e minutos ao mesmo tempo",
      "Aceitar sábado ou domingo com or",
      "Inverter uma pausa com not",
      "Comparar duas expressões usando parênteses",
      "Construir uma tabela de seis combinações booleanas"
    ]
  },
  {
    "id": 12,
    "world": "01 · Primeiro acampamento",
    "title": "Desafio das decisões",
    "action": "Resolver classificadores de leitura, exercício e pontos sem consultar uma solução pronta.",
    "criterion": "Cada classificador passa em três exemplos preparados antes da implementação.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Escreva os exemplos de entrada e saída primeiro. Só depois transforme a regra em if/elif/else.",
    "practice": [
      "Definir exemplos antes de escrever o classificador",
      "Classificar três durações de leitura",
      "Classificar três durações de atividade física",
      "Calcular recompensa mínima e normal sem duplicar",
      "Revisar mensagens para que uma pausa não pareça punição"
    ]
  },
  {
    "id": 13,
    "world": "01 · Primeiro acampamento",
    "title": "Laços com for",
    "action": "Usar for e range para listar dias, repetir mensagens e acumular pontos de atividades.",
    "criterion": "Listar sete dias e somar 5, 10 e 15 para obter 30.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "range(1, 8) inclui 1 e para antes de 8. Um acumulador começa antes do laço.",
    "code": "total = 0\nfor pontos in [5, 10, 15]:\n    total += pontos\nprint(total)",
    "practice": [
      "Listar dias de 1 a 7",
      "Somar pontos de cinco atividades",
      "Contar quantos valores são maiores que zero",
      "Imprimir a tabuada de 2 com range",
      "Comparar range(7) com range(1, 8)"
    ]
  },
  {
    "id": 14,
    "world": "01 · Primeiro acampamento",
    "title": "Revisão da segunda semana",
    "action": "Combinar laços e decisões para listar sete dias e identificar quais alcançaram uma meta.",
    "criterion": "O relatório conta os dias válidos e o resultado é conferido manualmente.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Revise primeiro com poucos valores. Quando o laço funciona para três itens, teste sete e uma entrada vazia.",
    "practice": [
      "Resumir sete valores de prática",
      "Contar dias com pelo menos o mínimo",
      "Somar só valores positivos",
      "Conferir uma semana toda zerada",
      "Reescrever um laço sem olhar as notas"
    ]
  },
  {
    "id": 15,
    "world": "02 · Trilhas e ferramentas",
    "title": "Repetir até sair",
    "action": "Criar menu com while, opção sair e tratamento de escolha desconhecida.",
    "criterion": "O menu aceita duas ações, mostra ajuda para uma opção inválida e encerra normalmente.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "while repete enquanto a condição for verdadeira. Deixe a saída evidente e evite laços sem pausa nem término.",
    "practice": [
      "Criar menu com três opções",
      "Fazer opção desconhecida mostrar ajuda",
      "Encerrar com a palavra sair",
      "Pedir entrada novamente após erro",
      "Explicar o que impediria um laço infinito"
    ]
  },
  {
    "id": 16,
    "world": "02 · Trilhas e ferramentas",
    "title": "Listas de hábitos",
    "action": "Criar, percorrer, adicionar e remover hábitos de uma lista.",
    "criterion": "Quatro hábitos aparecem na ordem esperada e uma remoção reduz len corretamente.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Uma list guarda uma sequência mutável. append acrescenta ao final; não remova itens enquanto percorre a mesma lista.",
    "practice": [
      "Adicionar um hábito com append",
      "Remover um hábito existente",
      "Verificar existência antes de remover",
      "Percorrer uma lista vazia",
      "Contar hábitos antes e depois de uma alteração"
    ]
  },
  {
    "id": 17,
    "world": "02 · Trilhas e ferramentas",
    "title": "Índices, fatias e cópias",
    "action": "Selecionar primeiro, último e os três primeiros itens; comparar atribuição e cópia de lista.",
    "criterion": "Testar lista curta e vazia, e explicar quando alterar uma referência afeta a outra.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Índices começam em zero. Uma fatia aceita limites maiores; acessar itens[0] exige que exista um item.",
    "practice": [
      "Selecionar primeiro e último hábito",
      "Obter os três primeiros com fatia",
      "Testar uma lista com um único item",
      "Comparar atribuição e list.copy",
      "Alterar uma cópia sem mudar a lista original"
    ]
  },
  {
    "id": 18,
    "world": "02 · Trilhas e ferramentas",
    "title": "Dicionários de registros",
    "action": "Criar um hábito com nome, minutos e concluido; consultar e atualizar cada campo.",
    "criterion": "Uma lista de três registros é percorrida e somente os concluídos entram no total.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "dict relaciona chaves a valores. Use get para um campo opcional e validação explícita para campos obrigatórios.",
    "practice": [
      "Criar três registros com as mesmas chaves",
      "Atualizar a conclusão de um registro",
      "Somar somente os concluídos",
      "Ler um campo opcional com get",
      "Tratar um campo obrigatório ausente de forma explícita"
    ]
  },
  {
    "id": 19,
    "world": "02 · Trilhas e ferramentas",
    "title": "Conjuntos e tuplas",
    "action": "Usar set para habilidades únicas e tuple para um intervalo de horários.",
    "criterion": "Obter interseção entre duas semanas e desempacotar início/fim de um intervalo.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Um conjunto expressa unicidade e não uma ordem de tela. Tuplas servem a pequenos grupos de valores que não precisam mudar.",
    "practice": [
      "Remover habilidades repetidas com set",
      "Calcular interseção entre semanas",
      "Calcular diferença entre duas listas de habilidades",
      "Desempacotar dois horários de uma tupla",
      "Ordenar um conjunto para exibição"
    ]
  },
  {
    "id": 20,
    "world": "02 · Trilhas e ferramentas",
    "title": "Funções reutilizáveis",
    "action": "Escrever calcular_pontos(minutos), retornar um inteiro e chamar em três lugares.",
    "criterion": "A função funciona com 0, 5 e 15 sem pedir input nem depender de variável global.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "return entrega um resultado ao chamador; print apenas exibe. Separe cálculo e interação para facilitar testes.",
    "code": "def calcular_pontos(minutos):\n    return minutos * 2\n\nprint(calcular_pontos(15))",
    "practice": [
      "Retornar pontos para 0, 5 e 15",
      "Usar o retorno dentro de uma soma",
      "Criar uma segunda função de saudação",
      "Remover um input de dentro do cálculo",
      "Explicar a diferença entre retornar e imprimir"
    ]
  },
  {
    "id": 21,
    "world": "02 · Trilhas e ferramentas",
    "title": "Revisão da terceira semana",
    "action": "Refazer um catálogo de hábitos com lista, dicionários e uma função que soma concluídos.",
    "criterion": "Conferir catálogo vazio, um hábito pendente e dois concluídos com resultado esperado.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Escolha a estrutura pela necessidade. A revisão vale por praticar e entender, não por escrever rápido.",
    "practice": [
      "Somar catálogo vazio",
      "Somar apenas um hábito concluído",
      "Ignorar um hábito pendente",
      "Recriar a função sem consultar o original",
      "Anotar uma dúvida e resolvê-la com um exemplo menor"
    ]
  },
  {
    "id": 22,
    "world": "02 · Trilhas e ferramentas",
    "title": "Parâmetros e valores padrão",
    "action": "Adicionar meta e multiplicador como parâmetros e usar argumentos nomeados.",
    "criterion": "Chamadas com valores padrão e personalizados produzem resultados previstos.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Evite listas e dicionários mutáveis como parâmetros padrão. Para um valor que será criado a cada chamada, use None.",
    "practice": [
      "Usar multiplicador padrão",
      "Passar multiplicador por nome",
      "Definir meta personalizada",
      "Comparar parâmetros e argumentos",
      "Corrigir um parâmetro padrão mutável em um exemplo pequeno"
    ]
  },
  {
    "id": 23,
    "world": "02 · Trilhas e ferramentas",
    "title": "Retornos e escopo",
    "action": "Criar avaliar_habito que devolve versão e pontos; desempacotar o retorno no chamador.",
    "criterion": "Três entradas retornam resultados corretos e variáveis locais não vazam para fora da função.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Uma função pode retornar uma tupla. Dados necessários devem entrar por parâmetros e resultados devem sair por return.",
    "practice": [
      "Retornar versão e pontos",
      "Desempacotar o retorno em duas variáveis",
      "Testar zero e dois limites",
      "Demonstrar uma variável local",
      "Eliminar a dependência de uma variável global"
    ]
  },
  {
    "id": 24,
    "world": "02 · Trilhas e ferramentas",
    "title": "Separe em módulos",
    "action": "Criar regras.py e jornada.py, importando funções de cálculo sem iniciar o menu.",
    "criterion": "Importar regras não pede input e executar jornada inicia a interface.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Use if __name__ == \"__main__\": para iniciar o programa somente em execução direta.",
    "practice": [
      "Importar uma função de regras.py",
      "Importar sem iniciar o menu",
      "Executar jornada.py diretamente",
      "Renomear um módulo para evitar conflito com biblioteca padrão",
      "Explicar a função de __name__"
    ]
  },
  {
    "id": 25,
    "world": "02 · Trilhas e ferramentas",
    "title": "Ambiente próprio do projeto",
    "action": "Criar .venv com python -m venv, ativar e conferir o executável utilizado.",
    "criterion": "O caminho de sys.executable aponta para .venv e você consegue sair do ambiente.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "O ambiente virtual isola pacotes; ele não guarda seu código. Não versione .venv e prefira python -m pip.",
    "code": "import sys\nprint(sys.executable)",
    "practice": [
      "Criar e ativar .venv",
      "Conferir sys.executable",
      "Executar python -m pip --version",
      "Desativar e ativar o ambiente de novo",
      "Adicionar .venv ao ignore do projeto de estudo"
    ]
  },
  {
    "id": 26,
    "world": "02 · Trilhas e ferramentas",
    "title": "Arquivos e caminhos",
    "action": "Usar pathlib e with para gravar e ler uma nota em UTF-8 numa pasta de dados de teste.",
    "criterion": "Texto com acentos é recuperado e o caminho não depende de barras específicas de um sistema.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Path combina partes de caminhos. O modo w sobrescreve o arquivo; experimente sempre em arquivos descartáveis.",
    "practice": [
      "Criar pasta de dados com Path.mkdir",
      "Gravar texto com acentos",
      "Ler e conferir a nota",
      "Combinar pasta e nome de arquivo com Path",
      "Demonstrar em arquivo descartável que w sobrescreve"
    ]
  },
  {
    "id": 27,
    "world": "02 · Trilhas e ferramentas",
    "title": "JSON e erros esperados",
    "action": "Salvar três hábitos em JSON e tratar arquivo ausente ou conteúdo inválido sem apagar o original.",
    "criterion": "Fechar e reabrir recupera a lista; cada falha esperada produz orientação distinta.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "JSON guarda tipos simples. Capture FileNotFoundError e JSONDecodeError separadamente; não transforme todo erro em diário vazio.",
    "practice": [
      "Salvar uma lista em JSON legível",
      "Carregar e comparar os dados",
      "Tratar arquivo inexistente",
      "Tratar JSON quebrado sem apagá-lo",
      "Validar um campo antes de aceitar o backup"
    ]
  },
  {
    "id": 28,
    "world": "02 · Trilhas e ferramentas",
    "title": "Projeto: diário de pontos",
    "action": "Integrar catálogo, cálculo, menu e salvamento em um pequeno diário de hábitos no terminal.",
    "criterion": "Registrar hábito, consultar total, fechar/reabrir e restaurar cópia sem duplicar registros.",
    "minutes": 120,
    "exercises": 5,
    "project": true,
    "tip": "Este marco pode usar várias sessões de duas horas. Entregar uma parte compreendida vale mais que copiar um sistema inteiro.",
    "practice": [
      "Registrar dois hábitos pelo menu",
      "Conferir total de concluídos",
      "Fechar e reabrir mantendo dados",
      "Exportar e restaurar uma cópia de teste",
      "Refazer uma operação para verificar que não duplica pontos"
    ]
  },
  {
    "id": 29,
    "world": "03 · Memória e recuperação",
    "title": "Entrada que pode falhar",
    "action": "Repetir a entrada de minutos ao receber texto não numérico e recusar valores negativos.",
    "criterion": "Testar \"abc\", -1, 0 e 15; apenas entradas válidas são aceitas.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Separe a conversão int, que pode gerar ValueError, da validação da faixa. Uma mensagem deve dizer como corrigir a entrada.",
    "practice": [
      "Aceitar um inteiro positivo",
      "Recusar texto alfabético",
      "Recusar número negativo",
      "Aceitar zero conforme a regra",
      "Repetir pergunta depois de erro sem encerrar o programa"
    ]
  },
  {
    "id": 30,
    "world": "03 · Memória e recuperação",
    "title": "Valide antes de salvar",
    "action": "Criar validar_registro que exige nome não vazio, minutos não negativos e habilidade conhecida.",
    "criterion": "Três registros inválidos são rejeitados antes de qualquer escrita no arquivo.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Falhe cedo com ValueError e mensagens precisas. Dados lidos de arquivos também precisam de validação.",
    "practice": [
      "Recusar nome vazio",
      "Recusar minutos negativos",
      "Recusar habilidade desconhecida",
      "Validar registro vindo de JSON",
      "Verificar que nenhuma escrita ocorre antes da validação"
    ]
  },
  {
    "id": 31,
    "world": "03 · Memória e recuperação",
    "title": "Datas com contexto",
    "action": "Criar registros com data local usando datetime e ZoneInfo(\"America/Sao_Paulo\").",
    "criterion": "Mostrar o instante com fuso e a data usada para agrupar hábitos; explicar a diferença para UTC.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Use datetime.now(ZoneInfo(\"America/Sao_Paulo\")). Datas sem fuso podem atribuir uma ação ao dia errado.",
    "practice": [
      "Criar data com fuso São Paulo",
      "Comparar data local e UTC perto da meia-noite",
      "Agrupar dois registros pelo dia local",
      "Serializar instante em formato ISO",
      "Testar data fixa sem esperar o relógio real"
    ]
  },
  {
    "id": 32,
    "world": "03 · Memória e recuperação",
    "title": "Histórico em CSV",
    "action": "Exportar nome, data e pontos para CSV usando csv.DictWriter e ler com DictReader.",
    "criterion": "Nomes com vírgula e acentos são recuperados corretamente.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Use o módulo csv em vez de concatenar vírgulas. Abra com newline=\"\" para evitar linhas extras em certos sistemas.",
    "practice": [
      "Exportar dois hábitos para CSV",
      "Ler um nome com vírgula",
      "Preservar acentos",
      "Tratar cabeçalho inesperado",
      "Conferir que a soma exportada coincide com a original"
    ]
  },
  {
    "id": 33,
    "world": "03 · Memória e recuperação",
    "title": "Rastreie erros úteis",
    "action": "Adicionar logging para carregamento e gravação, sem registrar dados privados completos.",
    "criterion": "Uma falha forçada gera uma mensagem com contexto e o programa apresenta orientação ao usuário.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "logging.exception inclui a pilha quando usado dentro do except. Não registre tokens, senhas ou o conteúdo inteiro de backups.",
    "practice": [
      "Registrar início e fim de gravação",
      "Forçar falha em caminho de teste",
      "Incluir contexto sem dados privados",
      "Separar mensagem de usuário e detalhe técnico",
      "Verificar que tokens fictícios não aparecem no log"
    ]
  },
  {
    "id": 34,
    "world": "03 · Memória e recuperação",
    "title": "Uma gravação mais segura",
    "action": "Gravar JSON em arquivo temporário na mesma pasta e substituir o destino com Path.replace.",
    "criterion": "Interromper antes da substituição preserva o diário anterior; uma execução completa grava a versão nova.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Substituição no mesmo sistema de arquivos reduz o risco de arquivo parcial. Backups continuam necessários.",
    "practice": [
      "Gravar arquivo temporário na mesma pasta",
      "Interromper antes de substituir",
      "Conferir que o anterior continua válido",
      "Substituir após gravação completa",
      "Limpar temporário abandonado de teste"
    ]
  },
  {
    "id": 35,
    "world": "03 · Memória e recuperação",
    "title": "Revisão: recuperação",
    "action": "Simular arquivo ausente, JSON inválido e um registro com campo faltando.",
    "criterion": "Cada falha produz uma mensagem distinta sem apagar o arquivo original.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Recuperar não significa silenciar. Preserve dados inválidos para diagnóstico e ofereça restauração de uma cópia válida.",
    "practice": [
      "Simular arquivo ausente",
      "Simular JSON truncado",
      "Simular chave obrigatória ausente",
      "Preservar o original inválido",
      "Apresentar orientação distinta para cada falha"
    ]
  },
  {
    "id": 36,
    "world": "03 · Memória e recuperação",
    "title": "Projeto: diário persistente",
    "action": "Adicionar salvamento, carregamento e exportação ao menu de hábitos.",
    "criterion": "Fechar e reabrir preserva dois registros; exportar e importar recupera os mesmos totais.",
    "minutes": 120,
    "exercises": 5,
    "project": true,
    "tip": "Teste com uma pasta de dados descartável. Nunca use sua única cópia pessoal para experimentar uma migração.",
    "practice": [
      "Salvar e reabrir dois registros",
      "Exportar uma cópia legível",
      "Restaurar em outra pasta",
      "Comparar totais antes e depois",
      "Escrever passos manuais de recuperação"
    ]
  },
  {
    "id": 37,
    "world": "04 · Oficina de confiança",
    "title": "Primeiras asserções",
    "action": "Escrever testes com unittest para três valores de pontos_por_minuto.",
    "criterion": "python -m unittest executa três casos e uma regra quebrada faz pelo menos um falhar.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Um teste deve comparar o resultado com um valor esperado calculado de forma independente; não copie a própria implementação.",
    "practice": [
      "Testar entrada zero",
      "Testar entrada cinco",
      "Testar entrada quinze",
      "Quebrar o multiplicador e observar falha",
      "Restaurar a regra e executar novamente"
    ]
  },
  {
    "id": 38,
    "world": "04 · Oficina de confiança",
    "title": "Casos de borda",
    "action": "Testar zero, número negativo e o limite exato entre missão mínima e normal.",
    "criterion": "Os testes descrevem claramente quais entradas são válidas e quais geram ValueError.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Casos nos limites encontram erros que exemplos comuns não mostram. Defina a regra antes de codificar a asserção.",
    "practice": [
      "Testar exatamente o mínimo",
      "Testar um abaixo do mínimo",
      "Testar exatamente a meta normal",
      "Testar entrada negativa",
      "Conferir o tipo de exceção esperado"
    ]
  },
  {
    "id": 39,
    "world": "04 · Oficina de confiança",
    "title": "Arquivos de teste isolados",
    "action": "Usar tempfile.TemporaryDirectory para testar salvar e carregar sem tocar em dados reais.",
    "criterion": "O teste restaura dois hábitos e remove sua pasta temporária no final.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Receber o caminho como argumento torna o código testável sem alterar variáveis globais.",
    "practice": [
      "Criar diretório temporário por teste",
      "Salvar dois registros",
      "Ler e comparar estruturas",
      "Conferir limpeza no final",
      "Verificar que o caminho pessoal nunca foi usado"
    ]
  },
  {
    "id": 40,
    "world": "04 · Oficina de confiança",
    "title": "Organize casos com pytest",
    "action": "Instalar pytest no .venv e converter um teste para parametrização.",
    "criterion": "python -m pytest mostra os casos executados; cada entrada tem um resultado esperado legível.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Use pytest.mark.parametrize para exemplos da mesma regra, sem esconder diferenças relevantes em um laço único.",
    "practice": [
      "Instalar pytest no ambiente virtual",
      "Parametrizar três entradas",
      "Dar nome aos casos de limite",
      "Provocar uma falha e ler a saída",
      "Executar somente o teste alterado"
    ]
  },
  {
    "id": 41,
    "world": "04 · Oficina de confiança",
    "title": "Anote seus contratos",
    "action": "Adicionar tipos a calcular_pontos e validar_registro; definir retorno explícito.",
    "criterion": "O código executa como antes e você explica que anotações não validam valores em tempo de execução.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Use int, str, list[str] e dict[str, int] quando apropriado. Tipos documentam relações entre entradas e saídas.",
    "practice": [
      "Anotar parâmetros e retorno",
      "Anotar uma lista de nomes",
      "Anotar um dicionário de pontos",
      "Mostrar que anotação não valida entrada",
      "Remover uma anotação imprecisa e escolher contrato melhor"
    ]
  },
  {
    "id": 42,
    "world": "04 · Oficina de confiança",
    "title": "Cheque os tipos",
    "action": "Instalar e executar mypy em um módulo pequeno; corrigir uma chamada com tipo errado.",
    "criterion": "A análise falha para uma string onde se espera int e passa após a correção.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "A verificação estática complementa testes. Evite silenciar erros com Any antes de entender o contrato.",
    "practice": [
      "Executar mypy no módulo de cálculo",
      "Introduzir chamada com string",
      "Ler a mensagem de erro",
      "Corrigir a origem do valor",
      "Comparar erro estático com erro de execução"
    ]
  },
  {
    "id": 43,
    "world": "04 · Oficina de confiança",
    "title": "Dados bem definidos",
    "action": "Criar uma dataclass Registro com nome, minutos e habilidade; escrever sua conversão para JSON.",
    "criterion": "Instanciar dois registros e restaurar um deles a partir de um dicionário validado.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "dataclass reduz código de inicialização. A validação ainda deve ser explícita; um tipo anotado não impede uma entrada incorreta.",
    "practice": [
      "Instanciar dois Registro",
      "Comparar registros iguais",
      "Converter registro em dicionário",
      "Validar antes de restaurar",
      "Preservar nomes com acentos na serialização"
    ]
  },
  {
    "id": 44,
    "world": "04 · Oficina de confiança",
    "title": "Dependências substituíveis",
    "action": "Passar uma função relogio para registrar_habito e usar uma data fixa no teste.",
    "criterion": "O teste de mudança de dia é determinístico, sem esperar o relógio real.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Injetar uma dependência simples costuma ser mais claro do que remendar várias funções globais.",
    "practice": [
      "Passar relógio como argumento",
      "Fixar data no teste",
      "Simular virada de dia",
      "Testar horário perto de meia-noite",
      "Remover dependência do relógio global"
    ]
  },
  {
    "id": 45,
    "world": "04 · Oficina de confiança",
    "title": "Duble de serviço",
    "action": "Usar unittest.mock para simular uma exportação indisponível e verificar a mensagem de erro.",
    "criterion": "O teste não acessa rede e confere tanto o argumento enviado quanto o tratamento de falha.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Substitua a dependência na fronteira do módulo que a usa. Não simule a própria regra que deveria ser testada.",
    "practice": [
      "Simular exportador indisponível",
      "Verificar argumento enviado",
      "Conferir mensagem de erro",
      "Garantir ausência de acesso à rede",
      "Testar sucesso com o mesmo contrato"
    ]
  },
  {
    "id": 46,
    "world": "04 · Oficina de confiança",
    "title": "Cobertura com propósito",
    "action": "Medir cobertura dos testes e adicionar um caso para uma decisão de negócio ainda não exercitada.",
    "criterion": "O novo teste detecta um erro real introduzido nessa decisão; registrar a cobertura sem exigir 100%.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Cobertura mostra execução, não qualidade. Prefira testar invariantes como saldo não negativo a perseguir uma porcentagem.",
    "practice": [
      "Medir cobertura da suíte",
      "Encontrar decisão não exercitada",
      "Adicionar caso que atravesse a decisão",
      "Introduzir falha nessa regra",
      "Conferir que o novo teste detecta a falha"
    ]
  },
  {
    "id": 47,
    "world": "04 · Oficina de confiança",
    "title": "Revisão: teste uma correção",
    "action": "Escrever um teste que reproduz XP duplicado por duas conclusões do mesmo registro e corrigir a regra.",
    "criterion": "O teste falha antes e passa depois; repetir a ação mantém o total.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Este é um pequeno ciclo de regressão: reproduzir, corrigir e preservar o teste para evitar a volta do erro.",
    "practice": [
      "Reproduzir conclusão duplicada",
      "Executar teste antes da correção",
      "Garantir um ID por ocorrência",
      "Repetir conclusão sem alterar total",
      "Testar upgrade mínimo para normal apenas pela diferença"
    ]
  },
  {
    "id": 48,
    "world": "04 · Oficina de confiança",
    "title": "Projeto: motor confiável",
    "action": "Extrair o cálculo e a persistência em módulos tipados com testes de duplicidade e restauração.",
    "criterion": "A suíte executa casos válidos, inválidos e duplicados em diretório temporário.",
    "minutes": 120,
    "exercises": 5,
    "project": true,
    "tip": "Escreva no README quais invariantes a suíte protege. O número de testes importa menos do que os comportamentos demonstrados.",
    "practice": [
      "Extrair cálculo em módulo próprio",
      "Tipar a fronteira de persistência",
      "Testar restauração válida",
      "Testar duplicidade",
      "Documentar invariantes protegidas pela suíte"
    ]
  },
  {
    "id": 49,
    "world": "05 · Guilda dos objetos",
    "title": "Um objeto com responsabilidade",
    "action": "Criar uma classe Carteira com saldo e métodos creditar e debitar.",
    "criterion": "Dois créditos e um débito resultam no saldo esperado; débito maior que o saldo é recusado.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Uma classe faz sentido quando reúne estado e regras que precisam permanecer consistentes.",
    "practice": [
      "Creditar dez moedas",
      "Debitar quatro e obter seis",
      "Recusar débito acima do saldo",
      "Recusar débito negativo",
      "Conferir saldo após cada tentativa inválida"
    ]
  },
  {
    "id": 50,
    "world": "05 · Guilda dos objetos",
    "title": "Encapsule invariantes",
    "action": "Impedir crédito negativo e expor saldo por propriedade somente leitura.",
    "criterion": "Chamadas inválidas não mudam saldo e o uso público não precisa tocar em atributos internos.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "O prefixo _ indica detalhe interno por convenção. A proteção principal vem de uma API pequena e de testes.",
    "practice": [
      "Recusar crédito negativo",
      "Expor saldo por property",
      "Testar instâncias independentes",
      "Evitar setter público de saldo",
      "Explicar a convenção do prefixo sublinhado"
    ]
  },
  {
    "id": 51,
    "world": "05 · Guilda dos objetos",
    "title": "Composição primeiro",
    "action": "Criar Personagem que recebe uma Carteira e um catálogo de habilidades.",
    "criterion": "Trocar a carteira por uma nova instância não exige alterar o cálculo de XP.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Composição expressa \"tem uma\". Evite criar uma hierarquia quando basta receber um colaborador.",
    "practice": [
      "Criar personagem com carteira recebida",
      "Usar carteira de teste",
      "Trocar catálogo sem mudar carteira",
      "Testar dois personagens isolados",
      "Desenhar a relação de composição"
    ]
  },
  {
    "id": 52,
    "world": "05 · Guilda dos objetos",
    "title": "Herança em um caso pequeno",
    "action": "Implementar duas estratégias de recompensa com uma interface base e comparar com funções simples.",
    "criterion": "As estratégias podem ser usadas pelo mesmo chamador; documentar quando a classe não trouxe benefício.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Herança deve preservar o contrato da base. Não use classes só para agrupar uma única função sem estado.",
    "practice": [
      "Implementar estratégia fixa",
      "Implementar estratégia por duração",
      "Usar ambas pelo mesmo contrato",
      "Comparar com funções sem estado",
      "Explicar se a herança foi necessária"
    ]
  },
  {
    "id": 53,
    "world": "05 · Guilda dos objetos",
    "title": "Protocolos de comportamento",
    "action": "Definir um Protocol Repositorio com salvar e listar; criar versões em memória e JSON.",
    "criterion": "O mesmo serviço funciona com ambas sem verificar o tipo concreto.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "typing.Protocol descreve o que um objeto sabe fazer. A compatibilidade é estrutural: os métodos precisam corresponder.",
    "practice": [
      "Definir Protocol de repositório",
      "Criar implementação em memória",
      "Criar implementação em JSON",
      "Executar o mesmo serviço com ambas",
      "Checar o contrato com mypy"
    ]
  },
  {
    "id": 54,
    "world": "05 · Guilda dos objetos",
    "title": "Igualdade e representação",
    "action": "Criar um identificador imutável de missão e observar __repr__ e __eq__ gerados por dataclass.",
    "criterion": "Dois identificadores de mesmo valor comparam iguais e aparecem claramente em uma falha de teste.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Use frozen=True para valores que não deveriam mudar. Identidade do objeto e igualdade de valor são conceitos distintos.",
    "practice": [
      "Comparar IDs de mesmo valor",
      "Comparar IDs de valor diferente",
      "Inspecionar repr de registro",
      "Tentar alterar valor frozen",
      "Separar igualdade de identidade com is"
    ]
  },
  {
    "id": 55,
    "world": "05 · Guilda dos objetos",
    "title": "Métodos especiais úteis",
    "action": "Implementar __len__ e __iter__ em uma coleção pequena de registros.",
    "criterion": "len e um for funcionam sem expor a lista interna diretamente.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Os métodos especiais integram seu objeto ao protocolo da linguagem. Mantenha seu comportamento surpreendentemente simples.",
    "practice": [
      "Implementar len da coleção",
      "Percorrer com for",
      "Aceitar coleção vazia",
      "Usar a coleção em uma soma",
      "Evitar expor a lista interna como estado mutável"
    ]
  },
  {
    "id": 56,
    "world": "05 · Guilda dos objetos",
    "title": "Exceções do domínio",
    "action": "Criar SaldoInsuficiente e ResgateJaUtilizado e tratar cada uma na camada de interface.",
    "criterion": "Os testes distinguem falhas de regra de erros de arquivo ou de programação.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Uma exceção de domínio comunica uma decisão do produto; evite capturar Exception para transformar todo erro na mesma mensagem.",
    "practice": [
      "Criar SaldoInsuficiente",
      "Criar ResgateJaUtilizado",
      "Tratar cada erro com mensagem própria",
      "Deixar erro de arquivo seguir outro fluxo",
      "Testar que falha de domínio não altera saldo"
    ]
  },
  {
    "id": 57,
    "world": "05 · Guilda dos objetos",
    "title": "Estados de um resgate",
    "action": "Modelar comprado, utilizado e cancelado com Enum e transições explícitas.",
    "criterion": "Cancelar um usado é recusado e cancelar duas vezes não reembolsa duas vezes.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Liste transições permitidas antes de implementá-las. Um estado único evita combinações contraditórias de vários booleanos.",
    "practice": [
      "Modelar três estados com Enum",
      "Comprar e depois utilizar",
      "Comprar e depois cancelar",
      "Recusar cancelamento após uso",
      "Recusar reembolso duplicado"
    ]
  },
  {
    "id": 58,
    "world": "05 · Guilda dos objetos",
    "title": "Serviço de aplicação",
    "action": "Criar ResgatarRecompensa que coordena carteira, catálogo e histórico sem imprimir.",
    "criterion": "O serviço retorna um resultado e pode ser chamado pelo terminal ou por teste.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Coordenação não precisa conter a fórmula de pontos nem detalhes de JSON. Separe responsabilidades pela razão de mudança.",
    "practice": [
      "Coordenar compra em serviço sem print",
      "Retornar resultado estruturado",
      "Injetar repositório de teste",
      "Verificar efeito no histórico",
      "Recusar pedido inválido antes de debitar"
    ]
  },
  {
    "id": 59,
    "world": "05 · Guilda dos objetos",
    "title": "Revisão de modelagem",
    "action": "Desenhar as dependências de carteira, missão e resgate; remover uma dependência circular.",
    "criterion": "Módulos importam em uma direção e os testes não precisam iniciar a interface.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Um diagrama com caixas e setas já ajuda. Prefira a menor abstração que deixa as regras claras.",
    "practice": [
      "Desenhar dependências entre módulos",
      "Detectar uma importação circular",
      "Mover contrato para módulo neutro",
      "Importar domínio sem interface",
      "Executar a suíte após reorganizar"
    ]
  },
  {
    "id": 60,
    "world": "05 · Guilda dos objetos",
    "title": "Projeto: loja no terminal",
    "action": "Integrar saldo, recompensas e estados de resgate ao diário persistente.",
    "criterion": "Comprar, cancelar antes do uso e marcar como utilizado mantêm saldo e histórico corretos.",
    "minutes": 120,
    "exercises": 5,
    "project": true,
    "tip": "Use identificadores de operação para repetir um pedido sem duplicar o débito. Esta proteção também será útil na web.",
    "practice": [
      "Comprar com saldo suficiente",
      "Cancelar compra não usada",
      "Marcar compra como usada",
      "Reenviar ID de operação",
      "Conferir saldo e histórico ao reabrir"
    ]
  },
  {
    "id": 61,
    "world": "06 · Segredos da linguagem",
    "title": "Iteradores por dentro",
    "action": "Usar iter e next em três registros e tratar StopIteration.",
    "criterion": "Explicar por que uma segunda passagem no mesmo iterador pode estar vazia.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Um iterável fornece um iterador. O iterador guarda a posição de consumo e normalmente avança em uma só direção.",
    "practice": [
      "Obter iterador de uma lista",
      "Consumir três itens com next",
      "Tratar StopIteration",
      "Percorrer o restante com for",
      "Explicar o estado após esgotamento"
    ]
  },
  {
    "id": 62,
    "world": "06 · Segredos da linguagem",
    "title": "Gere sob demanda",
    "action": "Escrever um gerador que produz registros de leitura sem montar uma lista completa.",
    "criterion": "Consumir os dois primeiros registros e depois o restante preserva a ordem.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "yield pausa a função e mantém seu estado. Evite transformar tudo em list se o objetivo é economizar memória.",
    "practice": [
      "Criar gerador de registros",
      "Consumir dois primeiros",
      "Consumir os restantes",
      "Comparar com lista equivalente",
      "Testar gerador sem nenhum item"
    ]
  },
  {
    "id": 63,
    "world": "06 · Segredos da linguagem",
    "title": "Monte uma sequência de dados",
    "action": "Filtrar, transformar e somar pontos usando expressões geradoras.",
    "criterion": "O total coincide com uma versão em laços e funciona com entrada vazia.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Geradores favorecem processamento por etapas. Verifique se um estágio consome a entrada antes de tentar reutilizá-la.",
    "practice": [
      "Filtrar hábitos concluídos",
      "Transformar minutos em pontos",
      "Somar com expressão geradora",
      "Testar entrada vazia",
      "Demonstrar consumo único de um iterador"
    ]
  },
  {
    "id": 64,
    "world": "06 · Segredos da linguagem",
    "title": "Funções como dados",
    "action": "Passar uma função de pontuação para um relatório e ordenar registros com key.",
    "criterion": "O relatório aceita duas regras sem alterar seu corpo; sorted não muda a lista original.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Funções são valores em Python. Uma função nomeada costuma comunicar melhor uma regra relevante que uma lambda longa.",
    "practice": [
      "Passar função de cálculo ao relatório",
      "Trocar a função por outra regra",
      "Ordenar por minutos com key",
      "Conferir que sorted preserva o original",
      "Substituir uma lambda longa por função nomeada"
    ]
  },
  {
    "id": 65,
    "world": "06 · Segredos da linguagem",
    "title": "Fechamentos",
    "action": "Criar uma fábrica de funções de pontuação que captura um multiplicador.",
    "criterion": "Duas funções produzidas com multiplicadores distintos mantêm seus próprios resultados.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Um fechamento lembra variáveis do escopo externo. Cuidado ao capturar variáveis de laços que mudarão depois.",
    "practice": [
      "Criar fábrica com multiplicador dois",
      "Criar fábrica com multiplicador três",
      "Comparar resultados das duas funções",
      "Inspecionar um caso de captura em laço",
      "Corrigir captura tardia com parâmetro explícito"
    ]
  },
  {
    "id": 66,
    "world": "06 · Segredos da linguagem",
    "title": "Seu primeiro decorador",
    "action": "Criar um decorador que mede uma chamada e preserva nome e documentação com functools.wraps.",
    "criterion": "A função decorada retorna o resultado original e mantém __name__.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Um decorador recebe uma função e devolve outra. Não engula exceções nem mude silenciosamente o contrato.",
    "practice": [
      "Criar wrapper que mede duração",
      "Preservar return da função",
      "Preservar __name__ com wraps",
      "Propagar exceção original",
      "Aplicar a duas funções de assinaturas diferentes"
    ]
  },
  {
    "id": 67,
    "world": "06 · Segredos da linguagem",
    "title": "Gerencie um recurso",
    "action": "Criar um gerenciador de contexto com contextlib.contextmanager para um arquivo temporário.",
    "criterion": "O recurso é limpo tanto no caminho normal quanto em uma exceção forçada.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Use try/finally em torno de yield para garantir a limpeza. Context managers modelam aquisição e liberação pareadas.",
    "practice": [
      "Abrir recurso com contextmanager",
      "Liberar em caminho normal",
      "Forçar exceção dentro do with",
      "Conferir limpeza no finally",
      "Comparar com um gerenciador já existente"
    ]
  },
  {
    "id": 68,
    "world": "06 · Segredos da linguagem",
    "title": "Cópias e mutabilidade",
    "action": "Demonstrar a diferença entre atribuição, cópia rasa e deepcopy de hábitos aninhados.",
    "criterion": "Prever quais alterações aparecem no original em três experimentos curtos.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Copiar a lista externa não copia seus dicionários. Evitar mutações compartilhadas pode ser mais simples que copiar tudo.",
    "practice": [
      "Comparar atribuição e cópia rasa",
      "Alterar dicionário de lista copiada",
      "Experimentar deepcopy",
      "Prever três resultados antes de executar",
      "Eliminar mutação compartilhada num exemplo"
    ]
  },
  {
    "id": 69,
    "world": "06 · Segredos da linguagem",
    "title": "Cache com limites",
    "action": "Aplicar lru_cache a uma função pura e inspecionar hits e misses.",
    "criterion": "Repetir a mesma entrada reutiliza o resultado; limpar o cache força um novo cálculo.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Não armazene resultados mutáveis ou dados privados sem analisar o ciclo de vida. Cache pode tornar dados antigos visíveis.",
    "practice": [
      "Adicionar lru_cache a cálculo puro",
      "Observar primeira miss",
      "Observar hit de chamada repetida",
      "Limpar e observar nova miss",
      "Explicar por que não cachear saldo mutável"
    ]
  },
  {
    "id": 70,
    "world": "06 · Segredos da linguagem",
    "title": "Despacho e padrões",
    "action": "Usar match/case para interpretar três comandos estruturados do diário.",
    "criterion": "Comandos conhecidos são tratados e um caso padrão responde a entradas inesperadas.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Pattern matching é útil para formas de dados. Em Python 3.10+, padrões não equivalem simplesmente a comparações de strings.",
    "practice": [
      "Interpretar comando de registro",
      "Interpretar comando de saldo",
      "Interpretar comando de saída",
      "Tratar formato desconhecido",
      "Evitar capturas de nomes confundidas com constantes"
    ]
  },
  {
    "id": 71,
    "world": "06 · Segredos da linguagem",
    "title": "Revisão: protocolo do Python",
    "action": "Comparar uma lista, um gerador e uma coleção própria no mesmo relatório.",
    "criterion": "O relatório depende de Iterable e não usa índices nem len sem necessidade.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Programar para um comportamento menor aumenta a reutilização. Um iterável pode ser infinito ou de uso único.",
    "practice": [
      "Relatar dados de lista",
      "Relatar dados de gerador",
      "Relatar coleção própria",
      "Remover acesso por índice desnecessário",
      "Testar com iterador de passagem única"
    ]
  },
  {
    "id": 72,
    "world": "06 · Segredos da linguagem",
    "title": "Projeto: relatório em fluxo",
    "action": "Construir um relatório que lê registros linha a linha, filtra por habilidade e resume pontos.",
    "criterion": "Processar um arquivo de teste sem carregar todas as linhas e manter o mesmo total da referência.",
    "minutes": 120,
    "exercises": 5,
    "project": true,
    "tip": "Meça memória mais adiante; aqui demonstre o fluxo por inspeção e teste com um iterador que só permite uma passagem.",
    "practice": [
      "Ler registros linha a linha",
      "Filtrar habilidade escolhida",
      "Somar pontos sem lista completa",
      "Comparar com referência pequena",
      "Recusar linha inválida com contexto útil"
    ]
  },
  {
    "id": 73,
    "world": "07 · Cofre de dados",
    "title": "Primeiro banco SQLite",
    "action": "Criar um banco temporário com sqlite3 e uma tabela registros.",
    "criterion": "Inserir dois registros e recuperá-los após fechar e reabrir a conexão.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "SQLite faz parte da biblioteca padrão. Defina tipos e uma chave primária; mantenha a conexão em um escopo claro.",
    "practice": [
      "Criar banco em pasta temporária",
      "Criar tabela com chave primária",
      "Inserir dois registros",
      "Consultar após reabrir",
      "Garantir fechamento da conexão"
    ]
  },
  {
    "id": 74,
    "world": "07 · Cofre de dados",
    "title": "Consultas com parâmetros",
    "action": "Consultar hábitos por nome usando placeholders em vez de concatenar SQL.",
    "criterion": "Um nome contendo aspas é encontrado sem erro e não altera a estrutura da consulta.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Use execute(\"SELECT ... WHERE nome = ?\", (nome,)). Parâmetros protegem valores; nomes de tabela exigem seleção controlada.",
    "practice": [
      "Consultar nome com placeholder",
      "Buscar nome contendo apóstrofo",
      "Testar texto parecido com SQL",
      "Separar valores de identificadores",
      "Conferir que a tabela permaneceu intacta"
    ]
  },
  {
    "id": 75,
    "world": "07 · Cofre de dados",
    "title": "Totais por habilidade",
    "action": "Usar SUM, COUNT e GROUP BY para resumir pontos de três habilidades.",
    "criterion": "Os totais do SQL coincidem com uma soma independente em Python.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Agregações operam sobre grupos. COUNT(*) conta linhas; valores NULL têm regras próprias em outras agregações.",
    "practice": [
      "Somar pontos por habilidade",
      "Contar registros por habilidade",
      "Ordenar resumo por nome",
      "Comparar com soma em Python",
      "Testar grupo sem registros"
    ]
  },
  {
    "id": 76,
    "world": "07 · Cofre de dados",
    "title": "Relações e junções",
    "action": "Separar habilidades e registros em duas tabelas ligadas por chave estrangeira.",
    "criterion": "Uma consulta JOIN retorna nomes de habilidades e registros; IDs inválidos são recusados com foreign_keys ativo.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Em SQLite, ative PRAGMA foreign_keys = ON em cada conexão. Um relacionamento explícito evita nomes duplicados como identidade.",
    "practice": [
      "Criar tabela de habilidades",
      "Ativar foreign_keys por conexão",
      "Inserir registro com chave válida",
      "Recusar chave inexistente",
      "Consultar nome com JOIN"
    ]
  },
  {
    "id": 77,
    "world": "07 · Cofre de dados",
    "title": "Transações de moedas",
    "action": "Executar débito e inserção de resgate na mesma transação; provocar falha na segunda escrita.",
    "criterion": "A falha desfaz o débito e o caso válido registra os dois efeitos.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "A transação precisa preservar o conjunto inteiro ou nada. Não confirme parcialmente uma operação financeira, mesmo virtual.",
    "practice": [
      "Executar débito e resgate juntos",
      "Forçar falha na segunda escrita",
      "Conferir rollback do saldo",
      "Testar operação válida",
      "Demonstrar que não há confirmação parcial"
    ]
  },
  {
    "id": 78,
    "world": "07 · Cofre de dados",
    "title": "Unicidade e idempotência",
    "action": "Adicionar chave UNIQUE por missão/data e por ID de pedido de resgate.",
    "criterion": "Duas tentativas com o mesmo identificador deixam somente um registro e um débito.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Uma restrição no banco protege contra concorrência melhor do que somente verificar antes de inserir.",
    "practice": [
      "Criar UNIQUE de missão e data",
      "Repetir inserção da mesma ocorrência",
      "Criar UNIQUE de pedido de resgate",
      "Conferir um único débito",
      "Tratar conflito com resposta previsível"
    ]
  },
  {
    "id": 79,
    "world": "07 · Cofre de dados",
    "title": "Índices com evidência",
    "action": "Criar um índice por data e observar EXPLAIN QUERY PLAN antes e depois.",
    "criterion": "A consulta filtrada usa o índice previsto; registrar o custo extra em escritas.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Um índice acelera certas buscas e ocupa espaço. Evite criar um índice para cada coluna sem consultar o padrão de uso.",
    "practice": [
      "Inspecionar plano sem índice",
      "Criar índice por data",
      "Inspecionar plano com índice",
      "Conferir mesmo resultado",
      "Anotar custo de espaço e escrita"
    ]
  },
  {
    "id": 80,
    "world": "07 · Cofre de dados",
    "title": "Evolua o esquema",
    "action": "Escrever uma migração que adiciona duracao sem apagar registros anteriores.",
    "criterion": "Uma cópia antiga migra uma vez; repetir a inicialização não reaplica a alteração.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Guarde uma versão de esquema e faça backup antes de migrar dados reais. Migrações devem ter testes com dados antigos.",
    "practice": [
      "Criar banco com esquema anterior",
      "Aplicar migração de duração",
      "Preservar registros existentes",
      "Guardar versão de esquema",
      "Reiniciar sem reaplicar a migração"
    ]
  },
  {
    "id": 81,
    "world": "07 · Cofre de dados",
    "title": "Relatório tabular opcional",
    "action": "Criar um ambiente descartável com pandas e resumir um CSV por semana; comparar com Python puro.",
    "criterion": "A soma coincide com a referência e você identifica quando a dependência facilita o trabalho.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "pandas é opcional nesta trilha. Para poucos registros, csv e dicionários podem ser suficientes e mais simples de distribuir.",
    "practice": [
      "Ler CSV com pandas em ambiente de teste",
      "Agrupar por semana",
      "Comparar com csv e dict",
      "Tratar data inválida",
      "Anotar quando evitar a dependência"
    ]
  },
  {
    "id": 82,
    "world": "07 · Cofre de dados",
    "title": "Precisão e contagens",
    "action": "Demonstrar arredondamento com float e usar int para moedas e Decimal para valores fracionários.",
    "criterion": "A contagem de moedas usa inteiros e um exemplo decimal produz o resultado esperado.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Moedas virtuais inteiras não precisam de float. Ao usar Decimal, construa a partir de texto para evitar herdar aproximações binárias.",
    "practice": [
      "Demonstrar aproximação de float",
      "Contar moedas com int",
      "Criar Decimal a partir de texto",
      "Definir arredondamento explícito",
      "Comparar resultados sem converter Decimal em float"
    ]
  },
  {
    "id": 83,
    "world": "07 · Cofre de dados",
    "title": "Revisão: restaure o cofre",
    "action": "Exportar o banco em backup e restaurar em outro caminho; comparar contagens e somas.",
    "criterion": "O banco restaurado contém os mesmos registros e respeita as restrições de unicidade.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Use a API backup do SQLite para uma cópia consistente. Copiar um arquivo aberto sem considerar seus arquivos auxiliares pode ser insuficiente.",
    "practice": [
      "Criar backup pela API sqlite3",
      "Restaurar em caminho separado",
      "Comparar contagem de linhas",
      "Comparar soma de moedas",
      "Testar restrições no banco restaurado"
    ]
  },
  {
    "id": 84,
    "world": "07 · Cofre de dados",
    "title": "Projeto: diário em SQLite",
    "action": "Trocar o repositório JSON por SQLite mantendo o mesmo serviço de aplicação.",
    "criterion": "Testes de saldo, duplicidade e restauração passam sem depender da implementação concreta.",
    "minutes": 120,
    "exercises": 5,
    "project": true,
    "tip": "Mantenha um caminho de exportação legível. Migrar a persistência não deveria mudar as regras que a pessoa vê.",
    "practice": [
      "Implementar contrato em SQLite",
      "Executar testes do serviço",
      "Migrar cópia de JSON",
      "Conferir idempotência",
      "Documentar exportação e recuperação"
    ]
  },
  {
    "id": 85,
    "world": "08 · Portal web seguro",
    "title": "Entenda uma requisição",
    "action": "Usar urllib.request para fazer GET em uma API pública documentada e inspecionar status e JSON.",
    "criterion": "Distinguir status HTTP, cabeçalhos e corpo; usar timeout e tratar falha de conexão.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Requisições externas podem falhar. Use TLS verificado, limite de tempo e dados de teste sem informações pessoais.",
    "practice": [
      "Fazer GET com timeout",
      "Inspecionar status e cabeçalhos",
      "Interpretar corpo JSON",
      "Tratar erro de conexão",
      "Garantir TLS verificado e dados fictícios"
    ]
  },
  {
    "id": 86,
    "world": "08 · Portal web seguro",
    "title": "Uma API local",
    "action": "Instalar FastAPI e Uvicorn no .venv e criar GET /saude que retorna um objeto JSON.",
    "criterion": "Iniciar o servidor local e receber status 200 com o campo esperado.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Separe a função que atende HTTP da regra de domínio. A documentação gerada ajuda a explorar o contrato, mas não substitui testes.",
    "practice": [
      "Criar GET de saúde",
      "Iniciar Uvicorn localmente",
      "Consultar retorno JSON",
      "Conferir status 200",
      "Parar e reiniciar sem perder código"
    ]
  },
  {
    "id": 87,
    "world": "08 · Portal web seguro",
    "title": "Valide a entrada web",
    "action": "Criar POST /registros com modelo Pydantic que exige nome e minutos não negativos.",
    "criterion": "Entrada válida é aceita e campos inválidos produzem resposta de validação sem salvar.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Dados recebidos nunca são confiáveis só porque vieram de um formulário. Limite também o tamanho de textos e listas.",
    "practice": [
      "Definir modelo de entrada",
      "Recusar minutos negativos",
      "Recusar nome ausente",
      "Limitar tamanho do texto",
      "Conferir que erro não persiste registro"
    ]
  },
  {
    "id": 88,
    "world": "08 · Portal web seguro",
    "title": "Códigos e erros",
    "action": "Mapear registro inexistente para 404 e conflito de duplicidade para 409.",
    "criterion": "Os testes verificam status e mensagem sem vazar caminhos locais ou pilhas de erro.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Erros HTTP comunicam o resultado da operação. Evite responder 200 com uma falha escondida no corpo.",
    "practice": [
      "Retornar 404 para ID ausente",
      "Retornar 409 para duplicidade",
      "Testar corpo de erro",
      "Ocultar pilha em resposta pública",
      "Distinguir erro de validação de erro interno"
    ]
  },
  {
    "id": 89,
    "world": "08 · Portal web seguro",
    "title": "Teste sem servidor real",
    "action": "Usar o cliente de teste do framework para criar e consultar um registro em banco temporário.",
    "criterion": "O teste verifica corpo, status e persistência sem acessar sua base pessoal.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Isole dependências por teste. Um teste de integração deve atravessar a rota e a regra que você quer demonstrar.",
    "practice": [
      "Criar cliente de teste",
      "Usar banco temporário",
      "Criar registro por POST",
      "Consultar registro por GET",
      "Limpar dependências ao final do teste"
    ]
  },
  {
    "id": 90,
    "world": "08 · Portal web seguro",
    "title": "HTML com contexto",
    "action": "Renderizar uma lista de hábitos em template com escape automático.",
    "criterion": "Um nome contendo <script> aparece como texto e não executa código.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Escape de HTML depende do contexto. Evite inserir texto do usuário como HTML confiável; não basta remover uma palavra perigosa.",
    "practice": [
      "Renderizar nomes escapados",
      "Testar texto com tag script",
      "Preservar acentos em HTML",
      "Evitar marcar entrada como segura",
      "Conferir conteúdo no corpo da resposta"
    ]
  },
  {
    "id": 91,
    "world": "08 · Portal web seguro",
    "title": "Credenciais fora do código",
    "action": "Ler uma configuração de teste por variável de ambiente e falhar com mensagem quando ausente.",
    "criterion": "O segredo não aparece em logs, respostas, Git ou mensagens de erro.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Use um valor fictício para aprender. Um arquivo .env local deve ficar ignorado; produção usa armazenamento de segredos apropriado.",
    "practice": [
      "Ler variável de teste",
      "Falhar quando ausente",
      "Usar segredo fictício no experimento",
      "Conferir logs sem valor secreto",
      "Documentar nomes de configuração sem valores"
    ]
  },
  {
    "id": 92,
    "world": "08 · Portal web seguro",
    "title": "Autenticação e autorização",
    "action": "Usar a solução documentada do framework para identificar dois usuários fictícios e verificar acesso por proprietário.",
    "criterion": "Um usuário não consegue ler nem alterar registros do outro, mesmo conhecendo o ID.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Autenticar identifica; autorizar decide acesso a cada recurso. Não crie criptografia ou hashing de senhas por conta própria.",
    "practice": [
      "Identificar dois usuários fictícios",
      "Autorizar registro do dono",
      "Recusar leitura de outro usuário",
      "Recusar alteração de outro usuário",
      "Testar IDs previsíveis sem conceder acesso"
    ]
  },
  {
    "id": 93,
    "world": "08 · Portal web seguro",
    "title": "Sessões e ameaças",
    "action": "Revisar cookies HttpOnly/SameSite/Secure, CSRF e CORS; testar uma origem permitida e outra recusada.",
    "criterion": "Documentar a estratégia usada e demonstrar uma requisição indevida bloqueada.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "CORS não é autorização. A estratégia de CSRF depende do uso de cookies; mantenha TLS e configure apenas origens necessárias.",
    "practice": [
      "Inspecionar atributos do cookie",
      "Documentar estratégia CSRF",
      "Configurar uma origem permitida",
      "Recusar uma origem desconhecida",
      "Explicar por que CORS não substitui autorização"
    ]
  },
  {
    "id": 94,
    "world": "08 · Portal web seguro",
    "title": "Pedidos repetidos",
    "action": "Adicionar chave de idempotência ao resgate por HTTP e rejeitar reuso com corpo diferente.",
    "criterion": "Repetir o mesmo pedido devolve o mesmo resgate; alterar o corpo com a mesma chave gera conflito.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "O cliente pode reenviar após um timeout sem saber se o servidor concluiu. Guarde a chave junto com o efeito transacional.",
    "practice": [
      "Enviar compra com chave única",
      "Repetir mesma chave e corpo",
      "Conferir mesmo ID de resgate",
      "Reusar chave com corpo diferente",
      "Verificar conflito sem débito extra"
    ]
  },
  {
    "id": 95,
    "world": "08 · Portal web seguro",
    "title": "Revisão: limites de API",
    "action": "Adicionar paginação, limite de tamanho e uma política documentada de taxa no ambiente de teste.",
    "criterion": "Pedidos fora dos limites são recusados com respostas previsíveis e os válidos continuam funcionando.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Valide limites no servidor. Uma interface que esconde um botão não impede chamadas diretas à API.",
    "practice": [
      "Paginar lista de registros",
      "Recusar tamanho de página excessivo",
      "Limitar tamanho de importação",
      "Testar política de taxa em ambiente local",
      "Conferir operação válida após um erro"
    ]
  },
  {
    "id": 96,
    "world": "08 · Portal web seguro",
    "title": "Projeto: portal da jornada",
    "action": "Integrar API, página simples e banco para registrar hábitos e consultar saldo.",
    "criterion": "Um teste cria registro, consulta totais e confirma que outro usuário não acessa os dados.",
    "minutes": 120,
    "exercises": 5,
    "project": true,
    "tip": "Mantenha a primeira publicação com dados fictícios. Estudar web não exige expor seu diário pessoal à internet.",
    "practice": [
      "Integrar página e API",
      "Criar registro pela interface",
      "Conferir saldo pela API",
      "Testar isolamento entre usuários",
      "Documentar limites antes de publicação"
    ]
  },
  {
    "id": 97,
    "world": "09 · Ritmo e escala",
    "title": "Corrotinas em paralelo",
    "action": "Criar duas corrotinas com asyncio.sleep e executá-las com asyncio.gather.",
    "criterion": "Comparar execução sequencial e concorrente medindo duração sem exigir um tempo exato.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "async ajuda quando há espera por I/O. Não acelera automaticamente cálculos e uma chamada bloqueante pode parar o loop inteiro.",
    "practice": [
      "Executar duas corrotinas em sequência",
      "Executar com gather",
      "Medir duração relativa",
      "Conferir ordem dos resultados",
      "Explicar por que sleep não simula cálculo de CPU"
    ]
  },
  {
    "id": 98,
    "world": "09 · Ritmo e escala",
    "title": "HTTP assíncrono",
    "action": "Usar um cliente HTTP assíncrono com timeout para duas consultas de teste.",
    "criterion": "As respostas são tratadas separadamente e uma falha não deixa conexões abertas.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Reutilize o cliente em async with. Não faça pedidos em massa a serviços públicos para praticar concorrência.",
    "practice": [
      "Reutilizar cliente assíncrono",
      "Consultar duas fontes de teste",
      "Definir timeout",
      "Tratar falha de uma resposta",
      "Conferir fechamento das conexões"
    ]
  },
  {
    "id": 99,
    "world": "09 · Ritmo e escala",
    "title": "Limite a concorrência",
    "action": "Usar asyncio.Semaphore para processar cinco trabalhos com no máximo dois ativos.",
    "criterion": "Instrumentar um contador e verificar que o máximo observado nunca passa de dois.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Concorrência precisa de limites para respeitar serviços e recursos locais. O semáforo controla entradas simultâneas.",
    "practice": [
      "Criar cinco tarefas locais",
      "Limitar ativas com Semaphore",
      "Medir máximo simultâneo",
      "Testar limite igual a um",
      "Liberar semáforo após uma falha"
    ]
  },
  {
    "id": 100,
    "world": "09 · Ritmo e escala",
    "title": "Timeout e cancelamento",
    "action": "Cancelar uma tarefa lenta e liberar seu recurso em finally.",
    "criterion": "Após o cancelamento não sobra tarefa em execução nem recurso aberto.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Cancelamento é parte do fluxo assíncrono. Não capture BaseException nem suprima CancelledError sem um motivo explícito.",
    "practice": [
      "Iniciar tarefa lenta",
      "Aplicar timeout",
      "Executar limpeza em finally",
      "Propagar cancelamento corretamente",
      "Conferir ausência de tarefa pendente"
    ]
  },
  {
    "id": 101,
    "world": "09 · Ritmo e escala",
    "title": "Trabalho em threads",
    "action": "Executar uma leitura bloqueante com asyncio.to_thread e manter outra corrotina responsiva.",
    "criterion": "Uma marcação periódica continua durante a espera e o resultado da thread é recuperado.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Threads compartilham memória. to_thread ajuda com I/O bloqueante; código Python intensivo em CPU costuma exigir outra estratégia.",
    "practice": [
      "Encaminhar leitura bloqueante para thread",
      "Manter corrotina periódica ativa",
      "Recuperar retorno da thread",
      "Tratar exceção originada na thread",
      "Evitar modificar estado compartilhado sem proteção"
    ]
  },
  {
    "id": 102,
    "world": "09 · Ritmo e escala",
    "title": "Processos para CPU",
    "action": "Comparar uma função de cálculo sequencial com ProcessPoolExecutor usando uma carga pequena controlada.",
    "criterion": "Os resultados coincidem e o programa usa a proteção __main__ quando necessária.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Processos têm custo de início e serialização. Um problema pequeno pode ficar mais lento; não aumente a carga só para forçar um ganho.",
    "practice": [
      "Comparar cálculo sequencial e em processos",
      "Proteger entrada com __main__",
      "Conferir resultados idênticos",
      "Anotar custo de inicialização",
      "Escolher carga pequena sem esgotar máquina"
    ]
  },
  {
    "id": 103,
    "world": "09 · Ritmo e escala",
    "title": "Uma corrida de saldo",
    "action": "Reproduzir duas tentativas concorrentes de resgate e protegê-las com transação/atualização condicional.",
    "criterion": "Apenas uma compra cabe no saldo e o banco nunca fica negativo.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Verificar saldo e depois debitar em comandos separados permite corridas. A condição e a atualização precisam ser atômicas.",
    "practice": [
      "Reproduzir duas compras concorrentes",
      "Usar débito condicional atômico",
      "Conferir uma única compra válida",
      "Verificar saldo nunca negativo",
      "Executar teste repetidamente com dados isolados"
    ]
  },
  {
    "id": 104,
    "world": "09 · Ritmo e escala",
    "title": "Meça antes de otimizar",
    "action": "Usar timeit para comparar duas somas e cProfile para localizar uma função lenta num relatório.",
    "criterion": "Registrar entradas, ambiente e resultados; apontar o trecho que realmente domina o custo.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Uma medição isolada pode variar. Preserve a correção e evite otimizações baseadas apenas na aparência do código.",
    "practice": [
      "Medir duas implementações com timeit",
      "Usar entradas equivalentes",
      "Executar cProfile no relatório",
      "Identificar função dominante",
      "Otimizar e conferir correção novamente"
    ]
  },
  {
    "id": 105,
    "world": "09 · Ritmo e escala",
    "title": "Memória observável",
    "action": "Usar tracemalloc para comparar uma lista de registros com um gerador na mesma tarefa.",
    "criterion": "As duas versões produzem o mesmo total e têm picos de memória anotados.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "tracemalloc observa alocações de Python e tem limites. A comparação só faz sentido com o mesmo trabalho e tamanho de entrada.",
    "practice": [
      "Medir lista com tracemalloc",
      "Medir gerador para mesmo trabalho",
      "Comparar picos de memória",
      "Conferir o mesmo resultado final",
      "Anotar limites da ferramenta de medição"
    ]
  },
  {
    "id": 106,
    "world": "09 · Ritmo e escala",
    "title": "Retentativas responsáveis",
    "action": "Implementar retentativa limitada com backoff apenas para uma operação idempotente simulada.",
    "criterion": "Uma falha temporária pode recuperar; falha permanente encerra após o limite sem duplicar efeitos.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Não repita indiscriminadamente erros de validação ou compras sem idempotência. Use jitter e um limite de tempo em serviços reais.",
    "practice": [
      "Simular falha temporária",
      "Definir máximo de tentativas",
      "Aplicar backoff limitado",
      "Não repetir erro de validação",
      "Conferir ausência de efeito duplicado"
    ]
  },
  {
    "id": 107,
    "world": "09 · Ritmo e escala",
    "title": "Revisão: tarefa interrompida",
    "action": "Simular timeout no meio de um relatório e verificar limpeza, registro de erro e possibilidade de tentar de novo.",
    "criterion": "A nova tentativa funciona e não mistura resultados parciais com os completos.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Resultados incompletos precisam ser distinguíveis. Uma resposta rápida com dados incorretos não é uma otimização.",
    "practice": [
      "Interromper relatório por timeout",
      "Conferir recursos liberados",
      "Marcar resultado parcial como incompleto",
      "Executar nova tentativa limpa",
      "Conferir que totais não misturam tentativas"
    ]
  },
  {
    "id": 108,
    "world": "09 · Ritmo e escala",
    "title": "Projeto: relatórios concorrentes",
    "action": "Construir um agregador assíncrono com fontes simuladas, limite de concorrência e timeout.",
    "criterion": "Testes cobrem sucesso, fonte lenta e cancelamento; um perfil demonstra o comportamento esperado.",
    "minutes": 120,
    "exercises": 5,
    "project": true,
    "tip": "Use simulações locais reproduzíveis. Documente a escolha entre async, threads e processos para cada tipo de trabalho.",
    "practice": [
      "Criar fontes locais simuladas",
      "Limitar concorrência do agregador",
      "Testar fonte lenta",
      "Testar cancelamento",
      "Registrar perfil e justificar a estratégia"
    ]
  },
  {
    "id": 109,
    "world": "10 · Laboratório avançado",
    "title": "Empacote para reutilizar",
    "action": "Organizar um pacote src com pyproject.toml e instalar em modo editável no .venv.",
    "criterion": "Importar o pacote fora de sua pasta e executar o comando de entrada documentado.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "pyproject.toml concentra metadados e a ferramenta de build. Evite depender de alterações manuais em sys.path.",
    "practice": [
      "Organizar pacote em src",
      "Definir metadados no pyproject",
      "Instalar editável",
      "Importar fora da raiz",
      "Criar comando de entrada documentado"
    ]
  },
  {
    "id": 110,
    "world": "10 · Laboratório avançado",
    "title": "Construa um artefato",
    "action": "Gerar wheel com python -m build e instalar o artefato em outro ambiente virtual limpo.",
    "criterion": "O comando do diário funciona no ambiente limpo sem acessar o checkout original.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Uma instalação editável pode esconder arquivos ausentes no pacote. O wheel testa o que outra pessoa realmente receberá.",
    "practice": [
      "Gerar wheel",
      "Criar ambiente virtual limpo",
      "Instalar o artefato",
      "Executar comando sem checkout",
      "Conferir arquivos incluídos no pacote"
    ]
  },
  {
    "id": 111,
    "world": "10 · Laboratório avançado",
    "title": "Dependências reproduzíveis",
    "action": "Registrar versões de runtime e ferramentas de desenvolvimento usando o fluxo de lock da ferramenta escolhida.",
    "criterion": "Uma instalação congelada em ambiente limpo executa a suíte sem alterar o lock.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Fixar versões ajuda a reproduzir, mas não dispensa atualizações. Mantenha verificação de TLS e de integridade dos artefatos.",
    "practice": [
      "Separar dependências de runtime e dev",
      "Gerar lock na ferramenta escolhida",
      "Instalar em modo congelado",
      "Conferir que lock não mudou",
      "Executar suíte no ambiente limpo"
    ]
  },
  {
    "id": 112,
    "world": "10 · Laboratório avançado",
    "title": "Integração contínua",
    "action": "Configurar CI para instalar dependências congeladas, checar tipos e executar os testes.",
    "criterion": "Uma alteração que quebra um teste falha no CI; a correção passa em uma execução nova.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "O CI deve preservar o código de saída real dos comandos. Não publique segredos em logs ou use dados pessoais nos testes.",
    "practice": [
      "Configurar versão de Python no CI",
      "Instalar dependências congeladas",
      "Executar tipos e testes",
      "Provocar falha verificável",
      "Conferir nova execução após correção"
    ]
  },
  {
    "id": 113,
    "world": "10 · Laboratório avançado",
    "title": "Fronteiras da arquitetura",
    "action": "Separar domínio, casos de uso, persistência e interface do diário sem mudar seu comportamento.",
    "criterion": "O domínio não importa FastAPI nem sqlite3 e os testes de regras continuam rápidos.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "A direção das dependências protege as regras das decisões técnicas. Evite criar camadas vazias sem uma necessidade concreta.",
    "practice": [
      "Desenhar quatro fronteiras do sistema",
      "Remover import de framework do domínio",
      "Injetar persistência no serviço",
      "Executar regras sem servidor",
      "Explicar uma camada removida por ser desnecessária"
    ]
  },
  {
    "id": 114,
    "world": "10 · Laboratório avançado",
    "title": "Eventos e livro de registros",
    "action": "Representar ganhos, gastos e estornos como eventos imutáveis e reconstruir um saldo a partir deles.",
    "criterion": "Reprocessar eventos produz o mesmo saldo e um ID repetido não altera o resultado.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Um registro de eventos torna correções auditáveis. Não é preciso adotar um sistema distribuído inteiro para usar esse princípio.",
    "practice": [
      "Registrar ganho como evento",
      "Registrar gasto como evento",
      "Registrar estorno referenciando compra",
      "Reconstruir saldo do histórico",
      "Ignorar ID duplicado com segurança"
    ]
  },
  {
    "id": 115,
    "world": "10 · Laboratório avançado",
    "title": "Testes por propriedades",
    "action": "Usar Hypothesis para testar que crédito válido seguido de débito igual preserva o saldo.",
    "criterion": "O teste explora várias entradas e detecta uma implementação com erro introduzido.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Defina invariantes antes de gerar dados. Testes por propriedades complementam exemplos concretos; ambos são úteis.",
    "practice": [
      "Gerar créditos não negativos",
      "Verificar invariante de saldo",
      "Adicionar propriedade de idempotência",
      "Observar exemplo mínimo de falha",
      "Manter exemplos concretos junto das propriedades"
    ]
  },
  {
    "id": 116,
    "world": "10 · Laboratório avançado",
    "title": "Observabilidade com privacidade",
    "action": "Adicionar logs estruturados, ID de operação e métricas de duração a um caso de uso.",
    "criterion": "Rastrear um pedido de ponta a ponta sem registrar texto privado de hábitos ou credenciais.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Métricas mostram tendências; logs explicam eventos. Não coloque IDs pessoais de alta cardinalidade em rótulos de métricas.",
    "practice": [
      "Adicionar ID de operação ao log",
      "Medir duração de um caso de uso",
      "Rastrear um erro ponta a ponta",
      "Remover texto privado dos logs",
      "Evitar dados pessoais como rótulos de métrica"
    ]
  },
  {
    "id": 117,
    "world": "10 · Laboratório avançado",
    "title": "Modelagem de ameaças",
    "action": "Revisar backup, importação, autenticação e dependências; escrever cinco ameaças e respectivas defesas verificáveis.",
    "criterion": "Testar ao menos backup inválido, acesso indevido e limite de tamanho sem perder dados.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Segurança é um processo contínuo. Valide formato e tamanho antes de importar, mantenha uma cópia anterior e trate o backup como dado não confiável.",
    "practice": [
      "Listar cinco ameaças concretas",
      "Rejeitar backup inválido",
      "Limitar tamanho de importação",
      "Testar acesso indevido",
      "Preservar cópia anterior a uma restauração"
    ]
  },
  {
    "id": 118,
    "world": "10 · Laboratório avançado",
    "title": "Desafio avançado: extensões",
    "action": "Projetar um protocolo de plugin para uma regra extra de pontuação e carregar apenas plugins locais confiáveis.",
    "criterion": "Dois plugins funcionam com o mesmo contrato e uma implementação inválida falha com mensagem clara.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Carregar Python executa código. Não aceite plugins enviados por usuários sem isolamento adequado; prefira registro explícito para este exercício.",
    "practice": [
      "Definir protocolo de plugin",
      "Registrar dois plugins locais explícitos",
      "Recusar plugin com contrato inválido",
      "Testar mesma entrada em ambos",
      "Documentar que importar plugin executa código"
    ]
  },
  {
    "id": 119,
    "world": "10 · Laboratório avançado",
    "title": "Prepare sua expedição final",
    "action": "Definir um projeto de rotina em Python com escopo, três fluxos essenciais, plano de testes e critérios de pronto.",
    "criterion": "Escolher CLI ou API, listar riscos e dividir a implementação em sessões de 25 minutos adicionais.",
    "minutes": 120,
    "exercises": 5,
    "project": false,
    "tip": "Este plano não promete terminar um sistema em uma sessão. Reserve quantas sessões forem necessárias e use as revisões para reduzir escopo.",
    "practice": [
      "Escolher escopo CLI ou API",
      "Escrever três fluxos essenciais",
      "Definir critérios verificáveis",
      "Dividir trabalho em sessões de duas horas",
      "Listar riscos e cortar extras do primeiro marco"
    ]
  },
  {
    "id": 120,
    "world": "10 · Laboratório avançado",
    "title": "Projeto final: jornada demonstrável",
    "action": "Entregar uma fatia funcional do projeto escolhido, com histórico persistente, regra idempotente e backup restaurável.",
    "criterion": "Demonstrar criar missão, concluir sem duplicar, fechar/reabrir e restaurar backup; documentar testes e limitações.",
    "minutes": 120,
    "exercises": 5,
    "project": true,
    "tip": "Esta fase é um marco aberto: repita sessões até cumprir os critérios. Concluir o mapa registra prática e entregas; temas avançados exigem aprofundamento contínuo.",
    "practice": [
      "Demonstrar criação de missão",
      "Demonstrar conclusão idempotente",
      "Fechar e reabrir preservando dados",
      "Restaurar backup em local separado",
      "Executar testes e registrar limites da entrega"
    ]
  }
];
