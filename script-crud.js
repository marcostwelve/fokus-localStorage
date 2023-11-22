const taskListContainer = document.querySelector(".app__section-task-list");
const formTask = document.querySelector(".app__form-add-task");
const toggleFormTaskBtn = document.querySelector(".app__button--add-task");
const toggleFormBtnCancel = document.querySelector(".app__form-footer__button--cancel");
const btnDeletar = document.querySelector(".app__form-footer__button--delete");
const formLabel = document.querySelector(".app__form-label");
const btnRemoverTarefasConcluidas = document.querySelector("#btn-remover-concluidas");
const btnRemoverTodasTarefas = document.querySelector("#btn-remover-todas");
const taskAtiveDescription = document.querySelector(".app__section-active-task-description");

const textarea = document.querySelector(".app__form-textarea");

const localStorageTarefas = localStorage.getItem("tarefas");
let tarefas = localStorageTarefas ? JSON.parse(localStorageTarefas) : [];

const taskIconSvg = `
    <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#fff" />
    <path
        d="M9 16.1719L19 5.578125L21 6.98438L9 18.9844L3.42188 13.40625L1.82812 7L6 11.1719Z"
        fill="#01080E" />
    </svg>
`;


let tarefaSelecionada = null;
let itemTarefaSelecionada = null;
let tarefaEmEdicao = null;
let paragrafoEmEdicao = null;


const selecionarTarefa = (tarefa, elemento) => {

  if(tarefa.concluida) {
    return;
  }

  document.querySelectorAll(".app__section-task-list-item-active").forEach(function (button){
    button.classList.remove("app__section-task-list-item-active");
  });

  if(tarefaSelecionada === tarefa) {
    taskAtiveDescription.textContent = null;
    itemTarefaSelecionada = null;
    tarefaSelecionada = null;
    return;
  }

  tarefaSelecionada = tarefa;
  itemTarefaSelecionada = elemento;
  taskAtiveDescription.textContent = tarefa.descricao;
  elemento.classList.add("app__section-task-list-item-active");
}

const limparForm = () => {
  tarefaEmEdicao = null;
  paragrafoEmEdicao = null;
  textarea.value = "";
  formTask.classList.add("hidden");
}

const selecionaTarefaParaEditar = (tarefa, elemento) => {
    if(tarefaEmEdicao === tarefa) {
      limparForm();
      return;
    }

    formLabel.textContent = "Editando tarefa";
    tarefaEmEdicao = tarefa;
    paragrafoEmEdicao = elemento;
    textarea.value = tarefa.descricao;
    formTask.classList.remove("hidden");
}

function createTask(tarefa) {
  const li = document.createElement("li");
  li.classList.add("app__section-task-list-item");

  const svgIcon = document.createElement("svg");
  svgIcon.innerHTML = taskIconSvg;

  const paragraph = document.createElement("p");
  paragraph.classList.add("app__section-task-list-item-description");

  paragraph.textContent = tarefa.descricao;

  const button = document.createElement("button");

  button.classList.add("app_button-edit");
  const editImg = document.createElement("img");
  editImg.setAttribute("src", "./imagens/edit.png");
  button.appendChild(editImg);

  button.addEventListener("click", (e) => {
    e.stopPropagation();
    selecionaTarefaParaEditar(tarefa, paragraph);
  });

  li.onclick = () => {
    selecionarTarefa(tarefa, li);
  }

  svgIcon.addEventListener("click", (e) => {

    if(tarefa === tarefaSelecionada) {
      e.stopPropagation();
      button.setAttribute("disable", true);
      li.classList.add("app__section-task-list-item-complete");
      tarefaSelecionada.concluida = true;
      updateLocalStorage();
    }
    
  });

  if(tarefa.concluida) {
    button.setAttribute("disable", true);
    li.classList.add("app__section-task-list-item-complete");
  }
  li.appendChild(svgIcon);
  li.appendChild(paragraph);
  li.appendChild(button);

  return li;
}

tarefas.forEach(task => {
    const taskItem = createTask(task);
    taskListContainer.appendChild(taskItem);
});

toggleFormTaskBtn.addEventListener("click", () => {
  formLabel.textContent = "Adicionando tarefa";
  formTask.classList.toggle("hidden");
});

toggleFormBtnCancel.addEventListener("click",  limparForm);

btnDeletar.addEventListener("click", () => {
  if(tarefaSelecionada) {
    const index = tarefas.indexOf(tarefaSelecionada);
    if(index !== -1) {
      tarefas.splice(index, 1);
    }

    itemTarefaSelecionada.remove();
    tarefas.filter(t => t !== tarefaSelecionada);
    itemTarefaSelecionada = null;
    tarefaSelecionada = null;
  }
  updateLocalStorage();
  limparForm();
});

const removerTarefas = (concluidas) => {
  const seletor = concluidas ? ".app__section-task-list-item-complete" : ".app__section-task-list-item";
  document.querySelectorAll(seletor).forEach((elemento) => {
    elemento.remove();
  });

  tarefas = concluidas ? tarefas.filter((tarefa) !== !tarefa.concluida) : [];
  updateLocalStorage();
}

btnRemoverTarefasConcluidas.addEventListener("click", () => removerTarefas(true));
btnRemoverTodasTarefas.addEventListener("click", () => removerTarefas(false));

const updateLocalStorage = () => {
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

formTask.addEventListener("submit", (evento) => {
  evento.preventDefault();

  if(tarefaEmEdicao) {
    tarefaEmEdicao.descricao = textarea.value;
    paragrafoEmEdicao.textContent = textarea.value;
  }
  
  else {
    const task = {
      descricao: textarea.value,
      concluida: false,
    }
    tarefas.push(task);
    const taskItem = createTask(task);
    taskListContainer.appendChild(taskItem);
  }
  updateLocalStorage();
  limparForm();
});

document.addEventListener("TarefaFinalizada", function(e) {
  if(tarefaSelecionada) {
    tarefaSelecionada.concluida = true;
    itemTarefaSelecionada.classList.add("app__section-task-list-item-complete");
    itemTarefaSelecionada.querySelector("button").setAttribute("disabled", true);
    updateLocalStorage();
  }
});

/*
btnRemoverTarefasConcluidas.addEventListener("click", (e) => {
  e.stopPropagation();
  const tarefa = tarefas.find(tarefa => tarefa.concluida === true);
  tarefas.splice(tarefas.indexOf(tarefa), 1);
  updateLocalStorage();
});
*/
