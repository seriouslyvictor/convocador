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
const linkForms = document.getElementById("link--forms")

let CSV;
let dados = {};

// Function to handle the change event
function handleChange() {
  setarMensagem(dia.value, horario.value, cursos.value, local.value, linkForms.value);
}

[dia, horario, local, cursos].forEach(element => {
  element.addEventListener("change", handleChange);
});

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
  const linhas = string
    .trim()
    .slice(string.indexOf("\n") + 1)
    .split("\n");
  console.log(linhas);
  const arry = linhas.map((linha) => {
    const valores = linha.split(delimitador);
    const elementos = cabecalho.reduce((objeto, cabeçalho, indice) => {
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
    let mensagem = textArea.textContent.replace(
      `{nomeCandidato}`,
      `${contato.Nome}`
    );
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
  const substring = `
Para confirmar sua participação, responda seu nome completo no link abaixo:
<strong>${linkForms.value}</strong>"
  `
  let string = `
📣 *Convocação: 2ª Etapa do Processo Seletivo para curso SENAI em parceria com o INSTITUTO EUROFARMA ${anoAtual}*

Olá <strong class="gradient">{nomeCandidato}</strong>.

Parabéns! Você foi selecionado/a para participar da segunda etapa da seleção para o curso de <strong>*${curso}*</strong> que será ministrado no Instituto Eurofarma em <strong> *${local === "sp" ? "SÃO PAULO" : "ITAPEVI"}*</strong>.
Para participar desta etapa você deverá comparecer no local, dia e horário informados abaixo:

🚩 *<strong>${local === "sp" ? "Instituto Eurofarma" : "ESCOLA 5.0"}</strong>*
🚩 *Endereço: <strong>${local === "sp" ? "Av. das Nações Unidas, 22215 - Jurubatuba, próximo ao Shopping SP Market" : "Rodovia Engenheiro Renê Benedito da Silva, 279 - 1° Andar (em cima do Bom Prato) Cohab setor I - Logo na rotatória"}.
</strong>*
⌚ *<strong>${diaConvertido} - ${diaSemana} às ${horario}</strong>*

OBSERVAÇÕES: NESTA ETAPA NÃO É NECESSÁRIO PRESENÇA DO RESPONSÁVEL, APENAS O CANDIDATO DEVERÁ OBRIGATORIAMENTE COMPARECER.
É OBRIGATÓRIO A APRESENTAÇÃO DOS SEGUINTES DOCUMENTOS NO DIA:

• RG ou documento oficial com foto – Original;
• Último BOLETIM ESCOLAR, ou se já concluiu o Ensino Médio trazer Histórico Escolar (Pode ser digital);

*Não é necessário trazer cópia dos documentos, somente original.*

Lembrando que caso não compareça no dia e local indicados você será desclassificado do processo seletivo e perderá a oportunidade de realizar o curso, que será oferecido de forma totalmente gratuita.
${linkForms.value ? substring : ""}
*Boa sorte!*`;
  textArea.innerHTML = string;
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

// Link automation 


function automateLinks() {
  const intervalTime = 10000; // 5000ms = 5 seconds
  const links = document.querySelectorAll('a'); // Adjust the selector to match your links
  let currentIndex = 0;
  const timerId = setInterval(() => {
    // Check if the currentIndex is within the bounds of the links array
    if (currentIndex < links.length) {
      // Click the current link
      const win = window.open(links[currentIndex].href);
      setTimeout(() => {
        // Simulate the Enter key press in the new window
        simulateEnterKey(win);

        // Close the window after a short delay
        setTimeout(() => {
          win.close();
        }, 5000); // Adjust the delay as needed
      }, 5000); // Adjust the delay as needed
      currentIndex++;

    } else {
      // Clear the interval if all links have been clicked
      clearInterval(timerId);
    }
  }, intervalTime);
}

function simulateEnterKey(win) {
  const event = new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, code: 'Enter', which: 13, bubbles: true });
  win.document.dispatchEvent(event);
}