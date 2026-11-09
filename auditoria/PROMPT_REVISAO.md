# Prompt reutilizável — auditoria e evolução do Entre Trilhas

Copie o texto abaixo para uma nova sessão com acesso ao repositório.

---

Atue como engenheiro de software, QA, especialista em UX/acessibilidade e designer de jogos. Faça uma revisão prática do projeto Entre Trilhas, em português, com foco em confiança, rotina real e aprendizagem de Python.

Leia primeiro as instruções do repositório, README.md, PLANO.md, auditoria/AUDITORIA.md e auditoria/ROADMAP.md. Confirme o estado atual das fontes e dos dados: não trate achados antigos como se ainda existissem. Preserve alterações locais e teste sempre em contextos separados, sem sobrescrever meu progresso ou backup.

Execute o projeto: sintaxe, testes, build, servidor e navegação real. Comece pelos comandos disponíveis em package.json e pelo teste tests/browser_smoke.py. Valide também o HTML único gerado e a correspondência dos artefatos de distribuição. Instalações e verificações rotineiras podem prosseguir sem me perguntar; não publique nem envie dados a serviços externos sem autorização.

Teste fluxos normais e adversos: cliques repetidos, mínima→normal, dividir XP entre habilidades, compras, limites, falta de saldo, cancelamento único, consumo/correção, pausas, reagendamento, horários editados em folgas, virada do dia America/Sao_Paulo, duas abas, falta de espaço, falha de gravação, reabertura, backup válido/malformado/inconsistente, restauração e recuperação. Teste Python em dias distintos, fase que dura vários dias e continuidade depois de terminar o mapa. Verifique os caminhos de abertura documentados, incluindo as diferenças entre localhost, HTTP em rede local e HTTPS.

Avalie visual e uso: celular de 320–430 px, desktop, zoom, teclado, leitor de tela quando disponível, foco, contraste, áreas de toque, mensagens, próxima ação e quantidade de cliques. Meça processamento, validação, armazenamento e renderização com históricos de 30, 365 e 1.095 dias; registre método e limites das medições. Não alegue testar todos os navegadores ou aparelhos se não o fez.

Revise o valor do produto: agenda sem sobreposição, margens, sono e cuidados essenciais; equilíbrio de XP/moedas; versões mínimas; retomada sem punição; exercícios realmente resolvidos e projetos; profundidade das explicações Python e identidade própria do RPG. Diferencie bug, limitação conhecida, hipótese e nova ideia. Não prometa competência técnica por nível nem bloqueio de outros aplicativos.

Para cada falha confirmada, registre prioridade, arquivo/linha, passos de reprodução, resultado esperado/real, impacto e critério de aceite. Produza testes de regressão que falhem pelo motivo correto. Não esconda falhas, enfraqueça testes ou substitua verificações reais por checks triviais.

Atualize os documentos de auditoria e monte um roadmap com dependências, entregas pequenas e critérios verificáveis. Priorize dados e funcionamento, depois acessibilidade, agenda e Python, depois enriquecimento visual e recursos maiores. Não troque de tecnologia nem acrescente backend apenas para tornar o projeto mais complexo. Descreva pendências externas de forma específica.

Entregue um resumo claro: o que rodou e passou, falhas reproduzidas, limitações da análise, cinco melhorias de maior valor e próximos passos. Se alguma informação essencial faltar, faça apenas uma pergunta por mensagem e continue o trabalho independente.

Nesta execução, o escopo é **auditar e planejar**. Não implemente mudanças de comportamento além desse escopo. Caso eu acrescente “execute a etapa N”, implemente essa etapa até os critérios de aceite, preserve dados e compatibilidade de backup, execute os testes apropriados e informe riscos e pendências.

---

Para iniciar as correções após a auditoria, acrescente:

> Execute a etapa 1 do roadmap atualizado. Reproduza os bugs, escreva regressões, corrija as causas e valide o fluxo real no navegador. Preserve meu progresso e o formato de backup, com migração explícita se necessária. Continue até cumprir os critérios de aceite ou demonstrar um bloqueio externo concreto.
