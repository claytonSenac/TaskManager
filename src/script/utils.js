const OPTIONS_COUNT = 3;
const list = document.querySelector('.containerListTasks');


export function formatDate(date){
    let dateTime = new Date(date);
    return dateTime.toLocaleString();
}

// funcao para validar integridade dos dados
export function validarDados(task){
    if(!task) return false;

    if(!task.titulo || !task.descricao || !task.data || !task.prioridade){
        console.log('faltam dados', task)
        return false;
    }

    if(task.prioridade > OPTIONS_COUNT) return false;

    return true
}


export function getOptionValue(option){
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

export function gerarLabels(){
    let width = window.innerWidth;
    let mobileVision = width > 1200 ? false : true;
    
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
        if(!mobileVision){
            if(width > 600){
            div.appendChild(pConcluida);
        }
            div.appendChild(pDate);
            div.appendChild(pPrioridade);
        }

        
        console.log(width)
        div.appendChild(pButton);
        
        list.appendChild(div);
}
