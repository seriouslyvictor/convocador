'use strict'

const meuForm = document.getElementById('form--principal');
const upload = document.getElementById('arquivo');
const textArea = document.getElementById('msg') ;
console.log(meuForm, upload, textArea); 
let CSV;
let limparCSV;
let dados = {}


meuForm.addEventListener('submit', (e) => {
    event.preventDefault(e);
    const arquivo = upload.files[0];
    const leitor = new FileReader();
    leitor.onload = (e) => {
        console.log('content: ', e.target.result)
        CSV = e.target.result.replaceAll('\r', '');
        // limparCSV = CSV.replaceAll('\r', "");
        dados = converterCSV(CSV);
    };
    leitor.readAsText(arquivo);
})

function converterCSV(string, delimitador = ';') {
    const cabecalho = string.trim().slice(0, string.indexOf(`\n`)).split(delimitador)
    console.log(cabecalho)
    const linhas = string.trim().slice(string.indexOf("\n") + 1).split("\n")
    console.log(linhas)
    const arry = linhas.map(linha => {
        const valores = linha.split(delimitador);
        console.log(valores);
        const elementos = cabecalho.reduce((objeto, cabeçalho, indice) => {
            objeto[cabeçalho] = valores[indice];
            return objeto;
        }, {});
        return elementos
    });
return arry
}







