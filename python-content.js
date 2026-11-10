// Conteúdo autoral de leitura; não representa progresso nem altera contagens históricas.
// Referências oficiais CPython consultadas em 10/11/2026; limites de acesso no relatório da entrega.
export const pythonContent = {
  "1": {
    "objective": "Criar, salvar, executar e modificar um arquivo Python que mostre mensagens de uma rotina.",
    "prerequisites": [
      "Nenhum conhecimento de programação. Um computador com permissão para instalar Python 3; celular pode consultar o conteúdo, mas esta preparação usa um computador."
    ],
    "preparation": [
      "Preparação, não exercício resolvido: no site oficial python.org/downloads, escolha uma versão estável do Python 3 compatível com seu sistema. Siga o instalador oficial e inclua o IDLE quando essa opção existir. Em Linux, o Python e o IDLE podem ser pacotes separados: consulte a documentação da sua distribuição ou peça ajuda para instalar python3 e idle; não copie comandos de uma distribuição diferente.",
      "Abra o IDLE pelo menu de aplicativos (no macOS, procure na pasta Python 3 em Aplicativos). IDLE é um programa que reúne editor e console. Se não estiver instalado, conclua a preparação antes de seguir; o aplicativo Entre Trilhas não instala nem executa Python.",
      "Crie uma pasta chamada estudos_python no seu computador, pelo gerenciador de arquivos: Explorador de Arquivos no Windows, Finder no macOS ou Arquivos no Linux. É apenas um lugar para guardar seus arquivos.",
      "No IDLE, use File → New File para abrir o editor vazio. Digite o exemplo, sem copiar os símbolos >>> do console. Escolha File → Save As, entre na pasta estudos_python e salve como jornada.py. A extensão .py identifica o arquivo Python; confira que não ficou jornada.py.txt.",
      "No editor, escolha Run → Run Module (ou F5; alguns teclados exigem Fn + F5). Veja a mensagem na janela Python Shell. Altere a frase, salve por File → Save e execute outra vez. Quando aparecer >>>, o console está pronto para outro comando; não é parte da saída do programa.",
      "O terminal é outro programa para enviar comandos ao sistema; editor serve para escrever, arquivo guarda o texto e o interpretador Python executa esse texto. Não é necessário usar terminal nesta fase. Fechar o console não apaga o arquivo salvo. Estas etapas de instalação, localização e execução não entram na contagem de exercícios de programação."
    ],
    "explanation": [
      "Um programa é uma sequência de instruções. Python lê o arquivo de cima para baixo. print(\"Minha jornada começou!\") pede que Python mostre aquela mensagem no console. Escreva print em letras minúsculas, seguido dos parênteses; o texto fica entre aspas retas duplas ou simples, com abertura e fechamento do mesmo tipo.",
      "Cada chamada de print do exemplo termina uma linha. O que está dentro das aspas é texto, não um comando: print(\"Leitura\") mostra Leitura, sem as aspas. Acentos são aceitos. Escreva uma instrução por linha, começando na margem esquerda.",
      "Uma linha começando com # é um comentário para quem lê o arquivo e não aparece na saída. Nas soluções, comentários explicam a intenção. Digite o programa em um arquivo .py, salve e execute no IDLE; olhar o arquivo não executa suas instruções.",
      "Antes de executar, preveja a mensagem que sairá. Depois compare com a saída esperada, corrija e execute novamente. Os quatro básicos são programação; instalação e configuração são preparação. Os extras são opcionais e podem ficar para outra sessão."
    ],
    "review": [
      "Ainda não há conceitos anteriores. Localize o editor, o arquivo salvo e a janela Shell, dizendo a função de cada um."
    ],
    "example": {
      "code": "print(\"Minha jornada começou!\")\nprint(\"Hoje vou cuidar da casa e praticar Python.\")",
      "stdin": "",
      "stdout": "Minha jornada começou!\nHoje vou cuidar da casa e praticar Python.\n"
    },
    "exercises": [
      {
        "id": "p1-b1",
        "kind": "basic",
        "title": "Primeiro recado",
        "prompt": "Crie um arquivo que mostre exatamente Minha jornada começou! em uma linha.",
        "hints": [
          "Use uma chamada de print e uma mensagem entre aspas.",
          "Coloque a frase dentro dos parênteses e feche a aspa antes do último parêntese."
        ],
        "solution": "# A mensagem entre aspas é mostrada no console.\nprint(\"Minha jornada começou!\")",
        "cases": [
          {
            "stdin": "",
            "stdout": "Minha jornada começou!\n"
          }
        ]
      },
      {
        "id": "p1-b2",
        "kind": "basic",
        "title": "Dois cuidados",
        "prompt": "Mostre Água fresca para o cachorro. e depois Passeio combinado. em linhas separadas. São mensagens de lembrete, não comprovação de cuidado realizado.",
        "hints": [
          "Use duas instruções, na ordem pedida.",
          "Cada print já termina a linha: escreva um print por mensagem."
        ],
        "solution": "# Uma instrução por linha mantém a ordem do lembrete.\nprint(\"Água fresca para o cachorro.\")\nprint(\"Passeio combinado.\")",
        "cases": [
          {
            "stdin": "",
            "stdout": "Água fresca para o cachorro.\nPasseio combinado.\n"
          }
        ]
      },
      {
        "id": "p1-b3",
        "kind": "basic",
        "title": "Três paradas",
        "prompt": "Mostre Leitura, Casa e Python em três linhas, nessa ordem, sem vírgulas na saída.",
        "hints": [
          "Cada palavra é um texto independente.",
          "Escreva três chamadas de print, uma para cada palavra entre aspas."
        ],
        "solution": "# A ordem do arquivo é a ordem da saída.\nprint(\"Leitura\")\nprint(\"Casa\")\nprint(\"Python\")",
        "cases": [
          {
            "stdin": "",
            "stdout": "Leitura\nCasa\nPython\n"
          }
        ]
      },
      {
        "id": "p1-b4",
        "kind": "basic",
        "title": "Arquivo revisado",
        "prompt": "Escreva e execute uma mensagem com Hoje estudo Python. Depois altere o mesmo arquivo para mostrar Hoje pratico com calma. A saída final deve conter só a segunda frase.",
        "hints": [
          "Depois de editar, salve e execute novamente.",
          "Substitua o texto dentro das aspas; não acrescente outra chamada se quer só uma linha."
        ],
        "solution": "# Esta é a versão final, depois de alterar e salvar o arquivo.\nprint(\"Hoje pratico com calma.\")",
        "cases": [
          {
            "stdin": "",
            "stdout": "Hoje pratico com calma.\n"
          }
        ]
      },
      {
        "id": "p1-e1",
        "kind": "extra",
        "title": "Recado com acentos",
        "prompt": "Mostre Organização também é cuidado. sem perder os acentos.",
        "hints": [
          "Texto em Python aceita caracteres acentuados.",
          "Digite a frase entre aspas retas no print."
        ],
        "solution": "# O arquivo salvo pelo IDLE preserva os acentos.\nprint(\"Organização também é cuidado.\")",
        "cases": [
          {
            "stdin": "",
            "stdout": "Organização também é cuidado.\n"
          }
        ]
      },
      {
        "id": "p1-e2",
        "kind": "extra",
        "title": "Aspas dentro da frase",
        "prompt": "Mostre Hoje li \"duas páginas\". incluindo as aspas duplas na saída.",
        "hints": [
          "É possível delimitar o texto com aspas simples.",
          "Use aspas simples por fora e duplas apenas nas palavras duas páginas."
        ],
        "solution": "# Aspas simples delimitam o texto; as duplas pertencem à frase.\nprint('Hoje li \"duas páginas\".')",
        "cases": [
          {
            "stdin": "",
            "stdout": "Hoje li \"duas páginas\".\n"
          }
        ]
      },
      {
        "id": "p1-e3",
        "kind": "extra",
        "title": "Pequena sequência",
        "prompt": "Mostre Preparar o material., Praticar com calma. e Guardar o arquivo. em três linhas.",
        "hints": [
          "O interpretador segue a ordem das instruções.",
          "Use três prints, sem números ou marcadores fora das mensagens."
        ],
        "solution": "# Um pequeno roteiro escrito como três instruções.\nprint(\"Preparar o material.\")\nprint(\"Praticar com calma.\")\nprint(\"Guardar o arquivo.\")",
        "cases": [
          {
            "stdin": "",
            "stdout": "Preparar o material.\nPraticar com calma.\nGuardar o arquivo.\n"
          }
        ]
      },
      {
        "id": "p1-e4",
        "kind": "extra",
        "title": "Comentário invisível",
        "prompt": "Acrescente um comentário explicando seu programa e mostre só Descanso também faz parte. na saída.",
        "hints": [
          "Comentários começam com # fora das aspas.",
          "Coloque o comentário em uma linha e o print da frase na próxima."
        ],
        "solution": "# Este lembrete preserva o descanso da rotina.\nprint(\"Descanso também faz parte.\")",
        "cases": [
          {
            "stdin": "",
            "stdout": "Descanso também faz parte.\n"
          }
        ]
      },
      {
        "id": "p1-e5",
        "kind": "extra",
        "title": "Mensagem numérica em texto",
        "prompt": "Mostre Meta de prática: 120 minutos. como uma frase única, sem fazer contas ainda.",
        "hints": [
          "Números podem fazer parte de um texto entre aspas.",
          "A frase inteira, incluindo 120, fica dentro das mesmas aspas."
        ],
        "solution": "# Aqui 120 faz parte da mensagem, ainda não é um cálculo.\nprint(\"Meta de prática: 120 minutos.\")",
        "cases": [
          {
            "stdin": "",
            "stdout": "Meta de prática: 120 minutos.\n"
          }
        ]
      },
      {
        "id": "p1-e6",
        "kind": "extra",
        "title": "Corrija o rascunho",
        "prompt": "O rascunho print(\"Retomar com calma.) tem uma aspa ausente. Crie uma versão corrigida que mostre Retomar com calma.",
        "hints": [
          "Conte a abertura e o fechamento das aspas.",
          "Feche a mensagem depois do ponto e antes do parêntese."
        ],
        "solution": "# Corrigir a aspa permite que o interpretador entenda o texto.\nprint(\"Retomar com calma.\")",
        "cases": [
          {
            "stdin": "",
            "stdout": "Retomar com calma.\n"
          }
        ]
      }
    ],
    "mistakes": [
      {
        "symptom": "Nada mudou depois de editar.",
        "investigate": "Confira se salvou o arquivo e executou Run → Run Module no editor do arquivo correto. Fechar e reabrir jornada.py ajuda a conferir o conteúdo salvo."
      },
      {
        "symptom": "SyntaxError ou texto marcado em vermelho.",
        "investigate": "Leia a última mensagem e o trecho indicado. Procure uma aspa ou parêntese sem par, substitua aspas curvas por retas e execute de novo."
      },
      {
        "symptom": "NameError ao escrever Print ou uma mensagem sem aspas.",
        "investigate": "Confira se escreveu print em minúsculas e deixou a mensagem entre aspas. Python distingue Print de print."
      },
      {
        "symptom": "IndentationError na primeira linha.",
        "investigate": "Apague espaços antes de print. Nesta fase nenhuma linha precisa começar recuada."
      }
    ],
    "criterion": "Salve e execute os quatro programas básicos, altere uma mensagem e execute novamente. Identifique editor, arquivo e saída; corrija uma aspa ausente no seu rascunho. Extras não são obrigatórios e esta fase pode ocupar vários dias.",
    "sources": [
      "https://raw.githubusercontent.com/python/cpython/main/Doc/using/windows.rst",
      "https://raw.githubusercontent.com/python/cpython/main/Doc/library/idle.rst",
      "https://raw.githubusercontent.com/python/cpython/main/Doc/tutorial/introduction.rst",
      "https://raw.githubusercontent.com/python/cpython/main/Doc/using/mac.rst",
      "https://raw.githubusercontent.com/python/cpython/main/Doc/using/unix.rst"
    ]
  },
  "2": {
    "objective": "Organizar um painel textual com mensagens, linhas em branco, separadores e continuação de linha.",
    "prerequisites": [
      "Fase 1: abrir, salvar e executar um arquivo .py e mostrar texto com print."
    ],
    "preparation": [],
    "explanation": [
      "print pode receber mais de um valor dentro dos parênteses, separados por vírgulas. print(\"Leitura\", \"Casa\") mostra Leitura Casa: a vírgula separa os valores no código; por padrão Python coloca um espaço entre eles na saída.",
      "sep é uma opção da chamada print que escolhe o texto entre os valores. Em print(\"Leitura\", \"Casa\", sep=\" | \"), o separador é espaço, barra e espaço. As aspas e vírgulas pertencem ao código; só o conteúdo do separador aparece na saída. sep=\"\" usa um texto vazio, sem espaço entre valores.",
      "Por padrão cada print termina com uma quebra de linha. end é a opção que muda esse final: print(\"Missão: \", end=\"\") não quebra a linha; o print seguinte continua logo depois. Um espaço dentro da mensagem é preservado. O último print pode manter o final padrão para encerrar a linha.",
      "print() sem nada dentro mostra uma linha em branco. Mensagem vazia, como print(\"\"), também termina uma linha. Vamos usar print() para separar seções. Escreva uma chamada por linha; não precisa usar outras formas de criar quebras.",
      "Salve os exercícios em arquivos separados ou substitua o conteúdo do mesmo arquivo antes de executar. Compare espaços, acentos e linhas em branco com a saída esperada."
    ],
    "review": [
      "Execute novamente um print com uma frase acentuada. Explique por que a mensagem precisa de aspas e por que salvar vem antes de executar."
    ],
    "example": {
      "code": "print(\"Meu dia\")\nprint()\nprint(\"Leitura\", \"Casa\", \"Python\", sep=\" · \")\nprint(\"Próximo passo: \", end=\"\")\nprint(\"praticar com calma.\")",
      "stdin": "",
      "stdout": "Meu dia\n\nLeitura · Casa · Python\nPróximo passo: praticar com calma.\n"
    },
    "exercises": [
      {
        "id": "p2-b1",
        "kind": "basic",
        "title": "Painel de hábitos",
        "prompt": "Mostre três linhas: Leitura, Casa e Python. Acrescente uma quarta linha com Água e passeio.",
        "hints": [
          "Use uma chamada por linha.",
          "As quatro mensagens são textos separados entre aspas."
        ],
        "solution": "# Cada chamada termina uma linha.\nprint(\"Leitura\")\nprint(\"Casa\")\nprint(\"Python\")\nprint(\"Água e passeio\")",
        "cases": [
          {
            "stdin": "",
            "stdout": "Leitura\nCasa\nPython\nÁgua e passeio\n"
          }
        ]
      },
      {
        "id": "p2-b2",
        "kind": "basic",
        "title": "Separar períodos",
        "prompt": "Mostre Manhã, uma linha vazia e depois Noite.",
        "hints": [
          "Uma chamada sem valores cria a linha vazia.",
          "Use print() entre os dois prints com texto."
        ],
        "solution": "# Uma linha vazia separa os períodos.\nprint(\"Manhã\")\nprint()\nprint(\"Noite\")",
        "cases": [
          {
            "stdin": "",
            "stdout": "Manhã\n\nNoite\n"
          }
        ]
      },
      {
        "id": "p2-b3",
        "kind": "basic",
        "title": "Habilidades na mesma linha",
        "prompt": "Mostre Leitura · Casa · Python usando três valores de print e a opção sep.",
        "hints": [
          "O separador é repetido entre os valores.",
          "Use sep=\" · \", mantendo um espaço de cada lado do ponto central."
        ],
        "solution": "# sep muda a separação entre os três textos.\nprint(\"Leitura\", \"Casa\", \"Python\", sep=\" · \")",
        "cases": [
          {
            "stdin": "",
            "stdout": "Leitura · Casa · Python\n"
          }
        ]
      },
      {
        "id": "p2-b4",
        "kind": "basic",
        "title": "Continuação de recado",
        "prompt": "Use duas chamadas de print para mostrar uma única linha: Próxima missão: Python.",
        "hints": [
          "O primeiro print precisa deixar a linha aberta.",
          "Use end=\"\" no primeiro e mantenha o espaço depois dos dois-pontos."
        ],
        "solution": "# end vazio deixa o próximo print na mesma linha.\nprint(\"Próxima missão: \", end=\"\")\nprint(\"Python.\")",
        "cases": [
          {
            "stdin": "",
            "stdout": "Próxima missão: Python.\n"
          }
        ]
      },
      {
        "id": "p2-e1",
        "kind": "extra",
        "title": "Título e rodapé",
        "prompt": "Mostre Entre Trilhas, uma linha vazia, Praticar com calma. e por fim Fim do painel.",
        "hints": [
          "Planeje quatro linhas de saída, contando a vazia.",
          "Use um print() depois do título e prints normais para as duas frases."
        ],
        "solution": "# Uma pequena composição de título, recado e rodapé.\nprint(\"Entre Trilhas\")\nprint()\nprint(\"Praticar com calma.\")\nprint(\"Fim do painel.\")",
        "cases": [
          {
            "stdin": "",
            "stdout": "Entre Trilhas\n\nPraticar com calma.\nFim do painel.\n"
          }
        ]
      },
      {
        "id": "p2-e2",
        "kind": "extra",
        "title": "Itens com setas",
        "prompt": "Mostre Preparar -> Praticar -> Revisar com três textos e um separador personalizado.",
        "hints": [
          "A seta faz parte de um texto, não de um operador.",
          "Use sep=\" -> \" entre os três valores."
        ],
        "solution": "# A mesma seta separa todos os pares.\nprint(\"Preparar\", \"Praticar\", \"Revisar\", sep=\" -> \")",
        "cases": [
          {
            "stdin": "",
            "stdout": "Preparar -> Praticar -> Revisar\n"
          }
        ]
      },
      {
        "id": "p2-e3",
        "kind": "extra",
        "title": "Sem espaço entre partes",
        "prompt": "Mostre Casa/Python usando três valores: Casa, / e Python, sem espaços.",
        "hints": [
          "O espaço padrão pode ser removido com sep.",
          "Use sep=\"\" para juntar os três textos exatamente."
        ],
        "solution": "# Separador vazio não adiciona espaços.\nprint(\"Casa\", \"/\", \"Python\", sep=\"\")",
        "cases": [
          {
            "stdin": "",
            "stdout": "Casa/Python\n"
          }
        ]
      },
      {
        "id": "p2-e4",
        "kind": "extra",
        "title": "Dois ajustes juntos",
        "prompt": "Use um primeiro print com Leitura e Casa separados por + e sem quebra final. Um segundo print deve completar a mesma linha com = cuidado. A saída exata é Leitura+Casa = cuidado.",
        "hints": [
          "sep controla o meio; end controla o final.",
          "No primeiro print use sep=\"+\" e end=\" \"; no segundo mostre \"= cuidado.\"."
        ],
        "solution": "# O espaço final conecta a segunda chamada.\nprint(\"Leitura\", \"Casa\", sep=\"+\", end=\" \")\nprint(\"= cuidado.\")",
        "cases": [
          {
            "stdin": "",
            "stdout": "Leitura+Casa = cuidado.\n"
          }
        ]
      },
      {
        "id": "p2-e5",
        "kind": "extra",
        "title": "Minipainel legível",
        "prompt": "Mostre Cinco minutos já contam., uma linha vazia e Água | Passeio | Interação em uma terceira linha.",
        "hints": [
          "Combine print normal, print vazio e sep.",
          "O último separador é \" | \", incluindo os espaços."
        ],
        "solution": "# Lembretes não registram cuidados automaticamente.\nprint(\"Cinco minutos já contam.\")\nprint()\nprint(\"Água\", \"Passeio\", \"Interação\", sep=\" | \")",
        "cases": [
          {
            "stdin": "",
            "stdout": "Cinco minutos já contam.\n\nÁgua | Passeio | Interação\n"
          }
        ]
      },
      {
        "id": "p2-e6",
        "kind": "extra",
        "title": "Duas frases, uma linha",
        "prompt": "Mostre Salvei. Executei. Conferi. usando três prints. Só o último deve terminar a linha.",
        "hints": [
          "Os dois primeiros precisam de um espaço no final e sem quebra.",
          "Use end=\" \" nos dois primeiros prints; o terceiro fica normal."
        ],
        "solution": "# O final espaço mantém as palavras separadas na mesma linha.\nprint(\"Salvei.\", end=\" \")\nprint(\"Executei.\", end=\" \")\nprint(\"Conferi.\")",
        "cases": [
          {
            "stdin": "",
            "stdout": "Salvei. Executei. Conferi.\n"
          }
        ]
      }
    ],
    "mistakes": [
      {
        "symptom": "A palavra sep ou end aparece na tela.",
        "investigate": "Confira se colocou sep=\"...\" e end=\"...\" como opções fora das aspas da mensagem. Se escreveu \"sep=...\" como texto, Python apenas o mostra."
      },
      {
        "symptom": "As mensagens ficaram coladas.",
        "investigate": "Veja se usou sep=\"\" ou end=\"\". Acrescente um espaço no separador ou no texto quando desejar separação."
      },
      {
        "symptom": "Há linha a mais ou a menos.",
        "investigate": "Conte os prints: cada print normal encerra uma linha; print() acrescenta uma linha vazia. Compare a saída linha a linha."
      },
      {
        "symptom": "SyntaxError ao usar separador.",
        "investigate": "Confira a vírgula antes de sep ou end e o sinal = da opção. Use print(\"A\", \"B\", sep=\" | \")."
      }
    ],
    "criterion": "Execute os quatro básicos e recrie um painel com pelo menos cinco mensagens, acentos e uma linha em branco. Explique o que sep muda e o que end muda; confirme a saída antes de marcar a fase. Extras são opcionais.",
    "sources": [
      "https://raw.githubusercontent.com/python/cpython/v3.12.0/Doc/library/functions.rst",
      "https://raw.githubusercontent.com/python/cpython/main/Doc/tutorial/introduction.rst"
    ]
  },
  "3": {
    "objective": "Guardar dados da rotina em nomes claros e acompanhar o valor antes e depois de uma atualização.",
    "prerequisites": [
      "Fases 1–2: executar um arquivo, print com mais de um valor e organizar linhas."
    ],
    "preparation": [],
    "explanation": [
      "Uma variável é um nome associado a um valor. Em minutos_lidos = 10, o sinal = atribui o número inteiro 10 ao nome minutos_lidos; ele não pede uma comparação. Depois, print(minutos_lidos) consulta o valor. Sem aspas, Python procura o nome; entre aspas, mostra o próprio texto.",
      "Textos e números são valores diferentes. nome = \"Ana\" guarda texto, também chamado string; minutos = 10 guarda um inteiro. Números usados para contar ficam sem aspas. Você pode mostrar ambos com print(\"Minutos:\", minutos), que inclui um espaço entre o rótulo e o número.",
      "Na expressão minutos_lidos + 5, + soma dois números. Em minutos_lidos = minutos_lidos + 5, Python calcula o lado direito usando o valor antigo e só depois associa o resultado ao nome da esquerda. Assim, 10 passa a 15 sem repetir o valor antigo. A sequência importa: um nome precisa receber valor antes de ser consultado.",
      "Escolha nomes claros usando letras, números e sublinhado, sem espaços e sem começar por número. Usaremos letras minúsculas e sublinhado entre palavras: minutos_lidos. Essa convenção é chamada snake_case. Maiúsculas e minúsculas diferenciam nomes; nome e Nome seriam nomes distintos. Evite usar print como nome, pois ele já tem uma função no Python.",
      "Você pode atribuir um texto novo a um nome: tarefa = \"Leitura\" e depois tarefa = \"Casa\". A nova atribuição não reimprime nada sozinha; é preciso um print depois dela para observar o novo valor. Comentários ajudam a explicar a atualização, sem serem executados."
    ],
    "review": [
      "Mostre dois hábitos na mesma linha com print e um separador. Preveja o espaço entre um rótulo e um valor antes de executar."
    ],
    "example": {
      "code": "minutos_lidos = 10\nprint(\"Antes:\", minutos_lidos)\nminutos_lidos = minutos_lidos + 5\nprint(\"Depois:\", minutos_lidos)\ntarefa = \"Leitura\"\nprint(\"Tarefa:\", tarefa)",
      "stdin": "",
      "stdout": "Antes: 10\nDepois: 15\nTarefa: Leitura\n"
    },
    "exercises": [
      {
        "id": "p3-b1",
        "kind": "basic",
        "title": "Minutos guardados",
        "prompt": "Guarde 10 no nome minutos_lidos. Mostre Minutos: 10 usando o rótulo e o valor da variável.",
        "hints": [
          "Atribua antes de mostrar.",
          "Use minutos_lidos = 10 e print com o rótulo e o nome sem aspas."
        ],
        "solution": "# A variável guarda o número; o print o consulta.\nminutos_lidos = 10\nprint(\"Minutos:\", minutos_lidos)",
        "cases": [
          {
            "stdin": "",
            "stdout": "Minutos: 10\n"
          }
        ]
      },
      {
        "id": "p3-b2",
        "kind": "basic",
        "title": "Somar uma retomada",
        "prompt": "Comece com minutos_lidos igual a 10, mostre Antes: 10, acrescente 5 usando o valor antigo e mostre Depois: 15.",
        "hints": [
          "O lado direito usa o valor que existia antes da atribuição.",
          "A atualização é minutos_lidos = minutos_lidos + 5."
        ],
        "solution": "# Guardamos, mostramos e só então atualizamos o valor.\nminutos_lidos = 10\nprint(\"Antes:\", minutos_lidos)\nminutos_lidos = minutos_lidos + 5\nprint(\"Depois:\", minutos_lidos)",
        "cases": [
          {
            "stdin": "",
            "stdout": "Antes: 10\nDepois: 15\n"
          }
        ]
      },
      {
        "id": "p3-b3",
        "kind": "basic",
        "title": "Trocar a tarefa",
        "prompt": "Guarde Leitura no nome tarefa e mostre Tarefa: Leitura. Troque o valor para Python e mostre Tarefa: Python.",
        "hints": [
          "Textos atribuídos continuam usando aspas.",
          "Faça uma atribuição e um print para cada estado, na ordem pedida."
        ],
        "solution": "# O mesmo nome passa a apontar para outro texto.\ntarefa = \"Leitura\"\nprint(\"Tarefa:\", tarefa)\ntarefa = \"Python\"\nprint(\"Tarefa:\", tarefa)",
        "cases": [
          {
            "stdin": "",
            "stdout": "Tarefa: Leitura\nTarefa: Python\n"
          }
        ]
      },
      {
        "id": "p3-b4",
        "kind": "basic",
        "title": "Dados do dia",
        "prompt": "Crie nome com o texto Ana, minutos_python com 60 e passeios_combinados com 2. Mostre Nome: Ana, Python: 60 e Passeios combinados: 2 em três linhas. O último valor é planejamento, não registro de cuidado.",
        "hints": [
          "Use nomes sem espaços e números sem aspas.",
          "Cada print pode receber um rótulo de texto e uma variável."
        ],
        "solution": "# Os nomes deixam claro que os passeios ainda são um combinado.\nnome = \"Ana\"\nminutos_python = 60\npasseios_combinados = 2\nprint(\"Nome:\", nome)\nprint(\"Python:\", minutos_python)\nprint(\"Passeios combinados:\", passeios_combinados)",
        "cases": [
          {
            "stdin": "",
            "stdout": "Nome: Ana\nPython: 60\nPasseios combinados: 2\n"
          }
        ]
      },
      {
        "id": "p3-e1",
        "kind": "extra",
        "title": "Primeiro ponto",
        "prompt": "Comece com pontos igual a 0. Acrescente 5 e mostre Pontos: 5.",
        "hints": [
          "Zero é um inteiro válido para começar uma contagem.",
          "Atualize pontos usando pontos + 5 antes do print."
        ],
        "solution": "# Uma primeira prática acrescenta pontos fictícios.\npontos = 0\npontos = pontos + 5\nprint(\"Pontos:\", pontos)",
        "cases": [
          {
            "stdin": "",
            "stdout": "Pontos: 5\n"
          }
        ]
      },
      {
        "id": "p3-e2",
        "kind": "extra",
        "title": "Duas atualizações",
        "prompt": "Comece com moedas igual a 2, acrescente 3 e depois 4. Mostre Saldo: 9 apenas ao final.",
        "hints": [
          "Cada atribuição vê o resultado da anterior.",
          "Use duas linhas de atualização moedas = moedas + ... e um print final."
        ],
        "solution": "# Estes são dados fictícios de um exercício, sem ligação com o saldo do app.\nmoedas = 2\nmoedas = moedas + 3\nmoedas = moedas + 4\nprint(\"Saldo:\", moedas)",
        "cases": [
          {
            "stdin": "",
            "stdout": "Saldo: 9\n"
          }
        ]
      },
      {
        "id": "p3-e3",
        "kind": "extra",
        "title": "Cópia de um valor",
        "prompt": "Guarde 10 em minutos_leitura e depois copie esse valor para minutos_planejados. Atualize minutos_leitura para mais 5 e mostre Planejado: 10 e Realizado: 15.",
        "hints": [
          "A atribuição copia o valor atual, não cria uma atualização automática entre os nomes.",
          "Faça minutos_planejados = minutos_leitura antes de atualizar minutos_leitura."
        ],
        "solution": "# A cópia mantém o valor que existia naquele momento.\nminutos_leitura = 10\nminutos_planejados = minutos_leitura\nminutos_leitura = minutos_leitura + 5\nprint(\"Planejado:\", minutos_planejados)\nprint(\"Realizado:\", minutos_leitura)",
        "cases": [
          {
            "stdin": "",
            "stdout": "Planejado: 10\nRealizado: 15\n"
          }
        ]
      },
      {
        "id": "p3-e4",
        "kind": "extra",
        "title": "Rótulo e conteúdo",
        "prompt": "Guarde Casa em tarefa. Em uma linha mostre o próprio nome tarefa; em outra mostre o conteúdo Casa. Use a diferença entre nome com e sem aspas.",
        "hints": [
          "Aspas transformam o que está dentro em texto literal.",
          "Primeiro print(\"tarefa\"); depois print(tarefa), após atribuir o texto Casa."
        ],
        "solution": "# O nome escrito como texto é diferente da consulta ao valor.\ntarefa = \"Casa\"\nprint(\"tarefa\")\nprint(tarefa)",
        "cases": [
          {
            "stdin": "",
            "stdout": "tarefa\nCasa\n"
          }
        ]
      },
      {
        "id": "p3-e5",
        "kind": "extra",
        "title": "Leitura em duas etapas",
        "prompt": "Guarde 5 em minutos_manha e 10 em minutos_noite. Some esses dois valores em minutos_totais e mostre Leitura total: 15.",
        "hints": [
          "O operador + também soma valores guardados em nomes.",
          "Calcule minutos_totais = minutos_manha + minutos_noite."
        ],
        "solution": "# O nome do total explica o que a soma representa.\nminutos_manha = 5\nminutos_noite = 10\nminutos_totais = minutos_manha + minutos_noite\nprint(\"Leitura total:\", minutos_totais)",
        "cases": [
          {
            "stdin": "",
            "stdout": "Leitura total: 15\n"
          }
        ]
      },
      {
        "id": "p3-e6",
        "kind": "extra",
        "title": "Corrigir nome trocado",
        "prompt": "Um rascunho atribuiu 2 a passeios_combinados mas tentou imprimir Passeios_combinados. Reescreva usando o mesmo nome em ambas as linhas e mostre Combinados: 2.",
        "hints": [
          "Maiúsculas mudam o nome da variável.",
          "Escolha passeios_combinados, com p minúsculo, na atribuição e no print."
        ],
        "solution": "# Mantemos a mesma grafia nas duas linhas.\npasseios_combinados = 2\nprint(\"Combinados:\", passeios_combinados)",
        "cases": [
          {
            "stdin": "",
            "stdout": "Combinados: 2\n"
          }
        ]
      }
    ],
    "mistakes": [
      {
        "symptom": "A saída mostra minutos_lidos em vez de 10.",
        "investigate": "Você escreveu o nome entre aspas? print(\"minutos_lidos\") mostra o rótulo; print(minutos_lidos) consulta o valor."
      },
      {
        "symptom": "NameError ao mostrar um valor.",
        "investigate": "Confira a grafia e se a atribuição veio antes do print. minutos_lidos e Minutos_lidos são nomes diferentes."
      },
      {
        "symptom": "A soma não funcionou com \"10\".",
        "investigate": "Confira se colocou aspas em um número que pretendia somar. Nesta fase conte minutos com inteiros sem aspas."
      },
      {
        "symptom": "SyntaxError em um nome como minutos lidos ou 2passeios.",
        "investigate": "Use minutos_lidos e passeios_2: sem espaços e sem dígito na primeira posição."
      }
    ],
    "criterion": "Execute os quatro básicos, mostrando o antes e o depois de uma atualização numérica e de uma troca de texto. Explique o significado de três nomes escolhidos e a ordem de cálculo do lado direito de =. Extras são opcionais.",
    "sources": [
      "https://raw.githubusercontent.com/python/cpython/main/Doc/tutorial/introduction.rst"
    ]
  },
  "4": {
    "objective": "Calcular pontos fictícios, minutos e quantidades inteiras, prevendo e conferindo cada resultado.",
    "prerequisites": [
      "Fases 1–3: print, variáveis numéricas, atribuição e soma com +."
    ],
    "preparation": [],
    "explanation": [
      "Podemos combinar inteiros com + (soma), - (subtração) e * (multiplicação). Em pontos = 15 * 2, cada minuto fictício vale dois pontos. Esses números são de um exercício local; não alteram as regras nem o saldo do Entre Trilhas.",
      "A divisão comum / produz um número com parte decimal: 5 / 2 resulta em 2.5. Python escreve a parte decimal com ponto, não vírgula. Um número assim é chamado float. Divisão por zero não tem resultado e gera ZeroDivisionError; os divisores dos exercícios são positivos.",
      "Com contagens não negativas, // informa quantos grupos completos cabem, e % informa o resto. Em 125 // 60 temos 2 horas completas; 125 % 60 resulta em 5 minutos restantes. Se a divisão for exata, o resto é zero. Para as quantidades desta fase usamos inteiros não negativos e divisores positivos, sem arredondar valores monetários reais.",
      "Multiplicação, /, // e % têm prioridade sobre soma e subtração. Parênteses mudam a ordem: (10 + 5) * 2 produz 30; 10 + 5 * 2 produz 20. Com operações de mesma prioridade, Python calcula da esquerda para a direita. Use parênteses para deixar a intenção clara.",
      "Preveja a conta no papel antes de executar. Para investigar um cálculo, guarde uma etapa por variável e use prints com rótulos. Um resto deve ficar entre zero e um valor menor que o divisor nestes exemplos. Tempo de pausa ocupa a agenda, mas não soma minutos ativos de prática."
    ],
    "review": [
      "Crie minutos_lidos = 10 e atualize para mais 5. Explique por que a atribuição calcula o lado direito antes de mudar o nome."
    ],
    "example": {
      "code": "primeiro_bloco = 60\nsegundo_bloco = 60\npausa = 10\npratica = primeiro_bloco + segundo_bloco\nocupacao = pratica + pausa\npontos = pratica * 2\nprint(\"Prática:\", pratica)\nprint(\"Agenda:\", ocupacao)\nprint(\"Pontos fictícios:\", pontos)",
      "stdin": "",
      "stdout": "Prática: 120\nAgenda: 130\nPontos fictícios: 240\n"
    },
    "exercises": [
      {
        "id": "p4-b1",
        "kind": "basic",
        "title": "Pontos de duas práticas",
        "prompt": "Considere 15 minutos de leitura e 25 de Python. Some os minutos, use dois pontos fictícios por minuto e mostre Minutos: 40 e Pontos: 80.",
        "hints": [
          "Some os minutos antes de multiplicar a contagem total.",
          "Guarde total = leitura + python e depois pontos = total * 2."
        ],
        "solution": "# A taxa é apenas uma regra fictícia deste exercício.\nleitura = 15\npython = 25\ntotal = leitura + python\npontos = total * 2\nprint(\"Minutos:\", total)\nprint(\"Pontos:\", pontos)",
        "cases": [
          {
            "stdin": "",
            "stdout": "Minutos: 40\nPontos: 80\n"
          }
        ]
      },
      {
        "id": "p4-b2",
        "kind": "basic",
        "title": "Duas divisões e o resto",
        "prompt": "Com 5 minutos divididos em grupos de 2, mostre Divisão: 2.5, Grupos: 2 e Resto: 1.",
        "hints": [
          "Compare /, // e % usando os mesmos valores.",
          "A divisão comum é 5 / 2; grupos são 5 // 2 e resto é 5 % 2."
        ],
        "solution": "# As três operações respondem perguntas diferentes.\nminutos = 5\ntamanho_grupo = 2\nprint(\"Divisão:\", minutos / tamanho_grupo)\nprint(\"Grupos:\", minutos // tamanho_grupo)\nprint(\"Resto:\", minutos % tamanho_grupo)",
        "cases": [
          {
            "stdin": "",
            "stdout": "Divisão: 2.5\nGrupos: 2\nResto: 1\n"
          }
        ]
      },
      {
        "id": "p4-b3",
        "kind": "basic",
        "title": "Converter minutos",
        "prompt": "Guarde 125 em minutos. Mostre Horas: 2 e Minutos restantes: 5 usando grupos de 60, sem escrever os resultados diretamente.",
        "hints": [
          "Uma hora tem 60 minutos; procure grupos completos e sobra.",
          "Calcule horas = minutos // 60 e restantes = minutos % 60."
        ],
        "solution": "# A divisão inteira e o resto mantêm unidades claras.\nminutos = 125\nhoras = minutos // 60\nrestantes = minutos % 60\nprint(\"Horas:\", horas)\nprint(\"Minutos restantes:\", restantes)",
        "cases": [
          {
            "stdin": "",
            "stdout": "Horas: 2\nMinutos restantes: 5\n"
          }
        ]
      },
      {
        "id": "p4-b4",
        "kind": "basic",
        "title": "Prioridade visível",
        "prompt": "Calcule e mostre Sem parênteses: 20 para 10 + 5 * 2 e Com parênteses: 30 para (10 + 5) * 2. Confira ambos no papel.",
        "hints": [
          "A multiplicação vem antes da soma, salvo parênteses.",
          "Mantenha a mesma ordem dos números e mude apenas o agrupamento."
        ],
        "solution": "# Parênteses tornam explícito o que deve acontecer primeiro.\nsem_parenteses = 10 + 5 * 2\ncom_parenteses = (10 + 5) * 2\nprint(\"Sem parênteses:\", sem_parenteses)\nprint(\"Com parênteses:\", com_parenteses)",
        "cases": [
          {
            "stdin": "",
            "stdout": "Sem parênteses: 20\nCom parênteses: 30\n"
          }
        ]
      },
      {
        "id": "p4-e1",
        "kind": "extra",
        "title": "Loja de papel",
        "prompt": "Você tem 47 moedas fictícias e cada extra custa 15. Mostre Extras: 3 e Sobra: 2, sem criar uma compra no aplicativo.",
        "hints": [
          "O total de extras completos usa //; a sobra usa %.",
          "Use saldo // preco e saldo % preco."
        ],
        "solution": "# Uma simulação numérica não cria tempo ou saldo no aplicativo.\nsaldo = 47\npreco = 15\nprint(\"Extras:\", saldo // preco)\nprint(\"Sobra:\", saldo % preco)",
        "cases": [
          {
            "stdin": "",
            "stdout": "Extras: 3\nSobra: 2\n"
          }
        ]
      },
      {
        "id": "p4-e2",
        "kind": "extra",
        "title": "Prática e ocupação",
        "prompt": "Calcule dois blocos de 60 minutos e uma pausa de 10. Mostre Estudo: 120, Pausa: 10 e Agenda: 130. Não inclua a pausa nos minutos de estudo.",
        "hints": [
          "Crie nomes distintos para estudo, pausa e agenda.",
          "estudo = 60 + 60; agenda = estudo + pausa."
        ],
        "solution": "# A pausa conta na agenda, sem contar como prática.\nprimeiro_bloco = 60\nsegundo_bloco = 60\npausa = 10\nestudo = primeiro_bloco + segundo_bloco\nagenda = estudo + pausa\nprint(\"Estudo:\", estudo)\nprint(\"Pausa:\", pausa)\nprint(\"Agenda:\", agenda)",
        "cases": [
          {
            "stdin": "",
            "stdout": "Estudo: 120\nPausa: 10\nAgenda: 130\n"
          }
        ]
      },
      {
        "id": "p4-e3",
        "kind": "extra",
        "title": "Bordas de uma hora",
        "prompt": "Escreva uma chamada por linha para mostrar o formato minutos horas resto para 0, 59, 60 e 61 minutos. Use // e % em cada linha. Preveja a divisão exata e o instante anterior e posterior.",
        "hints": [
          "Você pode atribuir um novo valor a minutos antes de cada print.",
          "Em cada linha use print(minutos, minutos // 60, minutos % 60)."
        ],
        "solution": "# Valores de borda revelam a passagem para a próxima hora.\nminutos = 0\nprint(minutos, minutos // 60, minutos % 60)\nminutos = 59\nprint(minutos, minutos // 60, minutos % 60)\nminutos = 60\nprint(minutos, minutos // 60, minutos % 60)\nminutos = 61\nprint(minutos, minutos // 60, minutos % 60)",
        "cases": [
          {
            "stdin": "",
            "stdout": "0 0 0\n59 0 59\n60 1 0\n61 1 1\n"
          }
        ]
      },
      {
        "id": "p4-e4",
        "kind": "extra",
        "title": "Tempo restante",
        "prompt": "Uma janela livre fictícia tem 90 minutos. Você reservou 25 para leitura e 20 para casa. Mostre Minutos restantes: 45 usando subtração.",
        "hints": [
          "Subtraia as duas atividades da janela total.",
          "Use restantes = janela - leitura - casa."
        ],
        "solution": "# Janela fictícia de exercício, sem replanejar a rotina real.\njanela = 90\nleitura = 25\ncasa = 20\nrestantes = janela - leitura - casa\nprint(\"Minutos restantes:\", restantes)",
        "cases": [
          {
            "stdin": "",
            "stdout": "Minutos restantes: 45\n"
          }
        ]
      },
      {
        "id": "p4-e5",
        "kind": "extra",
        "title": "Divisão exata",
        "prompt": "Uma recompensa fictícia custa 12 moedas e o saldo é 36. Mostre Quantidade: 3 e Sobra: 0 usando divisão inteira e resto.",
        "hints": [
          "Uma divisão exata tem resto zero.",
          "Use saldo // preco para quantidade e saldo % preco para sobra."
        ],
        "solution": "# Dividir exatamente é um caso de borda importante.\nsaldo = 36\npreco = 12\nprint(\"Quantidade:\", saldo // preco)\nprint(\"Sobra:\", saldo % preco)",
        "cases": [
          {
            "stdin": "",
            "stdout": "Quantidade: 3\nSobra: 0\n"
          }
        ]
      },
      {
        "id": "p4-e6",
        "kind": "extra",
        "title": "Total por parcelas",
        "prompt": "Quatro atividades fictícias deram 5, 10, 15 e 20 pontos. Guarde cada parcela, some tudo e mostre Pontos totais: 50. Depois mostre Pontos após correção: 40 retirando 10, sem mudar o total original.",
        "hints": [
          "Guarde um segundo resultado em outro nome.",
          "total soma as quatro parcelas; corrigido = total - 10."
        ],
        "solution": "# Um segundo nome preserva o total antes da correção.\nleitura = 5\ncasa = 10\ncuidado = 15\npython = 20\ntotal = leitura + casa + cuidado + python\ncorrigido = total - 10\nprint(\"Pontos totais:\", total)\nprint(\"Pontos após correção:\", corrigido)",
        "cases": [
          {
            "stdin": "",
            "stdout": "Pontos totais: 50\nPontos após correção: 40\n"
          }
        ]
      }
    ],
    "mistakes": [
      {
        "symptom": "Uma conta saiu diferente da previsão.",
        "investigate": "Confira a prioridade e acrescente parênteses. Mostre cada valor intermediário com print, em vez de tentar depurar uma linha enorme."
      },
      {
        "symptom": "5 / 2 mostrou 2.5, e não 2.",
        "investigate": "/ é divisão comum. Para contar grupos completos não negativos, use //; para saber o que sobrou, use %."
      },
      {
        "symptom": "ZeroDivisionError.",
        "investigate": "Examine o valor à direita de /, // ou %. Ele não pode ser zero. Corrija o dado e execute novamente; tratamento automático fica para uma fase posterior."
      },
      {
        "symptom": "O total de prática incluiu os dez minutos de pausa.",
        "investigate": "Separe pratica de ocupacao. Some a pausa só à ocupação da agenda, sem inventar minutos de estudo."
      }
    ],
    "criterion": "Execute os quatro básicos e confira no papel pelo menos cinco resultados, incluindo /, // e %. Explique por que 125 minutos viram 2 horas e 5 minutos e por que a pausa não entra no tempo ativo. Extras são opcionais.",
    "sources": [
      "https://raw.githubusercontent.com/python/cpython/main/Doc/tutorial/introduction.rst"
    ]
  },
  "5": {
    "objective": "Criar mensagens com dados variáveis e preparar nomes de hábitos sem destruir o texto original.",
    "prerequisites": [
      "Fases 1–4: textos, variáveis, print e cálculos com números."
    ],
    "preparation": [],
    "explanation": [
      "Texto também é chamado string, abreviado str no Python. Uma f-string mistura texto e valores: com nome = \"Ana\" e pontos = 20, print(f\"Olá, {nome}! Pontos: {pontos}.\") mostra os valores nos lugares entre chaves. O f vem antes da aspa inicial; as chaves consultam uma variável ou calculam uma expressão já conhecida, como {minutos * 2}.",
      "Algumas operações de texto são chamadas métodos. Usamos um ponto depois do texto ou do nome e depois o método com parênteses: nome.strip(). strip() devolve um texto sem espaços em branco nas bordas; não remove espaços entre palavras. Como o texto original não muda sozinho, guarde o resultado em outro nome: limpo = nome.strip().",
      "casefold() devolve uma forma de texto adequada a comparações sem distinguir maiúsculas e minúsculas. chave = nome.strip().casefold() primeiro remove espaços das bordas e depois transforma as letras. Ainda não faremos comparações no código: nesta fase mostre original e chave para conferir visualmente. Acentos não são removidos: Água vira água, não agua.",
      "len(texto) informa o comprimento do texto, contando espaços também. Para as palavras simples usadas aqui, corresponde à contagem de letras e espaços; textos com combinações de acentos ou emojis podem ter contagens diferentes do número de símbolos que você percebe. O texto vazio \"\" tem comprimento zero.",
      "replace(\"antigo\", \"novo\") devolve um texto trocando todas as ocorrências exatas do primeiro trecho pelo segundo: tarefa.replace(\"Ler\", \"Revisar\"). A troca distingue maiúsculas e minúsculas. Como os demais métodos desta fase, não altera o texto original. Guarde o resultado em uma nova variável e confira os dois valores.",
      "Use colchetes apenas como caracteres dentro da mensagem, por exemplo print(f\"Nome: [{nome}]\"): eles ajudam a enxergar espaços nas bordas da saída e não criam nenhuma estrutura nova em Python. Todos os dados desta fase estão no arquivo; pedir dados pelo teclado será a próxima fase."
    ],
    "review": [
      "Preveja 125 // 60 e 125 % 60. Depois mostre um nome e uma quantidade com print usando dois valores; a f-string fará esse encaixe de outra forma."
    ],
    "example": {
      "code": "nome = \" Leitura \"\npontos = 15\nchave = nome.strip().casefold()\nprint(f\"Original: [{nome}]\")\nprint(f\"Chave: [{chave}]\")\nprint(f\"Hábito {chave}: {pontos} pontos.\")\nprint(\"Comprimento:\", len(chave))",
      "stdin": "",
      "stdout": "Original: [ Leitura ]\nChave: [leitura]\nHábito leitura: 15 pontos.\nComprimento: 7\n"
    },
    "exercises": [
      {
        "id": "p5-b1",
        "kind": "basic",
        "title": "Frase com saldo fictício",
        "prompt": "Guarde Ana em nome e 20 em saldo. Use uma f-string para mostrar Ana tem 20 moedas fictícias.",
        "hints": [
          "A letra f antes das aspas habilita as chaves.",
          "Coloque {nome} e {saldo} nos lugares dos valores da frase."
        ],
        "solution": "# A mensagem usa os valores sem transformar o saldo manualmente em texto.\nnome = \"Ana\"\nsaldo = 20\nprint(f\"{nome} tem {saldo} moedas fictícias.\")",
        "cases": [
          {
            "stdin": "",
            "stdout": "Ana tem 20 moedas fictícias.\n"
          }
        ]
      },
      {
        "id": "p5-b2",
        "kind": "basic",
        "title": "Remover só as bordas",
        "prompt": "Guarde \"  Cuidar da casa  \" em nome. Crie limpo com strip e mostre Original: [  Cuidar da casa  ] e Limpo: [Cuidar da casa], preservando os espaços internos.",
        "hints": [
          "strip devolve um novo texto; use outro nome.",
          "Coloque os valores entre colchetes dentro das f-strings para tornar os espaços visíveis."
        ],
        "solution": "# Os colchetes são apenas caracteres da saída.\nnome = \"  Cuidar da casa  \"\nlimpo = nome.strip()\nprint(f\"Original: [{nome}]\")\nprint(f\"Limpo: [{limpo}]\")",
        "cases": [
          {
            "stdin": "",
            "stdout": "Original: [  Cuidar da casa  ]\nLimpo: [Cuidar da casa]\n"
          }
        ]
      },
      {
        "id": "p5-b3",
        "kind": "basic",
        "title": "Chave de hábito",
        "prompt": "Guarde \" Leitura \" em nome. Crie chave usando strip e depois casefold, e mostre apenas leitura. Depois confira visualmente o resultado trocando a palavra do arquivo por outra com maiúsculas.",
        "hints": [
          "Você pode aplicar casefold ao resultado de strip.",
          "Use chave = nome.strip().casefold() e imprima chave sem aspas."
        ],
        "solution": "# A chave é uma forma padronizada; nome continua preservado.\nnome = \" Leitura \"\nchave = nome.strip().casefold()\nprint(chave)",
        "cases": [
          {
            "stdin": "",
            "stdout": "leitura\n"
          }
        ]
      },
      {
        "id": "p5-b4",
        "kind": "basic",
        "title": "Contar o nome limpo",
        "prompt": "Guarde \" Python \" em nome, retire as bordas em limpo e mostre Nome: Python e Letras: 6 usando f-string e len.",
        "hints": [
          "Conte o texto limpo, sem os espaços de fora.",
          "Use len(limpo) dentro das chaves da segunda f-string."
        ],
        "solution": "# O comprimento do texto limpo não inclui os espaços retirados.\nnome = \" Python \"\nlimpo = nome.strip()\nprint(f\"Nome: {limpo}\")\nprint(f\"Letras: {len(limpo)}\")",
        "cases": [
          {
            "stdin": "",
            "stdout": "Nome: Python\nLetras: 6\n"
          }
        ]
      },
      {
        "id": "p5-e1",
        "kind": "extra",
        "title": "Novo verbo",
        "prompt": "Guarde Ler duas páginas. em tarefa. Use replace para produzir Revisar duas páginas. sem mudar tarefa. Mostre Original: Ler duas páginas. e Revisada: Revisar duas páginas.",
        "hints": [
          "Troque apenas o trecho Ler.",
          "Guarde revisada = tarefa.replace(\"Ler\", \"Revisar\") e mostre ambos."
        ],
        "solution": "# replace devolve outro texto; guardamos esse resultado em revisada.\ntarefa = \"Ler duas páginas.\"\nrevisada = tarefa.replace(\"Ler\", \"Revisar\")\nprint(f\"Original: {tarefa}\")\nprint(f\"Revisada: {revisada}\")",
        "cases": [
          {
            "stdin": "",
            "stdout": "Original: Ler duas páginas.\nRevisada: Revisar duas páginas.\n"
          }
        ]
      },
      {
        "id": "p5-e2",
        "kind": "extra",
        "title": "Cálculo na mensagem",
        "prompt": "Guarde 15 em minutos. Use uma f-string para mostrar 15 minutos renderiam 30 pontos fictícios., calculando o dobro dentro das chaves.",
        "hints": [
          "As chaves aceitam a multiplicação que você já conhece.",
          "Use {minutos} para a contagem e {minutos * 2} para os pontos."
        ],
        "solution": "# O cálculo fica explícito, sem alterar a pontuação real do aplicativo.\nminutos = 15\nprint(f\"{minutos} minutos renderiam {minutos * 2} pontos fictícios.\")",
        "cases": [
          {
            "stdin": "",
            "stdout": "15 minutos renderiam 30 pontos fictícios.\n"
          }
        ]
      },
      {
        "id": "p5-e3",
        "kind": "extra",
        "title": "Espaços do meio",
        "prompt": "Guarde \"  Água e passeio  \" em nome. Mostre Limpo: [Água e passeio] e Tamanho: 14. Confira que strip não apaga os espaços entre as palavras.",
        "hints": [
          "Conte também os dois espaços internos ao usar len.",
          "Use limpo = nome.strip(), depois mostre limpo e len(limpo)."
        ],
        "solution": "# Os espaços entre Água, e e passeio fazem parte do nome.\nnome = \"  Água e passeio  \"\nlimpo = nome.strip()\nprint(f\"Limpo: [{limpo}]\")\nprint(f\"Tamanho: {len(limpo)}\")",
        "cases": [
          {
            "stdin": "",
            "stdout": "Limpo: [Água e passeio]\nTamanho: 14\n"
          }
        ]
      },
      {
        "id": "p5-e4",
        "kind": "extra",
        "title": "Nome só com espaços",
        "prompt": "Guarde três espaços em nome. Use strip e mostre Nome: [] e Tamanho: 0. Esse caso de borda revela que um nome pode ficar vazio depois de limpar.",
        "hints": [
          "O texto limpo terá zero caracteres.",
          "Use limpo = nome.strip() e imprima limpo entre colchetes e len(limpo)."
        ],
        "solution": "# Ainda não decidimos o que fazer com nome vazio; apenas observamos o resultado.\nnome = \"   \"\nlimpo = nome.strip()\nprint(f\"Nome: [{limpo}]\")\nprint(f\"Tamanho: {len(limpo)}\")",
        "cases": [
          {
            "stdin": "",
            "stdout": "Nome: []\nTamanho: 0\n"
          }
        ]
      },
      {
        "id": "p5-e5",
        "kind": "extra",
        "title": "Acento preservado",
        "prompt": "Guarde \" ÁGUA \" em nome. Limpe as bordas, aplique casefold e mostre Chave: água e Original: [ ÁGUA ]. Não remova o acento.",
        "hints": [
          "casefold não é uma operação para retirar acentos.",
          "Use chave = nome.strip().casefold() e mantenha nome para a segunda mensagem."
        ],
        "solution": "# O acento continua na forma padronizada.\nnome = \" ÁGUA \"\nchave = nome.strip().casefold()\nprint(f\"Chave: {chave}\")\nprint(f\"Original: [{nome}]\")",
        "cases": [
          {
            "stdin": "",
            "stdout": "Chave: água\nOriginal: [ ÁGUA ]\n"
          }
        ]
      },
      {
        "id": "p5-e6",
        "kind": "extra",
        "title": "Troca repetida",
        "prompt": "Guarde Ler, Ler e descansar. em plano. Troque Ler por Revisar com replace e mostre Revisar, Revisar e descansar. Depois mostre Original: Ler, Ler e descansar.",
        "hints": [
          "replace troca todas as ocorrências exatas por padrão.",
          "Guarde novo_plano = plano.replace(\"Ler\", \"Revisar\") e mostre o original em outra linha."
        ],
        "solution": "# Uma única chamada troca as duas ocorrências com a mesma grafia.\nplano = \"Ler, Ler e descansar.\"\nnovo_plano = plano.replace(\"Ler\", \"Revisar\")\nprint(novo_plano)\nprint(f\"Original: {plano}\")",
        "cases": [
          {
            "stdin": "",
            "stdout": "Revisar, Revisar e descansar.\nOriginal: Ler, Ler e descansar.\n"
          }
        ]
      }
    ],
    "mistakes": [
      {
        "symptom": "A saída mostra {nome} literalmente.",
        "investigate": "Confira se o f está imediatamente antes da aspa inicial da mensagem. Uma string comum não substitui o conteúdo entre chaves."
      },
      {
        "symptom": "Os espaços continuaram no nome.",
        "investigate": "Verifique se você guardou e imprimiu o resultado de strip(). O nome original não muda sem uma nova atribuição; espaços internos são preservados de propósito."
      },
      {
        "symptom": "Uma palavra acentuada ficou diferente do esperado.",
        "investigate": "casefold muda a forma das letras, mas não retira acentos. Observe original e chave com prints separados."
      },
      {
        "symptom": "AttributeError em um método de texto.",
        "investigate": "Confira a grafia, os parênteses e o tipo do dado: strip, casefold e replace são usados em texto, não diretamente em um número inteiro."
      },
      {
        "symptom": "replace não trocou o trecho.",
        "investigate": "Confira letras maiúsculas, acentos e espaços do trecho procurado. A troca exige que o trecho corresponda exatamente."
      }
    ],
    "criterion": "Execute os quatro básicos, mostre nome e pontos em uma f-string e apresente o texto original ao lado de sua versão limpa. Explique o que strip e casefold fizeram e por que o original foi preservado. Extras são opcionais.",
    "sources": [
      "https://raw.githubusercontent.com/python/cpython/v3.12.0/Doc/tutorial/inputoutput.rst",
      "https://raw.githubusercontent.com/python/cpython/v3.12.0/Doc/library/stdtypes.rst",
      "https://raw.githubusercontent.com/python/cpython/v3.12.0/Doc/library/functions.rst"
    ]
  },
  "6": {
    "objective": "Pedir nome e minutos pelo teclado, converter inteiros e conferir resultados e erros de entrada.",
    "prerequisites": [
      "Fases 1–5: executar arquivos, variáveis, cálculos, f-strings e métodos de texto."
    ],
    "preparation": [],
    "explanation": [
      "input(\"Nome: \") mostra o texto Nome: e espera que você digite uma linha e aperte Enter. O texto dentro dos parênteses é chamado mensagem de entrada ou prompt. A resposta não precisa de aspas: digite Ana, não \"Ana\". Guarde a resposta em uma variável para usá-la depois.",
      "input sempre devolve texto. Se você digitar 12, a resposta é o texto \"12\", não um número para calcular. int(texto) tenta converter esse texto em um número inteiro. Use minutos = int(input(\"Minutos: \")): primeiro input recebe a resposta, depois int converte, e só então = guarda o inteiro.",
      "int aceita inteiros escritos como 0, 12 e -3, além de espaços nas bordas de um número, como \" 12 \". Minutos de estudo reais não devem ser negativos; por enquanto essa conversão apenas mostra que o sinal é aceito, sem validar a regra do mundo real. Não registre valores fictícios no app. Regras de validação e decisões serão estudadas depois.",
      "Para estes exercícios use inteiros não negativos nas entradas válidas. Texto como abc, uma linha vazia ou 2.5 não representam inteiros aceitos por int e provocam ValueError. Quando isso acontecer, leia a última linha do erro, localize a conversão e execute novamente com uma entrada válida. Nesta fase investigamos a falha; não vamos ocultá-la nem usar tratamento automático ainda.",
      "Em um console interativo, o que você digita geralmente aparece ao lado do prompt. Aqui a Entrada informada mostra cada resposta em uma linha; a Saída esperada contém somente o texto escrito pelo programa, incluindo os prompts, sem repetir o que você digitou. Assim, dois prompts consecutivos podem aparecer juntos na saída capturada. Não copie essa saída como resposta: no IDLE responda a um prompt de cada vez.",
      "Desafio de investigação, não mais um exercício resolvido: execute um dos programas com uma palavra no campo de minutos e com entrada vazia, anote o ValueError e depois recupere uma execução válida. Nenhum erro do rascunho tira progresso ou pontos do aplicativo."
    ],
    "review": [
      "Crie uma f-string com um nome e uma contagem, depois limpe um nome com strip. Explique por que o texto original não muda sozinho."
    ],
    "example": {
      "code": "nome = input(\"Nome: \").strip()\nminutos = int(input(\"Minutos: \"))\npontos = minutos * 2\nprint(f\"{nome} praticou {minutos} minutos.\")\nprint(f\"Pontos fictícios: {pontos}\")",
      "stdin": "Ana\n12\n",
      "stdout": "Nome: Minutos: Ana praticou 12 minutos.\nPontos fictícios: 24\n"
    },
    "exercises": [
      {
        "id": "p6-b1",
        "kind": "basic",
        "title": "Boas-vindas pelo teclado",
        "prompt": "Peça Nome: e mostre Olá, Ana! quando a pessoa digitar Ana. Limpe espaços das bordas do nome antes da mensagem.",
        "hints": [
          "Guarde o retorno de input e use strip.",
          "Use nome = input(\"Nome: \").strip() e uma f-string no print."
        ],
        "solution": "# A resposta vira texto e perde apenas os espaços das bordas.\nnome = input(\"Nome: \").strip()\nprint(f\"Olá, {nome}!\")",
        "cases": [
          {
            "stdin": "Ana\n",
            "stdout": "Nome: Olá, Ana!\n"
          },
          {
            "stdin": "  João  \n",
            "stdout": "Nome: Olá, João!\n"
          }
        ]
      },
      {
        "id": "p6-b2",
        "kind": "basic",
        "title": "Minutos em pontos",
        "prompt": "Peça Minutos: , converta a resposta para inteiro, calcule o dobro e mostre Pontos: 24 para a entrada 12. Teste também zero. Entradas inválidas devem revelar ValueError; ainda não há validação automática.",
        "hints": [
          "Converta o texto antes da multiplicação.",
          "Use minutos = int(input(\"Minutos: \")), pontos = minutos * 2 e print com o rótulo."
        ],
        "solution": "# int torna possível calcular com o número informado.\nminutos = int(input(\"Minutos: \"))\npontos = minutos * 2\nprint(\"Pontos:\", pontos)",
        "cases": [
          {
            "stdin": "12\n",
            "stdout": "Minutos: Pontos: 24\n"
          },
          {
            "stdin": "0\n",
            "stdout": "Minutos: Pontos: 0\n"
          },
          {
            "stdin": " 12 \n",
            "stdout": "Minutos: Pontos: 24\n"
          },
          {
            "stdin": "abc\n",
            "stdout": "Minutos: ",
            "error": "ValueError"
          },
          {
            "stdin": "\n",
            "stdout": "Minutos: ",
            "error": "ValueError"
          }
        ]
      },
      {
        "id": "p6-b3",
        "kind": "basic",
        "title": "Somar dois blocos",
        "prompt": "Peça Primeiro bloco: e Segundo bloco: , converta ambas as respostas para inteiros e mostre Prática: 120 para 60 e 60. Não inclua pausa no total.",
        "hints": [
          "Cada resposta precisa de sua própria conversão.",
          "Crie primeiro e segundo com int(input(...)), depois some os dois inteiros."
        ],
        "solution": "# A soma inclui só os minutos ativos dos dois blocos.\nprimeiro = int(input(\"Primeiro bloco: \"))\nsegundo = int(input(\"Segundo bloco: \"))\ntotal = primeiro + segundo\nprint(\"Prática:\", total)",
        "cases": [
          {
            "stdin": "60\n60\n",
            "stdout": "Primeiro bloco: Segundo bloco: Prática: 120\n"
          },
          {
            "stdin": "0\n5\n",
            "stdout": "Primeiro bloco: Segundo bloco: Prática: 5\n"
          }
        ]
      },
      {
        "id": "p6-b4",
        "kind": "basic",
        "title": "Hábito informado",
        "prompt": "Peça Hábito: , limpe espaços das bordas e aplique casefold. Mostre Chave: leitura e Caracteres: 7 para a entrada \" Leitura \".",
        "hints": [
          "input devolve texto, então você já pode aplicar os métodos.",
          "Crie chave = input(\"Hábito: \").strip().casefold() e use len(chave)."
        ],
        "solution": "# A forma padronizada mantém os acentos e remove só as bordas.\nchave = input(\"Hábito: \").strip().casefold()\nprint(f\"Chave: {chave}\")\nprint(f\"Caracteres: {len(chave)}\")",
        "cases": [
          {
            "stdin": " Leitura \n",
            "stdout": "Hábito: Chave: leitura\nCaracteres: 7\n"
          },
          {
            "stdin": " ÁGUA \n",
            "stdout": "Hábito: Chave: água\nCaracteres: 4\n"
          },
          {
            "stdin": "   \n",
            "stdout": "Hábito: Chave: \nCaracteres: 0\n"
          }
        ]
      },
      {
        "id": "p6-e1",
        "kind": "extra",
        "title": "Converter uma duração",
        "prompt": "Peça Minutos: e mostre Horas: 2 e Minutos restantes: 5 para a entrada 125. Teste também 0, 59, 60 e 61.",
        "hints": [
          "Converta a resposta com int e reutilize a conta da fase 4.",
          "Horas completas são minutos // 60 e o resto é minutos % 60."
        ],
        "solution": "# A conversão separa o texto recebido da aritmética.\nminutos = int(input(\"Minutos: \"))\nprint(\"Horas:\", minutos // 60)\nprint(\"Minutos restantes:\", minutos % 60)",
        "cases": [
          {
            "stdin": "125\n",
            "stdout": "Minutos: Horas: 2\nMinutos restantes: 5\n"
          },
          {
            "stdin": "0\n",
            "stdout": "Minutos: Horas: 0\nMinutos restantes: 0\n"
          },
          {
            "stdin": "59\n",
            "stdout": "Minutos: Horas: 0\nMinutos restantes: 59\n"
          },
          {
            "stdin": "60\n",
            "stdout": "Minutos: Horas: 1\nMinutos restantes: 0\n"
          },
          {
            "stdin": "61\n",
            "stdout": "Minutos: Horas: 1\nMinutos restantes: 1\n"
          }
        ]
      },
      {
        "id": "p6-e2",
        "kind": "extra",
        "title": "Diferença para uma meta",
        "prompt": "Peça Meta: e Realizado: como inteiros e mostre Diferença: 5 para 15 e 10. A diferença é meta menos realizado; se for negativa, apenas observe o número, sem mensagem condicional.",
        "hints": [
          "Uma subtração pode produzir um número negativo e não exige nenhuma decisão.",
          "Use diferenca = meta - realizado e imprima o resultado."
        ],
        "solution": "# O resultado é uma diferença numérica, não uma cobrança.\nmeta = int(input(\"Meta: \"))\nrealizado = int(input(\"Realizado: \"))\ndiferenca = meta - realizado\nprint(\"Diferença:\", diferenca)",
        "cases": [
          {
            "stdin": "15\n10\n",
            "stdout": "Meta: Realizado: Diferença: 5\n"
          },
          {
            "stdin": "10\n10\n",
            "stdout": "Meta: Realizado: Diferença: 0\n"
          },
          {
            "stdin": "10\n15\n",
            "stdout": "Meta: Realizado: Diferença: -5\n"
          }
        ]
      },
      {
        "id": "p6-e3",
        "kind": "extra",
        "title": "Taxa fictícia editável",
        "prompt": "Peça Minutos: e Pontos por minuto: como inteiros. Calcule o produto e mostre Pontos fictícios: 30 para 10 e 3.",
        "hints": [
          "Os dois campos representam números, então converta ambos.",
          "Use pontos = minutos * taxa depois das duas entradas."
        ],
        "solution": "# A taxa é informada no exercício e não muda as regras do app.\nminutos = int(input(\"Minutos: \"))\ntaxa = int(input(\"Pontos por minuto: \"))\npontos = minutos * taxa\nprint(\"Pontos fictícios:\", pontos)",
        "cases": [
          {
            "stdin": "10\n3\n",
            "stdout": "Minutos: Pontos por minuto: Pontos fictícios: 30\n"
          },
          {
            "stdin": "0\n3\n",
            "stdout": "Minutos: Pontos por minuto: Pontos fictícios: 0\n"
          }
        ]
      },
      {
        "id": "p6-e4",
        "kind": "extra",
        "title": "Nome preservado",
        "prompt": "Peça Hábito: e guarde a resposta original. Mostre Original: [ Leitura ] e Chave: [leitura] para a entrada com um espaço em cada borda. Não altere o original ao criar a chave.",
        "hints": [
          "Atribua input a original e a versão limpa a outro nome.",
          "Use chave = original.strip().casefold() e duas f-strings com colchetes como texto."
        ],
        "solution": "# O texto de exibição fica separado da chave padronizada.\noriginal = input(\"Hábito: \")\nchave = original.strip().casefold()\nprint(f\"Original: [{original}]\")\nprint(f\"Chave: [{chave}]\")",
        "cases": [
          {
            "stdin": " Leitura \n",
            "stdout": "Hábito: Original: [ Leitura ]\nChave: [leitura]\n"
          },
          {
            "stdin": " ÁGUA \n",
            "stdout": "Hábito: Original: [ ÁGUA ]\nChave: [água]\n"
          }
        ]
      },
      {
        "id": "p6-e5",
        "kind": "extra",
        "title": "Número ou texto",
        "prompt": "Peça Minutos: e guarde a resposta em texto. Mostre Texto: [12] e Dobro: 24 para 12, convertendo só na conta. Depois investigue a entrada 2.5 e explique o ValueError, sem adicionar tratamento de erro.",
        "hints": [
          "Mantenha uma variável com o texto original e outra com o inteiro.",
          "Use texto = input(...), numero = int(texto), e mostre texto e numero * 2."
        ],
        "solution": "# O original mostra o que foi digitado; o inteiro permite a conta.\ntexto = input(\"Minutos: \")\nnumero = int(texto)\nprint(f\"Texto: [{texto}]\")\nprint(f\"Dobro: {numero * 2}\")",
        "cases": [
          {
            "stdin": "12\n",
            "stdout": "Minutos: Texto: [12]\nDobro: 24\n"
          },
          {
            "stdin": "0\n",
            "stdout": "Minutos: Texto: [0]\nDobro: 0\n"
          },
          {
            "stdin": "2.5\n",
            "stdout": "Minutos: ",
            "error": "ValueError"
          }
        ]
      },
      {
        "id": "p6-e6",
        "kind": "extra",
        "title": "Casa e leitura",
        "prompt": "Peça Casa: e Leitura: como minutos inteiros. Mostre Casa: 5 min, Leitura: 15 min e Total: 20 min para 5 e 15.",
        "hints": [
          "As entradas são números, e as mensagens finais usam f-string.",
          "Some casa + leitura depois das conversões e mostre cada parcela e o total."
        ],
        "solution": "# Mostrar as parcelas ajuda a conferir a soma.\ncasa = int(input(\"Casa: \"))\nleitura = int(input(\"Leitura: \"))\ntotal = casa + leitura\nprint(f\"Casa: {casa} min\")\nprint(f\"Leitura: {leitura} min\")\nprint(f\"Total: {total} min\")",
        "cases": [
          {
            "stdin": "5\n15\n",
            "stdout": "Casa: Leitura: Casa: 5 min\nLeitura: 15 min\nTotal: 20 min\n"
          },
          {
            "stdin": "0\n0\n",
            "stdout": "Casa: Leitura: Casa: 0 min\nLeitura: 0 min\nTotal: 0 min\n"
          }
        ]
      }
    ],
    "mistakes": [
      {
        "symptom": "Dois números foram colados em vez de somados.",
        "investigate": "Confira se converteu ambos com int antes de somar. Entradas são textos até a conversão."
      },
      {
        "symptom": "ValueError ao digitar minutos.",
        "investigate": "Leia a última linha do erro e confira o valor digitado. Use um inteiro como 12, sem palavras, e digite 0 para o caso de borda. 2.5, 12 minutos e vazio não são inteiros válidos para este programa."
      },
      {
        "symptom": "O programa parece parado.",
        "investigate": "Veja se há um prompt aguardando resposta. Clique na janela Shell, digite a informação solicitada e pressione Enter."
      },
      {
        "symptom": "A saída parece diferente do console mostrado aqui.",
        "investigate": "Os exemplos registram só o texto escrito pelo programa; a janela Shell também pode mostrar o que você digitou e linhas do próprio IDLE. Compare as mensagens e os resultados, separando esse eco."
      },
      {
        "symptom": "O nome apareceu com aspas extras.",
        "investigate": "Responda Ana, sem aspas. input já recebe texto; as aspas são usadas no código, não precisam fazer parte da resposta."
      }
    ],
    "criterion": "Execute os quatro básicos com as entradas propostas; nos campos numéricos teste também zero. No programa de pontos, 12 deve produzir 24 e zero deve produzir zero. Identifique uma falha de conversão com texto não numérico e volte a uma execução válida, explicando por que input e int têm papéis diferentes. Extras são opcionais.",
    "sources": [
      "https://raw.githubusercontent.com/python/cpython/v3.12.0/Doc/library/functions.rst",
      "https://raw.githubusercontent.com/python/cpython/v3.12.0/Doc/tutorial/errors.rst"
    ]
  },
  "7": {
    "objective": "Recriar e explicar um boletim de hábitos com entradas, limpeza de texto e contas, usando apenas os fundamentos das fases 1–6.",
    "prerequisites": [
      "Fases 1–6: salvar e executar, print/sep/end, variáveis, contas, f-strings, strip/casefold/len/replace e input/int. Não precisa conhecer decisões, laços, listas ou funções próprias."
    ],
    "preparation": [],
    "explanation": [
      "Esta fase é uma revisão, não exige terminar em um dia nem completar um projeto em uma única sessão. Primeiro descreva em palavras o que o programa recebe, calcula e mostra. Depois escreva uma linha por etapa, execute com um caso pequeno e compare com uma conta manual. Você pode consultar suas notas após a primeira tentativa.",
      "No boletim do exemplo, nome é texto e minutos de leitura e de Python são inteiros. O nome é limpo com strip; as contagens são convertidas com int. Somamos os minutos ativos e calculamos pontos fictícios para praticar a linguagem. Esses pontos não são os XP do Entre Trilhas e não concedem moedas no aplicativo.",
      "Investigue o programa em três cenários: dois valores positivos, tudo zero e uma atividade com zero e outra positiva. Mude uma entrada por vez, anote sua previsão e confira a saída. Isso exercita revisão de comportamento sem precisar escrever um corretor automático.",
      "Ainda não usaremos condições para impedir números negativos, entrada inválida ou compras impossíveis. Nos exercícios com tempo e saldo, use inteiros não negativos e divisores positivos conforme o enunciado. Se int receber uma palavra, o ValueError é esperado: identifique a linha e volte a executar com um inteiro; a validação virá depois.",
      "Retome o combinado de estudo como uma proposta editável: primeiro bloco de 60 minutos para revisão e básicos, pausa de dez minutos fora da contagem, segundo bloco de 60 minutos para terminar básicos ou escolher extras. Se a fase pedir mais dias, continue nela. A mínima de cinco minutos pode ser rever e explicar um trecho; ela ajuda a retomar, sem equivaler a duas horas nem reduzir cuidados essenciais.",
      "Conte apenas exercícios que você realmente resolveu, no autorregistro da sessão. Ler explicações, consultar dicas, estudar uma solução, instalar ferramentas ou marcar a fase não cria exercícios resolvidos nem pontos adicionais. Reexecutar o mesmo exercício em outra sessão não precisa ser contado como um exercício novo."
    ],
    "review": [
      "Fase 1: diferencie editor, arquivo e execução. Fase 2: explique sep e end. Fase 3: preveja uma atualização de variável.",
      "Fase 4: explique /, //, % e a prioridade das contas. Fase 5: limpe um texto mantendo o original e monte uma f-string. Fase 6: explique por que input devolve texto e quando int pode falhar."
    ],
    "example": {
      "code": "nome = input(\"Nome: \").strip()\nleitura = int(input(\"Leitura em minutos: \"))\npython = int(input(\"Python em minutos: \"))\ntotal = leitura + python\npontos = total * 2\nprint(f\"Boletim de {nome}\")\nprint(f\"Leitura: {leitura} min | Python: {python} min\")\nprint(f\"Prática total: {total} min\")\nprint(f\"Pontos fictícios: {pontos}\")",
      "stdin": "Ana\n15\n60\n",
      "stdout": "Nome: Leitura em minutos: Python em minutos: Boletim de Ana\nLeitura: 15 min | Python: 60 min\nPrática total: 75 min\nPontos fictícios: 150\n"
    },
    "exercises": [
      {
        "id": "p7-b1",
        "kind": "basic",
        "title": "Boletim do primeiro acampamento",
        "prompt": "A partir de um arquivo vazio, peça Nome: , Leitura: e Python: . Limpe as bordas do nome; digite minutos inteiros não negativos e converta as respostas com int. Mostre Boletim de Ana, Leitura: 15 min | Python: 60 min, Total: 75 min e Pontos fictícios: 150 para Ana, 15 e 60. Use dois pontos fictícios por minuto. Depois teste zero e um caso misto.",
        "hints": [
          "Planeje quatro etapas: receber nome, receber contagens, calcular e mostrar.",
          "Use int em ambas as contagens, total = leitura + python e pontos = total * 2; f-strings organizam o boletim."
        ],
        "solution": "# Recebemos texto e convertemos apenas as contagens.\nnome = input(\"Nome: \").strip()\nleitura = int(input(\"Leitura: \"))\npython = int(input(\"Python: \"))\n# Os pontos são apenas uma regra local deste exercício.\ntotal = leitura + python\npontos = total * 2\nprint(f\"Boletim de {nome}\")\nprint(f\"Leitura: {leitura} min | Python: {python} min\")\nprint(f\"Total: {total} min\")\nprint(f\"Pontos fictícios: {pontos}\")",
        "cases": [
          {
            "stdin": "Ana\n15\n60\n",
            "stdout": "Nome: Leitura: Python: Boletim de Ana\nLeitura: 15 min | Python: 60 min\nTotal: 75 min\nPontos fictícios: 150\n"
          },
          {
            "stdin": " João \n0\n0\n",
            "stdout": "Nome: Leitura: Python: Boletim de João\nLeitura: 0 min | Python: 0 min\nTotal: 0 min\nPontos fictícios: 0\n"
          },
          {
            "stdin": "Lia\n0\n5\n",
            "stdout": "Nome: Leitura: Python: Boletim de Lia\nLeitura: 0 min | Python: 5 min\nTotal: 5 min\nPontos fictícios: 10\n"
          }
        ]
      },
      {
        "id": "p7-b2",
        "kind": "basic",
        "title": "Cartão de hábito",
        "prompt": "Peça Hábito: e Minutos: . Preserve o nome original, crie uma chave com strip e casefold e mostre Original: [ Leitura ], Chave: leitura e Prática: 15 min para \" Leitura \" e 15.",
        "hints": [
          "Guarde original antes de criar a chave; os minutos são outro tipo de dado.",
          "Use chave = original.strip().casefold() e converta somente a entrada de minutos com int."
        ],
        "solution": "# Preservamos a forma digitada para poder conferir a transformação.\noriginal = input(\"Hábito: \")\nminutos = int(input(\"Minutos: \"))\nchave = original.strip().casefold()\nprint(f\"Original: [{original}]\")\nprint(f\"Chave: {chave}\")\nprint(f\"Prática: {minutos} min\")",
        "cases": [
          {
            "stdin": " Leitura \n15\n",
            "stdout": "Hábito: Minutos: Original: [ Leitura ]\nChave: leitura\nPrática: 15 min\n"
          },
          {
            "stdin": " ÁGUA \n0\n",
            "stdout": "Hábito: Minutos: Original: [ ÁGUA ]\nChave: água\nPrática: 0 min\n"
          }
        ]
      },
      {
        "id": "p7-b3",
        "kind": "basic",
        "title": "Reserva de papel",
        "prompt": "Peça Saldo fictício: e Preço positivo: como inteiros. O saldo deve ser não negativo e o preço maior que zero. Mostre Extras completos: 3 e Sobra: 2 para 47 e 15; use // e %. Não crie compra nem tempo extra no app.",
        "hints": [
          "Converta os dois valores e mantenha o preço positivo para evitar divisão por zero.",
          "Quantidade é saldo // preco; sobra é saldo % preco."
        ],
        "solution": "# Simulamos quantidades, sem consumir saldo real ou virtual do aplicativo.\nsaldo = int(input(\"Saldo fictício: \"))\npreco = int(input(\"Preço positivo: \"))\nquantidade = saldo // preco\nsobra = saldo % preco\nprint(f\"Extras completos: {quantidade}\")\nprint(f\"Sobra: {sobra}\")",
        "cases": [
          {
            "stdin": "47\n15\n",
            "stdout": "Saldo fictício: Preço positivo: Extras completos: 3\nSobra: 2\n"
          },
          {
            "stdin": "0\n15\n",
            "stdout": "Saldo fictício: Preço positivo: Extras completos: 0\nSobra: 0\n"
          },
          {
            "stdin": "45\n15\n",
            "stdout": "Saldo fictício: Preço positivo: Extras completos: 3\nSobra: 0\n"
          }
        ]
      },
      {
        "id": "p7-b4",
        "kind": "basic",
        "title": "Minutos em um recado",
        "prompt": "Peça Atividade: e Minutos: , limpe o nome, digite um tempo inteiro não negativo e converta a resposta com int. Mostre Python: 2 h e 5 min para \" Python \" e 125, usando // e % para calcular a duração e uma f-string para mostrá-la.",
        "hints": [
          "A divisão em horas e minutos é a mesma da fase 4.",
          "Guarde horas = minutos // 60 e restantes = minutos % 60; use o nome limpo na frase."
        ],
        "solution": "# Dividimos a duração sem perder os minutos restantes.\natividade = input(\"Atividade: \").strip()\nminutos = int(input(\"Minutos: \"))\nhoras = minutos // 60\nrestantes = minutos % 60\nprint(f\"{atividade}: {horas} h e {restantes} min\")",
        "cases": [
          {
            "stdin": " Python \n125\n",
            "stdout": "Atividade: Minutos: Python: 2 h e 5 min\n"
          },
          {
            "stdin": "Leitura\n0\n",
            "stdout": "Atividade: Minutos: Leitura: 0 h e 0 min\n"
          },
          {
            "stdin": "Casa\n60\n",
            "stdout": "Atividade: Minutos: Casa: 1 h e 0 min\n"
          }
        ]
      },
      {
        "id": "p7-e1",
        "kind": "extra",
        "title": "Lembrete de cuidado",
        "prompt": "Peça Responsável: e Nome do cachorro: . Limpe as bordas das duas respostas. Mostre Combinado de Ana para Mel, depois Água | Alimentação | Passeios | Higiene | Interação em uma linha separada. O programa é um lembrete: não marca cuidados como realizados nem reduz necessidades do cachorro.",
        "hints": [
          "Os dois campos são texto; não precisam de int.",
          "Use uma f-string para os nomes e print com sep=\" | \" para a linha de cuidados."
        ],
        "solution": "# Um lembrete textual não substitui conferir e realizar o cuidado essencial.\nresponsavel = input(\"Responsável: \").strip()\ncachorro = input(\"Nome do cachorro: \").strip()\nprint(f\"Combinado de {responsavel} para {cachorro}\")\nprint(\"Água\", \"Alimentação\", \"Passeios\", \"Higiene\", \"Interação\", sep=\" | \")",
        "cases": [
          {
            "stdin": "Ana\nMel\n",
            "stdout": "Responsável: Nome do cachorro: Combinado de Ana para Mel\nÁgua | Alimentação | Passeios | Higiene | Interação\n"
          },
          {
            "stdin": " João \n Pingo \n",
            "stdout": "Responsável: Nome do cachorro: Combinado de João para Pingo\nÁgua | Alimentação | Passeios | Higiene | Interação\n"
          }
        ]
      },
      {
        "id": "p7-e2",
        "kind": "extra",
        "title": "Prática em três sessões",
        "prompt": "Peça Sessão 1: , Sessão 2: e Sessão 3: como inteiros não negativos. Some as três e mostre Total: 120 min e Duração: 2 h e 0 min para 30, 45 e 45. Sessões menores podem somar uma fase de vários dias.",
        "hints": [
          "Cada resposta precisa ser convertida; depois faça uma soma de três parcelas.",
          "Calcule total = primeira + segunda + terceira e derive total // 60 e total % 60."
        ],
        "solution": "# As sessões podem representar dias diferentes; não há prazo automático.\nprimeira = int(input(\"Sessão 1: \"))\nsegunda = int(input(\"Sessão 2: \"))\nterceira = int(input(\"Sessão 3: \"))\ntotal = primeira + segunda + terceira\nprint(f\"Total: {total} min\")\nprint(f\"Duração: {total // 60} h e {total % 60} min\")",
        "cases": [
          {
            "stdin": "30\n45\n45\n",
            "stdout": "Sessão 1: Sessão 2: Sessão 3: Total: 120 min\nDuração: 2 h e 0 min\n"
          },
          {
            "stdin": "0\n0\n5\n",
            "stdout": "Sessão 1: Sessão 2: Sessão 3: Total: 5 min\nDuração: 0 h e 5 min\n"
          }
        ]
      },
      {
        "id": "p7-e3",
        "kind": "extra",
        "title": "Texto e comprimento",
        "prompt": "Peça Hábito: . Preserve a resposta original e crie limpo com strip. Mostre Original: [ Casa ], Limpo: [Casa], Antes: 6 e Depois: 4 para \" Casa \".",
        "hints": [
          "len pode contar tanto o texto original quanto o limpo.",
          "Guarde original = input(...), limpo = original.strip() e use len em cada variável."
        ],
        "solution": "# As contagens deixam visível o efeito de retirar as bordas.\noriginal = input(\"Hábito: \")\nlimpo = original.strip()\nprint(f\"Original: [{original}]\")\nprint(f\"Limpo: [{limpo}]\")\nprint(f\"Antes: {len(original)}\")\nprint(f\"Depois: {len(limpo)}\")",
        "cases": [
          {
            "stdin": " Casa \n",
            "stdout": "Hábito: Original: [ Casa ]\nLimpo: [Casa]\nAntes: 6\nDepois: 4\n"
          },
          {
            "stdin": "   \n",
            "stdout": "Hábito: Original: [   ]\nLimpo: []\nAntes: 3\nDepois: 0\n"
          }
        ]
      },
      {
        "id": "p7-e4",
        "kind": "extra",
        "title": "Páginas de dois dias",
        "prompt": "Peça Páginas de ontem: e Páginas de hoje: como inteiros não negativos. Mostre Total lido: 10 páginas. para 4 e 6. A meta do programa é somar dados informados, sem exigir aumento de leitura.",
        "hints": [
          "Não some os textos retornados por input diretamente.",
          "Converta ontem e hoje com int e use ontem + hoje na f-string."
        ],
        "solution": "# Revisar uma soma não cria metas crescentes.\nontem = int(input(\"Páginas de ontem: \"))\nhoje = int(input(\"Páginas de hoje: \"))\ntotal = ontem + hoje\nprint(f\"Total lido: {total} páginas.\")",
        "cases": [
          {
            "stdin": "4\n6\n",
            "stdout": "Páginas de ontem: Páginas de hoje: Total lido: 10 páginas.\n"
          },
          {
            "stdin": "0\n0\n",
            "stdout": "Páginas de ontem: Páginas de hoje: Total lido: 0 páginas.\n"
          }
        ]
      },
      {
        "id": "p7-e5",
        "kind": "extra",
        "title": "Revisar o plano escrito",
        "prompt": "Peça Plano: e troque todas as ocorrências exatas de Estudar por Praticar. Mostre Original: Estudar Python. e Revisado: Praticar Python. para a entrada Estudar Python. Preserve o texto original.",
        "hints": [
          "replace retorna outro texto, como você já viu na fase 5.",
          "Use revisado = original.replace(\"Estudar\", \"Praticar\") e mostre ambos com f-strings."
        ],
        "solution": "# A troca é exata: uma palavra ausente mantém o texto sem alteração.\noriginal = input(\"Plano: \")\nrevisado = original.replace(\"Estudar\", \"Praticar\")\nprint(f\"Original: {original}\")\nprint(f\"Revisado: {revisado}\")",
        "cases": [
          {
            "stdin": "Estudar Python.\n",
            "stdout": "Plano: Original: Estudar Python.\nRevisado: Praticar Python.\n"
          },
          {
            "stdin": "Ler com calma.\n",
            "stdout": "Plano: Original: Ler com calma.\nRevisado: Ler com calma.\n"
          }
        ]
      },
      {
        "id": "p7-e6",
        "kind": "extra",
        "title": "Dois blocos e uma pausa",
        "prompt": "Peça Bloco 1: e Bloco 2: como minutos inteiros não negativos. Use uma pausa fixa de 10 minutos fora da prática. Mostre Prática: 120 min, Pausa: 10 min e Agenda: 130 min para 60 e 60. Este cálculo simula dois blocos planejados; não inclui a pausa no autorregistro de estudo.",
        "hints": [
          "Crie variáveis diferentes para o esforço e para o tempo ocupado.",
          "pratica = primeiro + segundo; agenda = pratica + pausa, com pausa = 10."
        ],
        "solution": "# O esforço e o intervalo ocupado respondem perguntas diferentes.\nprimeiro = int(input(\"Bloco 1: \"))\nsegundo = int(input(\"Bloco 2: \"))\npausa = 10\npratica = primeiro + segundo\nagenda = pratica + pausa\nprint(f\"Prática: {pratica} min\")\nprint(f\"Pausa: {pausa} min\")\nprint(f\"Agenda: {agenda} min\")",
        "cases": [
          {
            "stdin": "60\n60\n",
            "stdout": "Bloco 1: Bloco 2: Prática: 120 min\nPausa: 10 min\nAgenda: 130 min\n"
          },
          {
            "stdin": "45\n45\n",
            "stdout": "Bloco 1: Bloco 2: Prática: 90 min\nPausa: 10 min\nAgenda: 100 min\n"
          }
        ]
      }
    ],
    "mistakes": [
      {
        "symptom": "O boletim soma 1560 em vez de 75.",
        "investigate": "Confira se leitura e python passaram por int antes da soma. print de cada parcela ajuda a identificar se o valor foi tratado como texto."
      },
      {
        "symptom": "O resultado parece certo só para um caso.",
        "investigate": "Teste zero e uma atividade sem minutos, além do caso positivo. Refaça a conta no papel sem copiar o resultado do programa."
      },
      {
        "symptom": "Uma entrada inválida encerrou o programa.",
        "investigate": "Nesta fase isso é esperado. Leia o ValueError, localize int, anote o que digitou e execute de novo; não invente validação com conceitos ainda não estudados."
      },
      {
        "symptom": "O tempo da pausa entrou no total de prática.",
        "investigate": "Separe a soma dos blocos ativos da ocupação da agenda. Uma variável chamada pausa não deve entrar na conta de minutos ativos."
      },
      {
        "symptom": "Consultar a solução pareceu completar uma atividade.",
        "investigate": "A consulta é apenas leitura. Resolva seu próprio programa e registre os exercícios manualmente na sessão, sem contar uma mesma resolução duas vezes."
      }
    ],
    "criterion": "Recrie o boletim do primeiro básico a partir de um arquivo vazio, consulte suas notas se precisar e execute os quatro básicos. Confira três conjuntos de entrada no boletim: positivos, zeros e um valor zero. Explique as linhas e anote uma dúvida ou correção. Extras são opcionais; várias sessões e dias são permitidos.",
    "sources": [
      "https://raw.githubusercontent.com/python/cpython/main/Doc/tutorial/introduction.rst",
      "https://raw.githubusercontent.com/python/cpython/v3.12.0/Doc/tutorial/inputoutput.rst",
      "https://raw.githubusercontent.com/python/cpython/v3.12.0/Doc/library/functions.rst"
    ]
  }
};
