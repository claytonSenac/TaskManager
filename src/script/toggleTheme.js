const divTheme = document.querySelector('#containerToggleTheme');
const icon = document.querySelector('#iconTheme');

let darkTheme = false;
// const NM_LSS = 'darkTheme';

// function loadPreviusValue(){
//     console.log('carregando dados antigos')
//     let theme = localStorage.getItem(NM_LSS);

//     //gambiarra pq true pro local storage vai como "TRUE"
//     //tentei tambem com true false antes 
//     if (theme !=null && (theme == 'ativo' || theme == 'desativado')){
//         darkTheme = theme;

//         toggleTheme(theme);
//     }else{
//         salvarTemaLocalStorage(darkTheme)
//     }
// }

// function salvarTemaLocalStorage(theme){    
//     localStorage.setItem(NM_LSS,theme)
// }

// loadPreviusValue();



icon.addEventListener('click',() => {
  toggleTheme(darkTheme);
});

function toggleTheme(theme){
    if(theme){
        console.log('estava no tema escuro, setando claro')
        document.body.classList.remove('darkMode');

        
        icon.classList.remove('bi-sun-fill');
        icon.classList.add('bi-moon-fill');
        darkTheme = !theme;
    }else if(!theme){
        document.body.classList.add('darkMode');
        console.log('estava no tema claro, setando escuro')


        icon.classList.add('bi-sun-fill')
        icon.classList.remove('bi-moon-fill')
        darkTheme = !theme;
    }else{
        console.log('caiu no erro');
    }
    


    //salvarTemaLocalStorage(darkTheme)
}

