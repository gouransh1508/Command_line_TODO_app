
// requiring different modules
const fs = require('fs');

const _ = require('lodash'); // requiring loadash 

const yargs = require('yargs'); // requiring yargs to take input from commandLIne

const args = yargs.argv; // using argv method from yargs to take input

let command = args._[0]; // Saving command from the user into varible 'command'



// function for Read Stream to list todos

let reader = (file)=>{
    let reader = fs.createReadStream(file);
    reader.on('data', function(chunk){
            var todos_without_numbers = chunk.toString().split('\n');
            var no_of_Lines = todos_without_numbers.length;
            todos_without_numbers.reverse().forEach((todo,index)=>{
                if(index != 0){
             todos_with_numbers = `[${no_of_Lines - index}] ${todo}`;   
                    console.log(todos_with_numbers);
            }
            })
        })
        reader.on('error', err =>{
            console.log('There are no pending todos!');
        })
        
}

// function for read Stream and write Stream for deleting todos

let readerWriter1 = (file) =>{
    let todo_number_to_delete = args._[1];
        var todo_array = new Array();

        let reader = fs.createReadStream(file);
        reader.on('data',function(chunk){
            let total_todos = chunk.toString().split('\n');
            let no_of_Lines = total_todos.length;
            if(todo_number_to_delete > no_of_Lines -1 || todo_number_to_delete == 0){
                console.log(`Error: todo #${todo_number_to_delete} does not exist. Nothing deleted.`);
                return;
            }
            if(todo_number_to_delete == undefined){
                console.log('Error: Missing NUMBER for deleting todo.');
                return;
            }
            
            total_todos.reverse().forEach((todo,index)=>{
                if(index != 0){
             todos_with_numbers = `[${no_of_Lines - index}] ${todo}`;   
                    todo_array.push(todos_with_numbers);
            }
        })
        
    
        fs.unlinkSync('todo.txt');
        let logger = fs.createWriteStream('todo.txt', {     // creating a file Stream to write todo to todo.txt
            flags: 'a' // a means appending (old data will be preserved);
        })
        todo_array.reverse().forEach((todo)=>{
            if(todo.slice(1,2) != todo_number_to_delete){
                logger.write(`${todo.slice(4,todo.length)}\n`);  
            }
        })
        console.log(`Deleted todo #${todo_number_to_delete}`)
        })
        reader.on('error', err =>{
            console.log('Error: Missing NUMBER for deleting todo.');
        })
        
}

// function for marking todo as done

let readerWriter2 = (file) =>{
    let todo_number_to_done = args._[1];
        var todo_array = new Array();

        let reader = fs.createReadStream(file);
        reader.on('data',function(chunk){
            let total_todos = chunk.toString().split('\n');
            let no_of_Lines = total_todos.length;
            if(todo_number_to_done > no_of_Lines -1 || todo_number_to_done == 0){
                console.log(`Error: todo #${todo_number_to_done} does not exist.`);
                return;
            }
            if(todo_number_to_done === undefined){
                console.log('Error: Missing NUMBER for marking todo as done.')
                return;
            }
            total_todos.reverse().forEach((todo,index)=>{
                if(index != 0){
             todos_with_numbers = `[${no_of_Lines - index}] ${todo}`;   
                    todo_array.push(todos_with_numbers);
            }
        })
    
        fs.unlinkSync('todo.txt');
        let logger = fs.createWriteStream('todo.txt', {
            flags: 'a' 
        })
        let logger1 = fs.createWriteStream('done.txt', {
            flags: 'a' 
        })
        todo_array.reverse().forEach((todo)=>{
            if(todo.slice(1,2) != todo_number_to_done){
                logger.write(`${todo.slice(4,todo.length)}\n`);  
            }else{
                let d = new Date();
                logger1.write(`x ${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${todo.slice(4,todo.length)}\n`)
            }

        })
        console.log(`Marked todo #${todo_number_to_done} as done.`)

        
})
}

let readerWriter3 = (file1, file2) =>{
    var reader = fs.createReadStream(file1);
    reader.on('data', function(chunk){
        let total_todos = chunk.toString().split('\n');
        let no_of_Lines = total_todos.length - 1; 
        var reader1 = fs.createReadStream(file2);
        reader1.on('data', function(chunk){
            let total_todos1 = chunk.toString().split('\n');
            let no_of_Lines1 = total_todos1.length - 1;
            let d = new Date();
            console.log(`${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} Pending : ${no_of_Lines} Completed : ${no_of_Lines1}`);
 
        })
    })
    
    
}

// HELP Option

if(command == undefined || command == "Help"){
    console.log("Usage :-");
    console.log("$ ./todo add \"todo item\"  # Add a new todo");
    console.log("$ ./todo ls               # Show remaining todos");
    console.log("$ ./todo del NUMBER       # Delete a todo");
    console.log("$ ./todo done NUMBER      # Complete a todo");
    console.log("$ ./todo help             # Show usage");
    console.log("$ ./todo report           # Statistics")
}

// add TODOS in 'todo.txt' text file
 let addTodo = ()=>{
    const todo = args._[1];
    if(todo === undefined){
        console.log("Error: Missing todo string. Nothing added!");
        return;
    }
    let logger = fs.createWriteStream('todo.txt', {     // creating a file Stream to write todo to todo.txt
        flags: 'a' // a means appending (old data will be preserved);
    })
    logger.write(`${todo}\n`);
    console.log(`Added todo: "${todo}"`); 
 }

switch(command){
    case 'add':
        addTodo();
        break;
    case 'ls':
        reader('todo.txt');
        break;
    case 'del':
        readerWriter1('todo.txt');
        break;
    case 'done':
        readerWriter2('todo.txt')
        break;
    case 'report':
        readerWriter3('todo.txt','done.txt');
        break;
}




