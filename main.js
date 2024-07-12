const meuForm = document.getElementById("form--principal");
const upload = document.getElementById("arquivo");
const limpar = document.querySelector("#limpar");
const textArea = document.getElementById("msg");
const contatos = document.querySelector(".container--contatos");
const wrapperTemplates = document.querySelector(".wrapper--templates");
const templates = document.getElementById("templates");
const dia = document.querySelector("#dia");
const horario = document.querySelector("#horario");
const cursos = document.querySelector("#cursos");
const local = document.querySelector("#local");

let CSV;
let dados = {};

dia.addEventListener("change", () =>
  setarMensagem(dia.value, horario.value, cursos.value, local.value)
);
horario.addEventListener("change", () =>
  setarMensagem(dia.value, horario.value, cursos.value, local.value)
);
local.addEventListener("change", () =>
  setarMensagem(dia.value, horario.value, cursos.value, local.value)
);
cursos.addEventListener("change", () =>
  setarMensagem(dia.value, horario.value, cursos.value, local.value)
);

meuForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const arquivo = upload.files[0];
  const leitor = new FileReader();
  leitor.onload = (e) => {
    CSV = e.target.result.replaceAll("\r", "");
    dados = converterCSV(CSV);
    popularDados(dados);
  };
  leitor.readAsText(arquivo);
});

limpar.addEventListener("click", limparContatos);

function converterCSV(string, delimitador = ";") {
  // Desprezamos o cabeçalho do excel e criamos um padrão
  const cabecalho = ["Nome", "Zap"];
  console.log(cabecalho);
  const linhas = string
    .trim()
    .slice(string.indexOf("\n") + 1)
    .split("\n");
  console.log(linhas);
  const arry = linhas.map((linha) => {
    const valores = linha.split(delimitador);
    console.log(valores);
    const elementos = cabecalho.reduce((objeto, cabeçalho, indice) => {
      // console.log(objeto)
      // console.log(cabeçalho)
      // console.log(indice)
      objeto[cabeçalho] = valores[indice];
      return objeto;
    }, {});
    return elementos;
  });
  return arry;
}

function popularDados(dataSet) {
  //   let mensagem = encodeURI(document.querySelector("#msg").value);
  for (let contato of dataSet) {
    // insere os nomes do usuário dinamicamente
    let mensagem = textArea.value.replace(`{nomeCandidato}`, `${contato.Nome}`);
    mensagem = encodeURI(mensagem);
    let string = `<p class="contato--nome">${contato.Nome}</p><a class="contato--zap" href="https://web.whatsapp.com/send/?phone=${contato.Zap}&text=${mensagem}&type=phone_number&app_absent=0" target="_blank">https://wa.me/${contato.Zap}</a>`;
    contatos.insertAdjacentHTML("beforeend", string);
  }
}

function limparContatos() {
  const nomes = document.querySelectorAll(".contato--nome");
  const zaps = document.querySelectorAll(".contato--zap");
  nomes.forEach((el) => {
    el.remove();
  });
  zaps.forEach((el) => {
    el.remove();
  });
}

function setarMensagem(dia, horario = "8:00", curso, local) {
  const anoAtual = new Date().getFullYear();
  let diaConvertido = converterData(dia);
  let diaSemana = descobrirDia(dia);
  let string = `
📣 *Convocação: 2ª Etapa do Processo Seletivo para curso SENAI em parceria com o INSTITUTO EUROFARMA ${anoAtual}*

Olá {nomeCandidato}.

Parabéns! Você foi selecionado/a para participar da segunda etapa da seleção para o curso de *${curso}* que será ministrado no *Instituto Eurofarma em ${
    local === "sp" ? "SÃO PAULO" : "ITAPEVI"
  }*.
Para participar desta etapa você deverá comparecer no local, dia e horário informados abaixo:

🚩 *${local === "sp" ? "Instituto Eurofarma" : "ESCOLA 5.0"}*
🚩 *Endereço: ${
    local === "sp"
      ? "Av. das Nações Unidas, 22215 - Jurubatuba, próximo ao Shopping SP Market"
      : "Rodovia Engenheiro Renê Benedito da Silva, 279 - 1° Andar (em cima do Bom Prato) Cohab setor I - Logo na rotatória"
  }.*
⌚ *${diaConvertido} - ${diaSemana} às ${horario}*

OBSERVAÇÕES: NESTA ETAPA NÃO É NECESSÁRIO PRESENÇA DO RESPONSÁVEL, APENAS O CANDIDATO DEVERÁ OBRIGATORIAMENTE COMPARECER.
É OBRIGATÓRIO A APRESENTAÇÃO DOS SEGUINTES DOCUMENTOS NO DIA:

• RG ou documento oficial com foto – Original;
• Último BOLETIM ESCOLAR, ou se já concluiu o Ensino Médio trazer Histórico Escolar (Pode ser digital);

*Não é necessário trazer cópia dos documentos, somente original.*

Lembrando que caso não compareça no dia e local indicados você será desclassificado do processo seletivo e perderá a oportunidade de realizar o curso, que será oferecido de forma totalmente gratuita.

Para confirmar sua participação, responda seu nome completo no link abaixo:

https://forms.gle/vHMMAPivgdGJ8DVc8

*Boa sorte!*`;
  textArea.value = string;
}

function converterData(data) {
  // Divida a string em partes (ano, mês, dia)
  const partes = data.split("-");

  // Crie um objeto Date com as partes da string
  data = new Date(partes[0], partes[1] - 1, partes[2]);

  // Obtenha as partes da data (dia, mês, ano) como strings
  let dia = data.getDate().toString();
  let mes = (data.getMonth() + 1).toString(); // lembre-se que o mês é indexado a partir de 0
  let ano = data.getFullYear().toString();

  // Adicione um zero à esquerda se o dia ou mês for menor que 10
  if (dia.length < 2) {
    dia = "0" + dia;
  }
  if (mes.length < 2) {
    mes = "0" + mes;
  }

  // Concatene as partes da data em uma string no formato "dd/mm/aaaa"
  var dataFormatada = dia + "/" + mes + "/" + ano;

  // Retorne a data formatada
  return dataFormatada;
}

function descobrirDia(data) {
  const date = new Date(data);
  const diaSemana = date.getDay();
  const dias = [
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
    "Domingo",
  ];
  const diaDescoberto = dias[diaSemana];
  return diaDescoberto;
}
