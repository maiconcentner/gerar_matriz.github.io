function gerarMatriz() {
    try {
        // Obtem os valores do formulário
        const dimensao = parseInt(document.getElementById('dimensao').value);
        const valor_min = parseFloat(document.getElementById('valor_min').value);
        const valor_max = parseFloat(document.getElementById('valor_max').value);
        const media_distancia = parseFloat(document.getElementById('media_distancia').value);
        const probabilidade_sem_conexao = parseFloat(document.getElementById('probabilidade_sem_conexao').value);

        if (isNaN(dimensao) || isNaN(valor_min)|| isNaN(probabilidade_sem_conexao) || isNaN(valor_max) || isNaN(media_distancia)) {
            throw new Error('Por favor, preencha todos os campos com valores numéricos.');
        }

        if (dimensao <= 0 || probabilidade_sem_conexao <= 0 || valor_min < 0 || valor_max <= valor_min || media_distancia < 0) {
            throw new Error('Por favor, insira valores válidos.');
        }

        // Gera a matriz aleatória
        const matriz_aleatoria = gerarMatrizPython(dimensao, valor_min, valor_max, media_distancia,probabilidade_sem_conexao);

        // Corrige a diagonal principal
        for (let i = 0; i < dimensao; i++) {
            matriz_aleatoria[i][i] = 0;
        }

        // Exibe a matriz gerada
        const matrizElement = document.getElementById('matriz');
        matrizElement.innerHTML = '';
        for (const linha of matriz_aleatoria) {
            const rowElement = document.createElement('div');
            rowElement.className = 'row';

            for (const valor of linha) {
                const cellElement = document.createElement('div');
                cellElement.className = 'cell';
                cellElement.textContent = valor.toFixed(2);
                rowElement.appendChild(cellElement);
            }

            matrizElement.appendChild(rowElement);
        }

    } catch (error) {
        alert(error.message);
    }
}

// Função para gerar a matriz (similar à função em Python)
function gerarMatrizPython(dimensao, valor_min, valor_max, media_distancia, probabilidade_sem_conexao) {
    // Inicializa a matriz com zeros
    let matriz = Array.from({ length: dimensao }, () => Array(dimensao).fill(0));

    // Preenche a diagonal superior
    for (let i = 0; i < dimensao; i++) {
        for (let j = i + 1; j < dimensao; j++) {
            // Gera um número aleatório entre 0 e 1
            const chance_sem_conexao = Math.random();

            if (chance_sem_conexao <= probabilidade_sem_conexao) {
                matriz[i][j] = Infinity;  // Use Infinity para representar ausência de conexão
                matriz[j][i] = Infinity;  // Se o grafo for não direcionado
            } else {
                const distancia = parseFloat((Math.random() * (media_distancia * 1.5 - media_distancia * 0.5) + media_distancia * 0.5).toFixed(2));
                const valor = parseFloat((Math.random() * (valor_max - valor_min) + valor_min).toFixed(2));
                matriz[i][j] = valor;
                matriz[j][i] = valor;  // Se o grafo for não direcionado
            }
        }
    }

    return matriz;
}



function copiarParaPython() {
    const matriz = obterMatriz();
    const textoFormatado = formatarParaPython(matriz);
    copiarParaAreaDeTransferencia(textoFormatado);
}

function copiarParaMatlab() {
    const matriz = obterMatriz();
    const textoFormatado = formatarParaMatlab(matriz);
    copiarParaAreaDeTransferencia(textoFormatado);
}

function obterMatriz() {
    const matriz_aleatoria = [];
    const linhas = document.querySelectorAll('.row');

    linhas.forEach(linha => {
        const valores = Array.from(linha.querySelectorAll('.cell')).map(cell => parseFloat(cell.textContent));
        matriz_aleatoria.push(valores);
    });

    return matriz_aleatoria;
}

function formatarParaPython(matriz) {
    let texto = "[\n";
    matriz.forEach(linha => {
        texto += "    [" + linha.join(", ") + "],\n";
    });
    texto = texto.slice(0, -2); // Remove a vírgula e o espaço do último item
    texto += "\n]";
    return texto;
}

function formatarParaMatlab(matriz) {
    let texto = "[\n";
    matriz.forEach(linha => {
        texto += "    " + linha.join(", ") + ";\n";
    });
    texto = texto.slice(0, -2); // Remove o ponto e vírgula e o espaço do último item
    texto += "\n]";
    return texto;
}

function copiarParaAreaDeTransferencia(texto) {
    const el = document.createElement('textarea');
    el.value = texto;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    const selected =
        document.getSelection().rangeCount > 0 // Verifica se há algum texto selecionado
            ? document.getSelection().getRangeAt(0) // Armazena a seleção
            : false;
    el.select(); // Seleciona o texto dentro do elemento
    document.execCommand('copy'); // Copia o texto selecionado
    document.body.removeChild(el); // Remove o elemento da página
    if (selected) { // Se algo foi selecionado anteriormente, retorna a seleção ao estado anterior
        document.getSelection().removeAllRanges();
        document.getSelection().addRange(selected);
    }

	    // Exibe a mensagem de sucesso
    const mensagemElement = document.getElementById('mensagem');
    mensagemElement.textContent = 'Texto copiado com sucesso!';

    // Posiciona a mensagem ao lado do botão "Copiar para Matlab"
    const botaoCopiarMatlab = document.getElementById('copiarMatlab');
    const posicaoBotao = botaoCopiarMatlab.getBoundingClientRect();
    const posicaoMensagem = mensagemElement.getBoundingClientRect();
    const novaEsquerda = posicaoBotao.right + 10; // 10 pixels de espaço entre o botão e a mensagem
    const novaTopo = posicaoBotao.top + (posicaoBotao.height - posicaoMensagem.height) / 2;

    mensagemElement.style.left = novaEsquerda + 'px';
    mensagemElement.style.top = novaTopo + 'px';

    mensagemElement.style.display = 'block'; // Torna a mensagem visível

    setTimeout(() => {
        // Remove a mensagem após alguns segundos
        mensagemElement.style.display = 'none';
    }, 3000); // A mensagem desaparece após 3 segundos (3000 milissegundos)
}

function toggleExibirMatriz() {
    const matrizElement = document.getElementById('matriz');
    const checkbox = document.getElementById('exibirMatriz');

    if (checkbox.checked) {
        matrizElement.style.display = 'block';
    } else {
        matrizElement.style.display = 'none';
    }
}

function limparFormulario() {
    document.getElementById('dimensao').value = '';
    document.getElementById('valor_min').value = '';
    document.getElementById('valor_max').value = '';
    document.getElementById('media_distancia').value = '';

    // Desmarcar o checkbox "Exibir Matriz"
    document.getElementById('exibirMatriz').checked = false;

    // Se desejar, pode adicionar mais campos do formulário para limpar aqui.

    // Além disso, se desejar, também pode adicionar código para esconder a matriz e a mensagem.
    document.getElementById('matriz').style.display = 'none';
    document.getElementById('mensagem').style.display = 'none';
}

