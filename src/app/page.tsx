'use client';
import { useEffect, useState,useRef  } from "react";
import { FaPlus } from "react-icons/fa";
import { FaPen } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { TiTick } from "react-icons/ti";

export default function Home() {
  const [todos,setTodos]=useState<any[]>([])
  const [title,setTitle]=useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(()=>{
    fetchTodos();
  },[])

  const fetchTodos=async()=>{
    try{
      const res = await fetch('api/todos');
      const data =await res.json();
      setTodos(data);
    }catch(error){
      console.error('Failed to fetch todos:',error);
    }
  }

  const handleAddTodo=async ()=>{
    try{
      const newTitle =title.trim();
      if(!newTitle){
        alert("Title cannot be empty!");
        return;
      }

      const res=await fetch('api/todos',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({title:newTitle}),
      });

      if(res.ok){
        setTitle("");
        fetchTodos();
      }

    }catch(error){
      console.error('Failed add to todos:', error);
    }
  }

  const handleDeleteTodo=async(id:number)=>{
    try{
      const res=await fetch(`api/todos/${id}`,{
        method:'DELETE',              
      });

      if(res.ok){
        fetchTodos();
      }
    }catch(error){
      console.error('Failed to delete todo:', error);    
    }
  }

  const handleEditClick = (id: number, currentTitle: string) => {
    setEditingId(id);
    setEditTitle(currentTitle);
    setTimeout(() => editInputRef.current?.focus(), 0);
  };

  const handleSaveEdit=async(id:number)=>{
    try{
      const res=await fetch(`api/todos/${id}`,{
        method:'PUT',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({title:editTitle})
      })

      if(res.ok){
        fetchTodos();
        setEditingId(null);
        setEditTitle("");        
      }
    }catch(error){
      console.error('Failed to update todo:', error);
    }
  }

  return (
    <main className="bg-gradient-to-br from-blue-800 to-purple-800 w-full h-screen flex flex-col items-center">

      <header className="w-full p-6 flex flex-col justify-center items-center gap-4 mb-16">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
          My Tasks
        </h1>

        <div className="w-full flex justify-center gap-4">
          <input value={title} onChange={(e)=>setTitle(e.target.value)} type="text" placeholder="Task Enter" 
            className="text-2xl text-white border-2 border-white p-4 w-1/3 placeholder-gray-300 rounded-2xl"
          />
          <button onClick={handleAddTodo}>
            <FaPlus size={40} className="text-white hover:text-slate-300 hover:scale-115 duration-300"/>
          </button>
        </div>       
        
      </header>

      {todos.map((todo)=>(
        <div key={todo.id} className="border-2 border-white backdrop-blur-3xl w-1/2 p-6 rounded-3xl mb-8 flex flex-row justify-between items-center gap-4 shadow-2xl
                                      hover:bg-[#591BF5] hover:scale-105 duration-300"
        >
          <div className="w-3xl break-words">

            {editingId === todo.id ? (
              <input 
                ref={editInputRef}
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="outline-none text-2xl text-white p-2 rounded w-3xl"
              />
            ) : (
              <h2 className="text-2xl text-white">{todo.title}</h2>
            )}      

          </div>
          
          
          {editingId === todo.id ? (
            <div className="flex gap-2">
              <button onClick={() => handleSaveEdit(todo.id)} className="bg-green-600 text-white px-4 py-2 rounded">
                <TiTick size={35}/>
              </button>
              <button onClick={() => setEditingId(null)} className="bg-red-700 text-white text-2xl font-bold px-4 py-2 rounded">
                X
              </button>
            </div>
          ) : (
            <div className="flex flex-row gap-6">
              <button onClick={() => handleEditClick(todo.id, todo.title)}>
                <FaPen size={30} className="text-white hover:text-green-700 hover:scale-120 duration-200"/>
              </button>
              <button onClick={() => handleDeleteTodo(todo.id)}>
                <FaTrash size={30} className="text-white hover:text-red-500 hover:scale-120 duration-200"/>
              </button>
            </div>
          )}
        </div>
      ))}

    </main>
  );
}
