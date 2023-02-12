'use strict'

const meuForm = document.getElementById('form--principal');
const upload = document.getElementById('arquivo');
const limpar = document.querySelector('#limpar');
const textArea = document.getElementById('msg') ;
const contatos = document.querySelector('.container--contatos')
let CSV;
// let limparCSV;
let dados = {}


meuForm.addEventListener('submit', (e) => {
    event.preventDefault(e);
    const arquivo = upload.files[0];
    const leitor = new FileReader();
    leitor.onload = (e) => {
        // console.log('content: ', e.target.result)
        CSV = e.target.result.replaceAll('\r', '');
        // limparCSV = CSV.replaceAll('\r', "");
        dados = converterCSV(CSV);
        popularDados(dados);
    };
    leitor.readAsText(arquivo);
})

limpar.addEventListener('click', limparContatos);

function converterCSV(string, delimitador = ';') {
    // const cabecalho = string.trim().slice(0, string.indexOf(`\n`)).split(delimitador)
    const cabecalho = ['Nome', 'Zap'];
    console.log(cabecalho)
    const linhas = string.trim().slice(string.indexOf("\n") + 1).split("\n")
    console.log(linhas)
    const arry = linhas.map(linha => {
        const valores = linha.split(delimitador);
        console.log(valores);
        const elementos = cabecalho.reduce((objeto, cabeçalho, indice) => {
            // console.log(objeto)
            // console.log(cabeçalho)
            // console.log(indice)
            objeto[cabeçalho] = valores[indice];
            return objeto;
        }, {});
        return elementos
    });
return arry
}

function popularDados(dataSet) {
    let mensagem = encodeURI(document.querySelector('#msg').value)
    for (const contato of dataSet) {
    let string = `<p class="contato--nome">${contato.Nome}</p><a class="contato--zap" href="https://wa.me/${contato.Zap}?text=${mensagem}" target="_blank">https://wa.me/${contato.Zap}</a>`;
    contatos.insertAdjacentHTML("beforeend", string)
}
    
}

function limparContatos() {
    const nomes = document.querySelectorAll('.contato--nome');
    const zaps =  document.querySelectorAll('.contato--zap');
    nomes.forEach(el => {
        el.remove();
    });
    zaps.forEach(el => {
        el.remove()
    });
}