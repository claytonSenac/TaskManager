import { getData,buscarComFiltro,apagarTarefa,salvarAlteracoes,salvarLocalStorage } from "./taskService.js";
import {formatDate,getOptionValue,validarDados,gerarLabels} from "./utils.js"


//Pego o formulario e os campos do form
const form = document.querySelector('#form');
const list = document.querySelector('.containerListTasks');
const saveBtn = document.querySelector('#saveBtn');

const filterPriority = document.querySelector('#filterPriority');
const filterStatus = document.querySelector('#filterStatus');
const filterText = document.querySelector('#filterText');

const titulo = document.querySelector('#tituloTask');
const descricao = document.querySelector('#descTask');
const data = document.querySelector('#dataTask');
const prioridade = document.querySelector('#prioridadeTask');

//Estados modificaveis
let isEditing = false
let indexTarefa = null;

function onLoad(){

    if(isEditing){
        saveBtn.textContent = 'Editar';
    }else{
        saveBtn.textContent = "Salvar"
    }
}

document.addEventListener('click',() => {
  onLoad();
})

window.addEventListener('resize',() => {
  exibirDados(getData())
})

//Escuto o envio do formulario
form.addEventListener('submit',(e) => {
    //paro o envio do form para poder validar/manipular os dados.
    e.preventDefault();

    // console.log(titulo.value)
    // console.log(descricao.value)
    // console.log(data.value)
    // console.log(prioridade.value)

    //Preencho payload a ser salvo
    let task = {
        "titulo" : titulo.value,
        "descricao" : descricao.value,
        "data" : data.value,
        "prioridade" : prioridade.value,
        "concluida": false
    };

    //valido com função utilitaria
    const isValid = validarDados(task);

    if(isValid){
        if(isEditing){
            if(indexTarefa == null) return alert('erro');

            salvarAlteracoes(task,indexTarefa);
            isEditing = false;
            alert('Alterações Salvas');

        }else{
            salvarLocalStorage(task);
            alert('Tarefa Criada');

        }
        //console.log(res)
        form.reset();
    }else{
        alert('dados invalidos!')
    }
    //console.log(isValid)
    exibirDados(getData());
});

function exibirDados(data){
    list.innerHTML = "";
    gerarLabels();

    let width = window.innerWidth;
    let mobileVision = width > 1200 ? false : true;
    
    data.forEach((e,i) => {
        const div = document.createElement('div');

        const pTitulo = document.createElement('p');
        
        const pDate = document.createElement('p');
        const pPrioridade = document.createElement('p');
        const pConcluida = document.createElement('p');

        div.classList.add('itemListTask');

        pTitulo.innerHTML = e.titulo;
        
        
         
        if(!mobileVision){
            if(!width > 600){
                pConcluida.innerHTML = e.concluida == true ? "Concluída" : "Em Aberto"; 
            }
            pDate.innerHTML = formatDate(e.data);
            pPrioridade.innerHTML = getOptionValue(e.prioridade);
        }

        const actions = document.createElement('div');
        actions.classList.add('actionsDiv');


        const deleteButton = document.createElement('div');
        deleteButton.innerHTML = '<i class="bi bi-trash-fill"></i>';

        const checkButton = document.createElement('div');
        checkButton.innerHTML = '<i class="bi bi-check-circle-fill"></i>';
        
        const editButton = document.createElement('div');
        editButton.innerHTML = '<i class="bi bi-pencil-square"></i>';

        const eyeButton = document.createElement('div');
        eyeButton.innerHTML = '<i class="bi bi-eye-fill"></i>'

        deleteButton.addEventListener('click',()=>{
            apagarTarefa(i);
        });

        checkButton.addEventListener('click',() => {
            marcarTarefaConcluida(i);
        });

        editButton.addEventListener('click',() => {
          editarTarefa(i);
        });

        eyeButton.addEventListener('click',() => {
          exibirDetalhes(i);
        })
       
        div.appendChild(pTitulo);

        if(!mobileVision){
            if(!width > 600){
                div.appendChild(pConcluida);

            }
            div.appendChild(pDate);
            div.appendChild(pPrioridade);


        }
        
        actions.appendChild(eyeButton);
        
        
        if(e.concluida){
            div.classList.add('completedTask')
        }else{
            actions.appendChild(checkButton);
            actions.appendChild(editButton);
        }
            actions.appendChild(deleteButton);
        
        div.appendChild(actions);
        
        list.appendChild(div)
    });
};

function marcarTarefaConcluida(index){
    const dados = getData();
    //console.log('tarefa ', dados[index]);
    let tarefa = dados[index];

    tarefa.concluida = true;
    dados.splice(index,1,tarefa);
    localStorage.setItem(LSS_NAME, JSON.stringify(dados));
    exibirDados(getData())
}

function editarTarefa(index){
    isEditing = true;
    indexTarefa = index;
    
    const dados = getData();
    let tarefa = dados[index];

    titulo.value = tarefa.titulo;
    data.value = tarefa.data;
    prioridade.value = tarefa.prioridade;
    descricao.value = tarefa.descricao;
}



function exibirDetalhes(index){

    let width = window.innerWidth;
    let mobileVision = width > 1200 ? false : true;
     
    const dados = getData();
    let tarefa = dados[index];

    const lista = document.querySelectorAll('.itemListTask');
    let posicao = index + 1;

    const desc = document.createElement('div');
    desc.classList.add('descItem');

    if(mobileVision){
        desc.innerHTML = `
        <h3>Titulo:</h3> <p>${tarefa.titulo}</p>\n
        <h3>Status:</h3> <p>${tarefa.concluida == true ? "Concluída" : "Em Aberto" }</p>\n
        <h3>prioridade:</h3> <p>${ getOptionValue(tarefa.prioridade)}</p>
        <h3>Data:</h3>\n<p>${formatDate(tarefa.data)}</p>\n
        <h3>Descrição:</h3> <p>${tarefa.descricao}</p>
        `
    }else{
        desc.innerHTML = `<h3>Descrição:</h3> <p>${tarefa.descricao}</p>`
    }

    //faço um foreach dos itens e pego o item atual para manipular
    //tem que ser index++ porque eu seto no primeiro item um label padrao!!!!
 
    lista.forEach((e,i)=>{
        if(i == posicao){
            if(e.classList.contains('openMenu')){
                e.classList.remove('openMenu');

                //pego o elemento dentro da div 
                const desc = e.querySelector('.descItem');
                e.removeChild(desc);

            }else{
                e.appendChild(desc);
                e.classList.add('openMenu');
            }
        }
         
    });


}

onLoad()
exibirDados(getData());
 
