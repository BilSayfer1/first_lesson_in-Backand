let form = document.forms.namedItem('todo');
let container = document.querySelector(".container");
let input = document.querySelector("input");

let todos = [];
reload(todos, container);

form.onsubmit = (e) => {
    e.preventDefault();
    const fm = new FormData(form);

    const task = {
        id: crypto.randomUUID(),
        task: fm.get('title'),
        time: new Date().toTimeString().split(' ')[0],
        isDone: false
    };

    fetch('http://localhost:8080/todos', {
        method: 'post',
        body: JSON.stringify(task)
    })
    .then(res => res.json())
    .then(res => {
        console.log(res);
        todos.push(task);
        reload(todos, container);
    });
};

function reload(arr, place) {
    place.innerHTML = "";

    for (let item of arr) {
        const divItem = document.createElement('div');
        divItem.classList.add('item');
        divItem.dataset.id = item.id;

        const divTopSide = document.createElement('div');
        divTopSide.classList.add('top-side');

        const spanTitle = document.createElement('span');
        spanTitle.textContent = item.task;
        if (item.isDone) {
            spanTitle.style.textDecoration = 'line-through';
        }

        const izmenitButton = document.createElement('button');
        izmenitButton.classList.add('izmenit');
        izmenitButton.textContent = "Izmenit";

        const buttonClose = document.createElement('button');
        buttonClose.classList.add('close');
        buttonClose.textContent = 'x';

        const spanTime = document.createElement('span');
        spanTime.classList.add('time');
        spanTime.textContent = item.time;

        divTopSide.append(spanTitle);
        divTopSide.append(izmenitButton);
        divTopSide.append(buttonClose);

        divItem.append(divTopSide);
        divItem.append(spanTime);

        place.append(divItem);

        buttonClose.onclick = () => {
            fetch(`http://localhost:8080/todos/${item.id}`, {
                method: 'delete',
                body: JSON.stringify({ id: item.id })
            })
            .then(res => res.json())
            .then(res => {
                console.log(res);
                todos = todos.filter(todo => todo.id !== item.id);
                reload(todos, place);
            });
        };

        spanTitle.onclick = () => {
            item.isDone = !item.isDone;
            reload(todos, place);
        };

        izmenitButton.onclick = () => {
            const newTask = prompt(item.task);
            if (newTask) {
                fetch(`http://localhost:8080/todos/${item.id}`, {
                    method: 'put',
                    body: JSON.stringify({ id: item.id, task: newTask, isDone: item.isDone, time: item.time })
                })
                .then(res => res.json())
                .then(res => {
                    console.log(res);
                    item.task = newTask;
                    reload(todos, place);
                });
            }
        };
    }
}

console.log(todos);