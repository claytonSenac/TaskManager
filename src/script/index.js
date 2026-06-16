//Variaveis locais
const OPTIONS_COUNT = 3;
const LSS_NAME = "tasks";

//Pego o formulario e os campos do form
const form = document.querySelector('#form');
const list = document.querySelector('.containerListTasks')

const titulo = document.querySelector('#tituloTask');
const descricao = document.querySelector('#descTask');
const data = document.querySelector('#dataTask');
const prioridade = document.querySelector('#prioridadeTask');

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
        const res = salvarLocalStorage(task);
        //console.log(res)
        alert('Tarefa Criada')
        form.reset();
    }else{
        alert('dados invalidos!')
    }
    //console.log(isValid)
    exibirDados();
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

//recupero os dados do local storage formato
function getData(){
    const data = localStorage.getItem(LSS_NAME);

    const parsedData = JSON.parse(data) || [];
    return parsedData;
}

function exibirDados(){
    list.innerHTML = "";
    gerarLabels();
    const data = getData();
    data.forEach((e,i) => {
        const div = document.createElement('div');

        const pTitulo = document.createElement('p');
        const pDesc = document.createElement('p');
        const pDate = document.createElement('p');
        const pPrioridade = document.createElement('p');
        const pConcluida = document.createElement('p');

        div.classList.add('itemListTask');
        
     
        pTitulo.innerHTML = e.titulo;
        //pDesc.innerHTML = e.descricao;
        pDate.innerHTML = formatDate(e.data);
        pPrioridade.innerHTML = getOptionValue(e.prioridade);
        pConcluida.innerHTML = e.concluida == true ? "Concluída" : "Em Aberto"; 

        const button = document.createElement('div');
        button.innerHTML = '<i class="bi bi-trash-fill"></i>';
        
        button.addEventListener('click',()=>{
            apagarTarefa(i)
        });
       
        div.appendChild(pTitulo);
        //div.appendChild(pDesc);
        div.appendChild(pDate);
        div.appendChild(pPrioridade);
        div.appendChild(pConcluida);
        div.appendChild(button);
        
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
    exibirDados()
}

function gerarLabels(){
    const div = document.createElement('div');
    div.classList.add('labelsTask')

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

exibirDados();
