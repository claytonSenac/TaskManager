//Variaveis locais
const OPTIONS_COUNT = 3;
const LSS_NAME = "tasks";

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

// funcao para validar integridade dos dados
function validarDados(task){
    if(!task) return false;

    if(!task.titulo || !task.descricao || !task.data || !task.prioridade){
        console.log('faltam dados', task)
        return false;
    }

    if(task.prioridade > OPTIONS_COUNT) return false;

    return true
}

function salvarLocalStorage(task){
    if(!validarDados(task)) return null;
    try{
        let previusData = getData();

        previusData.push(task);

        const parsedData = JSON.stringify(previusData);

        localStorage.setItem(LSS_NAME, parsedData); 

        return previusData;
    }catch(e){
        console.log('erro ao salvar',e)
    }
       
}

function salvarAlteracoes(task,index){
    const dados = getData();
    let tarefa = dados[index];

    tarefa.titulo = task.titulo;
    tarefa.descricao = task.descricao;
    tarefa.prioridade = task.prioridade;
    tarefa.data = task.data;

    dados.splice(index,1,tarefa);
    localStorage.setItem(LSS_NAME, JSON.stringify(dados));

    return tarefa;
}

//recupero os dados do local storage formato
function getData(){
    const data = localStorage.getItem(LSS_NAME);

    const parsedData = JSON.parse(data) || [];
    return parsedData;
}

function buscarComFiltro(){
    isFiltering = true;
    const prioridade = filterPriority.value;
    const status = filterStatus.value;
    const text = filterText.value;

    let filteredData = getData();

    if(prioridade != "desativado" && status != "desativado"){
        const statusBol = status == "0" ? true : false;
        
        filteredData = filteredData.filter( (t) => t.prioridade == prioridade && t.concluida == statusBol && t.titulo == text);

        //console.log('os 2',status,prioridade)
    }

    if(prioridade != "desativado" && status == "desativado"){
        filteredData = filteredData.filter( (t) => t.prioridade == prioridade);

        //console.log('so prioridade',status,prioridade)
    }

    if(status != "desativado" && prioridade == "desativado"){
        const statusBol = status == "0" ? true : false;
        filteredData = filteredData.filter( (t) => t.concluida == statusBol);

        //console.log('so status',status,prioridade)
    }

    //busca tambem pelo começo pra ver se escreveu errado
    if(text.length > 0){
        if(text.length > 2){
            let initialText = text.slice(0, text.length--); 
            //filteredData = filteredData.filter( (t) => t.titulo == text || t.titulo.includes(initialText));
            filteredData = filteredData.filter( (t) => t.titulo.slice(0,text.length--) == initialText || t.titulo === text);
        }else{
            filteredData = filteredData.filter( (t) => t.titulo === text);
        }

        exibirDados(filteredData);
        return;
    }else{
        exibirDados(filteredData)
    }

    if(status == "desativado" && prioridade == "desativado"){
        exibirDados(getData());
        return
    }   
}

function exibirDados(data){
    list.innerHTML = "";
    gerarLabels();
    
    data.forEach((e,i) => {
        const div = document.createElement('div');

        const pTitulo = document.createElement('p');
        
        const pDate = document.createElement('p');
        const pPrioridade = document.createElement('p');
        const pConcluida = document.createElement('p');

        div.classList.add('itemListTask');

        
        
        pTitulo.innerHTML = e.titulo;
         
        pDate.innerHTML = formatDate(e.data);
        pPrioridade.innerHTML = getOptionValue(e.prioridade);

        

        pConcluida.innerHTML = e.concluida == true ? "Concluída" : "Em Aberto"; 

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
        div.appendChild(pDate);
        div.appendChild(pPrioridade);
        div.appendChild(pConcluida);
        
        actions.appendChild(eyeButton);
        actions.appendChild(deleteButton);
        
        if(e.concluida){
            div.classList.add('completedTask')
        }else{
            actions.appendChild(checkButton);
            actions.appendChild(editButton);
        }
        
        div.appendChild(actions);
        
        list.appendChild(div)
    });
};

function getOptionValue(option){
    let text = "";

    switch(option){
        case '0' :
            text = "Baixa"
            break;
        case '1':
            text = "Normal"
            break;
        case '2':
            text = "Urgente"
            break;
        default:
            text = ""
    }
    return text;
}

function formatDate(date){
    let dateTime = new Date(date);
    return dateTime.toLocaleString();
}

function apagarTarefa(index){
    const dados = getData();

    dados.splice(index,1)
    alert('tarefa apagada!');

    localStorage.setItem(LSS_NAME, JSON.stringify(dados));
    exibirDados(getData())
}

function marcarTarefaConcluida(index){
    const dados = getData();
    console.log('tarefa ', dados[index]);
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

function gerarLabels(){
    const div = document.createElement('div');
    div.classList.add('labelsTask');

        const pTitulo = document.createElement('p');
        const pDesc = document.createElement('p');
        const pDate = document.createElement('p');
        const pPrioridade = document.createElement('p');
        const pConcluida = document.createElement('p');
        const pButton = document.createElement('p');

        div.classList.add('itemListTask');
        
     
        pTitulo.innerHTML = 'TITULO';
        //pDesc.innerHTML = "DESCRIÇÃO";
        pDate.innerHTML = 'DATA';
        pPrioridade.innerHTML = 'PRIORIDADE';
        pConcluida.innerHTML = 'STATUS'; 
        pButton.innerHTML = "AÇÕES"
        
        div.appendChild(pTitulo);
        //div.appendChild(pDesc);
        div.appendChild(pDate);
        div.appendChild(pPrioridade);
        div.appendChild(pConcluida);
        div.appendChild(pButton);
        
        list.appendChild(div);
}

function exibirDetalhes(index){
     
    const dados = getData();
    let tarefa = dados[index];

    const lista = document.querySelectorAll('.itemListTask');
    let posicao = index + 1;

    const desc = document.createElement('div');
    desc.classList.add('descItem');
    desc.innerHTML = `<h3>Descrição:</h3> <p>${tarefa.descricao}</p>`

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
 
