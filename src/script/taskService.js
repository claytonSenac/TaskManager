const LSS_NAME = "tasks";
const showCompletedInLast = true;

export function getData(){
    const data = localStorage.getItem(LSS_NAME);

    const parsedData = JSON.parse(data) || [];

    //trago as concluidas primeiro!
    if(showCompletedInLast){
        let ordenedData = parsedData.sort((a,b)=> !b.concluida - !a.concluida);
        return ordenedData;
    }else{
        
        return parsedData;
    }
}

export function buscarComFiltro(){
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

 

export function apagarTarefa(index){
    const dados = getData();

    dados.splice(index,1)
    alert('tarefa apagada!');

    localStorage.setItem(LSS_NAME, JSON.stringify(dados));
    exibirDados(getData())
};

export function salvarAlteracoes(task,index){
    const dados = getData();
    let tarefa = dados[index];

    tarefa.titulo = task.titulo;
    tarefa.descricao = task.descricao;
    tarefa.prioridade = task.prioridade;
    tarefa.data = task.data;

    dados.splice(index,1,tarefa);
    localStorage.setItem(LSS_NAME, JSON.stringify(dados));

    return tarefa;
};

export function salvarLocalStorage(task){
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
