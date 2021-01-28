let total = 0;
let totelMes = 0;

var form = document.querySelector("form");
var fieldset = document.querySelectorAll("fieldset");
var adicionarDivida = document.querySelector("button");
var escondeOpcao = document.querySelector("#porcentPag");

var dividas = document.querySelector("#tabela");
var totalDividas = document.querySelector("#total");
var totalMensal = document.querySelector("#valorPago");
var saldoRestante = document.querySelector("#saldoRestante");
var saldo = document.querySelector("#saldo");

const validaValor = val => /[0-9]{1,50}$/.test(val);

adicionarDivida.addEventListener("click", function (event) {
    event.preventDefault();
    if (validaDados() == false) {
        return;
    }
    document.querySelector("#mostrarDivida").classList.remove("quinto");
    dividas.appendChild(crieTr());
    saldoScore();
    totalDividas.textContent = valorTotal(obterInfoForm().valor);
    totalMensal.textContent = valorTotalMes(calculaPorcentagem());
    form.reset();
    form.rendaMensal.value = parseFloat(saldo.textContent);
    adicionarDivida.classList.add("treis");
    escondeOpcao.classList.add("esconde");

});
function obterInfoForm() {
        return {
        renda: form.rendaMensal.value.replace(',','.'),
        titulo: form.tituloDivida.value,
        valor: form.valorDivida.value.replace(',','.'),
        marcado: form.contaMes.checked,
        porcentagem: form.porcentagemPag.value
    };
}
function proximoPasso() {
    if (obterInfoForm().renda != "" && validaValor(parseFloat(document.querySelector("label input").value.replace(',','.')))) {
        fieldset[1].classList.remove("dois");
        fieldset[0].classList.add("um");
        document.querySelector("#rendaMensal1").classList.remove("quatro");
        (saldo.textContent == "" || saldo.textContent >= 0) && obterInfoForm().renda.length != "" ? saldo.textContent = parseFloat(document.querySelector("label input").value.replace(',','.')) : saldo.textContent = 0;
    } else {
        if (validaDados() == false) {
            validaValor(parseFloat(document.querySelector("label input").value.replace(',','.'))) ? document.querySelector("#vrenda").textContent = "" : document.querySelector("#vrenda").textContent = "Permitido apenas Numeros";
            return;
        }
    }
}

function proximoPassoDois() {
    if (obterInfoForm().titulo.length > 1 && parseFloat(document.querySelector(".vdivida").value) > 0) {
        document.querySelector("#tdivida").textContent = "";
        document.querySelector("#vdivida").textContent = "";
        adicionarDivida.classList.remove("treis");
    } else {
        adicionarDivida.classList.add("treis");
        document.querySelector("#aVistaSim").checked = false;
        document.querySelector("#aVistaNao").checked = false;
        if (validaDados() == false) {
            return;
        }
    }
}

if (obterInfoForm().renda.length == 0) {
    fieldset[0].classList.remove("um");
} else {
    document.querySelector(".quatro").classList.remove("quatro");
    saldo.textContent == "" && obterInfoForm().renda.length != "" ? saldo.textContent = parseFloat(document.querySelector("label input").value.replace(',','.')) : saldo.textContent = 0;
}

var restanteConta = (obterInfoForm().valor - calculaPorcentagem());
function crieTr() {
    var tr = document.createElement("tr");
    var descricao = (obterInfoForm().titulo + " " + obterInfoForm().valor);
    var restanteConta = (parseFloat(obterInfoForm().valor) - parseFloat(calculaPorcentagem()))
    tr.appendChild(crieTd(descricao));
    tr.appendChild(crieTd(restanteConta));
    tr.appendChild(crieTd(qtdParcelas()));
    tr.appendChild(crieTd(calculaPorcentagem()));
    tr.appendChild(crieTd(calculaSaldoRestante()));
    return tr;
}


function crieTd(dados) {
    var td = document.createElement("td");
    td.textContent = dados;
    return td;
}

