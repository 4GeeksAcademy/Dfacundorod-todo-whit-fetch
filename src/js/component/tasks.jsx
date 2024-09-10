import React, {useEffect, useState} from "react";

const API_URL= 'https://playground.4geeks.com/todo/users/Facundo';
const API_URL_TODO= 'https://playground.4geeks.com/todo/todos';

export function Tasks(){
    const [task, setTask]=useState([])
	const [inputTask, setInputTask]= useState('')
	const [visibleIndex, setVisibleIndex]= useState('none')
	
useEffect(()=>{
	function getApi(){
		fetch(API_URL).then(response=>{
			if(response.ok){
				return response.json();
			} else { return createUser()}
		})
		.then((data=>{
			setTask(data.todos); 
			console.log(data)
		}))
		.catch(error=>console.error('Erorr: ', error));
	}
	getApi()
},[])
	
	function createUser(){
		fetch(API_URL,{
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({name: `Facundo`})
		}).then(response=>response.json())
		.then(()=>getApi())
		.catch(error=>console.log(`Error: ` , error));
	}
	

	function captureTask(e){
		setInputTask(e.target.value)
	};

	
	function addTaskPost(e){
		e.preventDefault();
		const taskToSend= { label: inputTask };
		fetch('https://playground.4geeks.com/todo/todos/Facundo', {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(taskToSend),
		  })
		  .then(resp => {
			  console.log(resp.ok); // Será true si la respuesta es exitosa
			  console.log(resp.status); // El código de estado 200, 300, 400, etc.
			  return resp.json(); // Intentará parsear el resultado a JSON y retornará una promesa donde puedes usar .then para seguir con la lógica
		  })
		  .then(data => {
			  setInputTask('');
			  setTask(prevTask => [...prevTask, data]);
			  console.log( `La data es: `,data); // Esto imprimirá en la consola el objeto exacto recibido del servidor
		  })
		  .catch(error => {
			  // Manejo de errores
			  console.log(error);
		  });
	}

	function deleteTask(index){
		const incompleteTasks= task.filter((_,taskIndex)=> taskIndex!==index);
		setTask(incompleteTasks);
		deleteTaskApi(index);
	}

	async function deleteTaskApi(index){
		const taskToDelete = task[index];
		if(taskToDelete && taskToDelete.id){
			const response = await fetch(API_URL_TODO+`/${taskToDelete.id}`, {
				method: 'DELETE',
			});
			if (response.ok) {
				const text = await response.text();
				const data = text ? JSON.stringify(text): {};
				return data; 
			} else {
				console.log('error: ', response.status, response.statusText);
				/* Realiaza el tratamiento del error que devolvió el request HTTP */
				return {error: {status: response.status, statusText: response.statusText}};
			}
		}
	};

	function deleteAll(){
		task.forEach((task)=>{
			fetch(API_URL_TODO+`/${task.id}`,{
				method:'DELETE',
			})
			.then(response => {
				if(response.ok){console.log(response)}
				else {console.log(response.status)}
			})
			.catch(error => console.error(`El error: `, error))
		})
		setTask([]);
	}
 
	return (
		<div className="bodyTasks">
			<h1>todos</h1>
			<div className="papper">
			<form onSubmit={addTaskPost}>
				<input className="inputTask" onChange={captureTask}  value={inputTask} type="text" placeholder="Waths need to be done?" />
			</form>
				{task && task.length===0 ? <h2 className="task">No hay tareas, añadir tareas</h2> :
				task.map((elem, index)=>(
					<div key={index} className="taskContainer" onMouseOver={()=>{setVisibleIndex(index)}} onMouseLeave={()=>{setVisibleIndex('none')}}>
						<h2 className="task" >{elem.label}</h2>
						<button style={{display:visibleIndex=== index ? 'flex': 'none' }} className="deleteTask" onClick={()=>deleteTask(index)}>X</button>
					</div>
				))}
				<div className="footer">
					<h3 >{task && task.length === 0 ? `0 items left.`: task.length}</h3>
					<button className="deleteAll" onClick={deleteAll}>Delete All</button>
				</div> 
			</div>
			
		</div>
	);
};