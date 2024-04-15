const formulario = document.querySelector("#task-form");
const botaoAddTarefa = document.querySelector(".button-add-task");
const campoDigitacao = document.querySelector(".input-task");
const ul = document.querySelector(".task-list");
const alternarTemaBt = document.querySelector("#btn");

const modalTextArea = document.querySelector(".text-area-edit");
const salvarAlteracoes = document.querySelector("#save-changes");
let tarefas = JSON.parse(localStorage.getItem("token")) || [];

const capturarTarefa = (evento) =>
{
    evento.preventDefault();
    const tarefa = {descricao: campoDigitacao.value};
    criarLITarefa(tarefa);
    tarefas.push(tarefa);
    campoDigitacao.value = "";
    atualizarTarefas();
};

const criarLITarefa = (tarefa) =>
{
    const li = document.createElement("li");
    li.classList.add("task-list-item");
    const p = document.createElement("p");
    p.classList.add("phrase-task");
    p.textContent = tarefa.descricao;
    const divButtons = document.createElement("div");
    divButtons.classList.add("buttons-task");
    const editButton = document.createElement("button");
    editButton.classList.add("button-edit-task");
    editButton.setAttribute("data-bs-toggle","modal");
    editButton.setAttribute("data-bs-target", "#edit-task-modal");
    const removeButton = document.createElement("button");
    removeButton.classList.add("button-remove-task");
    divButtons.append(editButton, removeButton);

    editButton.addEventListener("click", () =>
    {
        
        modalTextArea.value = `${p.textContent}`;
        salvarAlteracoes.onclick = () =>
        {
            // É importante lembrar que a refrência ao objeto tarefa do array ou fora do array de tarefas continua valendo aqui.
            p.textContent = modalTextArea.value;
            tarefa.descricao = p.textContent;
            atualizarTarefas();
        };

    });

    removeButton.addEventListener("click", () =>
    {
        tarefas =  tarefas.filter(elemento => elemento.descricao != p.textContent);
        li.remove();
        atualizarTarefas();
    });

    li.append(p, divButtons);
    ul.append(li);
    return li;
}

function atualizarTarefas()
{
    localStorage.setItem("token", JSON.stringify(tarefas));
}

formulario.addEventListener("submit", (e) => capturarTarefa(e));
alternarTemaBt.addEventListener("click", () =>
{
    document.querySelector("body").classList.toggle("ligth-mode");
});

tarefas.forEach(item => {
    const li = criarLITarefa(item);
    ul.append(li);
});


