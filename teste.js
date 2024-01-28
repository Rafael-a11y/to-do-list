console.clear();
const obj = {nome:"Rafael"};
let objs = [];
objs.push(obj);
console.log(objs[0].nome);
alterarNome(objs[0]);
console.log(objs[0].nome);

function alterarNome(pessoa)
{
    pessoa.nome = "Novo nome";
}