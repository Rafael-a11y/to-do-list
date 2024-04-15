const temperatura = document.querySelector("#temperatura");
const imagemTempo = document.querySelector("#clima-icone");
const data = document.querySelector("#data");
const geoLocalizacao = document.querySelector("#geolocalizacao");
const caixaAPI = document.querySelector(".caixa-api");

let latitude;
let longitude;
let precisao;
let dia = "";
let mes = "";
let ano = "";
let cidade;
let regiao;
let pais;


async function obterGeoCodificacao(buscaPeloIp, exibirLocalizacao) {
    const meuIp = await buscaPeloIp();
    try 
    {
        const busca = await fetch(`https://ipgeolocation.abstractapi.com/v1/?api_key=ab012bc782f14348abdbab1d578b0306&ip_address=${meuIp.ip}`);
        const resultado = await busca.json();
        cidade = resultado.city;
        regiao = resultado.region;
        pais = resultado.country;
    }
    catch(erro)
    {
        console.log("Houve um erro ao tentar obter a localização do usuário", erro.code)
    }
    exibirLocalizacao();
}

async function obterIp() {
    try {
        const busca = await fetch("https://api64.ipify.org?format=json");
        const resposta = await busca.json();
        return resposta;
    }
    catch (erro) {
        console.log("Houve um erro ao tentar recuperar o ip", erro.message);
    }
}

function mostrarLocalizacao() {
    geoLocalizacao.textContent += `${cidade}, ${regiao}, ${pais}`;
}


function obterLocalizacao() {
    navigator.geolocation.getCurrentPosition((posicao) => {
        latitude = posicao.coords.latitude;
        longitude = posicao.coords.longitude;
        precisao = posicao.coords.accuracy;
    },
        (erro) => {
            console.log("Desculpe, houve um erro:", erro.code, erro.message)
        });
}

async function obterClima(callback, callbackDeVisualizacao) {
    try {
        await obterGeoCodificacao(obterIp, mostrarLocalizacao);
        await callback();
        // const url = `https://www.7timer.info/bin/api.pl?lon=${longitude}&lat=${latitude}&product=civillight&output=json&lang=pt`
        const url = `https://api.weatherapi.com/v1/current.json?key=8ff4424796364292835220704241304&q=${cidade}&aqi=no
        `;
        console.log(cidade)
        const busca = await fetch(url);
        const resposta = await busca.json();
        console.log("dadosclimáticos:\n",resposta);
        callbackDeVisualizacao(resposta);
    }
    catch(erro)
    {
        console.log("Houve um erro na requisição GET para obter serviço de previsão do tempo", erro.message, erro.code);
    }
}

function mostrar(previsao)
{
    let dataRetornadaDaAPI = previsao.location.localtime.replaceAll("-","").slice(0,8);
    console.log(dataRetornadaDaAPI);
    
    let arrayData = [...dataRetornadaDaAPI];
    console.log("",dataRetornadaDaAPI);
    arrayData.forEach((elemento, indice) =>
    {
        if(indice >= 0 && indice <= 3) ano += elemento;
        else if(indice >= 4 && indice <= 5 ) mes += elemento;
        else dia += elemento;
    });
    const dataPrevista = new Date(ano, mes, dia);
    temperatura.textContent = `${previsao.current.temp_c}°C `;
    data.textContent = `${dataPrevista.getDate()}/${dataPrevista.getMonth()}/${dataPrevista.getFullYear()}`;
    imagemTempo.setAttribute("src", previsao.current.condition.icon);
    caixaAPI.classList.remove("hidden");

}

obterClima(obterLocalizacao, mostrar);