function qtdParcelas() {
    var valor = obterInfoForm().valor;
    var porcentagem = calculaPorcentagem();

    if (porcentagem == valor && document.querySelector("#aVistaSim").checked == true) {
        valor = "a vista."
    } else if(document.querySelector("#aVistaSim").checked == true) {
        valor = (valor / calculaPorcentagem()) - 1;
    } else {
        valor = "Não pagará no mês";
    }
    return valor;
}

function valorTotal(valor) {
    total = (total + (parseFloat(valor) - calculaPorcentagem()));
    return total;
}

function valorTotalMes(valor) {
    totelMes = (totelMes + parseFloat(valor))
    return totelMes;
}

function validaDados() {
    var valor = obterInfoForm().valor;
    var titulo = obterInfoForm().titulo;
    var renda = obterInfoForm().renda;
    var marcado = obterInfoForm().marcado;
        if (valor.length == 0 && document.querySelector("#vdivida").innerHTML == "" || valor == 0){
            document.querySelector("#vdivida").textContent = "Digite valor Divida";
        valor = false;
    } else {
        document.querySelector("#vdivida").textContent = "";
        (validaValor(document.querySelector(".vdivida").value.replace(',','.')) || validaValor(parseFloat(document.querySelector(".vdivida").value.replace(',','.'))) < 0) ? document.querySelector("#vdivida").textContent = "Permitido apenas numeros" : document.querySelector("#vdivida").textContent = "" ;
        valor = true;
    }

    if (renda.length == 0 && saldo.textContent == "") {
        document.querySelector("#vrenda").textContent = "Digite valor da renda"
        renda = false;
    } else {
        document.querySelector("#vrenda").textContent = "";
        renda = true;
    }

    if (titulo.length == 0) {
        document.querySelector("#tdivida").textContent = "Digite Titulo Divida"
        titulo = false;
    } else {
        document.querySelector("#tdivida").innerHTML = "";
        titulo = true;
    }

    if (saldo.textContent == "") {
        (renda.length != "" && obterInfoForm().renda >= 0 ) ? saldo.textContent = parseFloat(obterInfoForm().renda) : saldo.textContent = 0;
    }

    if (marcado == 1) {
        contasDoMes();
    }
    if (valor && titulo && renda) {
        return true;
    } else
        return false;
}

function calculaPorcentagem() {
    var valor = obterInfoForm().valor;
    var porcentagem = obterInfoForm().porcentagem;
    if(document.querySelector("#aVistaNao").checked == true) {
        valor = 0;
    }
    return valor / porcentagem;
}

function marcaCheckParcelado() {
    parseFloat(obterInfoForm().porcentagem) != 100 ? document.querySelector("#parceladoSim").checked = true : document.querySelector("#parcelado").checked = false;
}

function marcaCheckAVista() {
    escondeOpcao.classList.add("esconde");
}

function marcaEsconde() {
    escondeOpcao.classList.remove("esconde");
}



function contasDoMes() {
    var saldoMes = parseFloat(saldo.textContent) - calculaPorcentagem();
    return saldo.textContent = saldoMes;
}

function saldoScore(){
    let tabela = ['#tabelaDividas', 'tr', 'th', 'td'];
    tabela.map(el =>{
        let tipo = document.querySelectorAll(el);
            tipo.forEach(item => {
            let elemento = item;
                if(parseFloat(saldo.textContent) < 1){
                    elemento.classList.add("contaNegativa");
                    elemento.classList.remove("contaPositiva");
                }else{
                    elemento.classList.remove("contaNegativa");
                    elemento.classList.add("contaPositiva") 
                }
            })
        })
}

function calculaSaldoRestante(){
    return document.querySelector("#saldo").textContent = parseFloat(saldo.textContent) - calculaPorcentagem();
}

function abrirPagina() {
    let newWindow = open('dividas.html', 'example', 'width=300,height=300');

    newWindow.onload = function () {
        let html = document.querySelector("#tabelaDividas");
        newWindow.console.log(html.outerHTML)
        newWindow.document.body.insertAdjacentHTML('afterbegin', html.outerHTML);
        newWindow.window.print();
    };
}