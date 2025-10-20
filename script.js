// SELETORES GLOBAIS
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list'); // Elemento pai para delegação
const filterControls = document.querySelector('.filter-controls');

let currentFilter = 'all'; // Estado para o filtro ativo

// ===========================================
// FUNÇÕES DE MANIPULAÇÃO DO DOM
// ===========================================

function createTaskElement(taskText) {
    const li = document.createElement('li');
    li.classList.add('task-item');
    li.innerHTML = `
        <span class="task-text">${taskText}</span>
        <div class="task-actions">
            <button class="complete-btn" data-action="complete">Concluir</button>
            <button class="edit-btn" data-action="edit">Editar</button>
        </div>
    `;
    return li;
}

// ===========================================
// LÓGICA DE SUBMISSÃO (taskForm)
// ===========================================
taskForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const taskText = taskInput.value.trim();
    if (taskText) {
        const newTask = createTaskElement(taskText);
        taskList.appendChild(newTask);
        taskInput.value = ''; // Limpa o input
        applyFilter(currentFilter); // Garante que a nova tarefa apareça, se o filtro permitir
    }
});

// ===========================================
// DELEGAÇÃO DE EVENTOS (task-list)
// Objetivo: Controlar cliques em toda a lista (marcar concluída e editar)
// ===========================================
taskList.addEventListener('click', function(e) {
    const target = e.target;
    
    // 1. Encontra o item <li> da tarefa mais próxima
    // Isso garante que estamos agindo sobre o contêiner da tarefa.
    const taskItem = target.closest('.task-item');
    if (!taskItem) return; 

    // O data-action do botão clicado determina a ação.
    const action = target.dataset.action;

    // --- Marcar como Concluída ---
    if (action === 'complete') {
        taskItem.classList.toggle('completed');
        // Atualiza o texto do botão (toggle)
        target.textContent = taskItem.classList.contains('completed') ? 'Pendente' : 'Concluir';
        
        applyFilter(currentFilter); // Reaplica o filtro para esconder/mostrar se necessário
    }

    // --- Editar Tarefa ---
    else if (action === 'edit') {
        const taskTextSpan = taskItem.querySelector('.task-text');
        const isEditing = taskItem.classList.contains('editing');
        
        if (isEditing) {
            // Se estava editando, SALVA
            const editInput = taskItem.querySelector('.task-edit-input');
            if (editInput.value.trim() !== '') {
                taskTextSpan.textContent = editInput.value;
            }
            
            taskItem.classList.remove('editing');
            taskTextSpan.style.display = 'inline'; // Mostra o span
            editInput.remove(); // Remove o input
            target.textContent = 'Editar';
        } else {
            // Se não estava editando, ENTRA em modo de edição
            taskItem.classList.add('editing');
            const originalText = taskTextSpan.textContent;
            
            // Cria e configura o input de edição
            const editInput = document.createElement('input');
            editInput.type = 'text';
            editInput.value = originalText;
            editInput.classList.add('task-edit-input'); // Classe para seleção
            
            // Insere o input antes dos botões de ação
            taskItem.insertBefore(editInput, taskItem.querySelector('.task-actions')); 
            taskTextSpan.style.display = 'none'; // Esconde o span
            
            target.textContent = 'Salvar';
            editInput.focus();

            // Opcional: Salvar ao pressionar Enter
            editInput.addEventListener('keypress', function(event) {
                if (event.key === 'Enter') {
                    event.preventDefault(); 
                    target.click(); // Simula o clique no botão Salvar
                }
            });
        }
    }
});

// ===========================================
// LÓGICA DE FILTROS (No Final do script.js)
// ===========================================

function applyFilter(filter) {
    const items = taskList.querySelectorAll('.task-item');
    
    items.forEach(item => {
        const isCompleted = item.classList.contains('completed');
        
        // Define se o item deve ser mostrado ou escondido
        let shouldShow = false;
        
        switch (filter) {
            case 'pending':
                shouldShow = !isCompleted;
                break;
            case 'completed':
                shouldShow = isCompleted;
                break;
            case 'all':
            default:
                shouldShow = true;
                break;
        }

        item.style.display = shouldShow ? 'flex' : 'none'; // 'flex' é o display padrão do .task-item
    });
}

// Delegação de Eventos para os Botões de Filtro
filterControls.addEventListener('click', function(e) {
    const target = e.target;
    
    if (target.classList.contains('filter-btn')) {
        // 1. Atualiza o estado visual dos botões
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        target.classList.add('active');
        
        // 2. Aplica o novo filtro
        currentFilter = target.dataset.filter;
        applyFilter(currentFilter);
    }
});

// Aplica o filtro inicial ao carregar a página
applyFilter(currentFilter);