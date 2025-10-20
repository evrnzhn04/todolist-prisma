'use client';
import { useEffect, useState,useRef  } from "react";
import { FaPlus } from "react-icons/fa";
import { FaPen } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";

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
      console.error('todolar çekilemedi:',error);
    }
  }

  const handleAddTodo=async ()=>{
    try{
      const newTitle =title.trim();
      if(!newTitle){
        alert("Başlık boş olamaz!");
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
      console.error('Todo ekleme hatası:', error);
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
      console.error('Todo silme hatası:', error);    
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
      console.error('Todo düzenleme hatası:', error);
    }
  }

  return (
    <main className="bg-slate-800 w-full h-screen flex flex-col items-center">

      <header className="bg-slate-600 w-full p-6 flex justify-center items-center gap-4 mb-10">
        <input value={title} onChange={(e)=>setTitle(e.target.value)} type="text" placeholder="Task Enter" className="text-xl border-2 p-4 w-1/3 placeholder-gray-300 rounded-2xl"/>
        <button onClick={handleAddTodo}>
          <FaPlus size={40} className="text-white hover:text-slate-300 hover:scale-115 duration-300"/>
        </button>
      </header>

      {todos.map((todo)=>(
        <div key={todo.id} className="bg-slate-500 w-1/2 p-6 rounded-3xl mb-8 flex flex-row justify-between items-center gap-4
                                      hover:scale-105 duration-300"
        >
          <div className="w-3xl break-words">

            {editingId === todo.id ? (
              <input 
                ref={editInputRef}
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="outline-none text-2xl text-white bg-slate-500 p-2 rounded w-3xl"
              />
            ) : (
              <h2 className="text-2xl text-white">{todo.title}</h2>
            )}      

          </div>
          Buraya bir seyler yazdim...
          {/**Butonlar*/}
          {editingId === todo.id ? (
            <div className="flex gap-2">
              <button onClick={() => handleSaveEdit(todo.id)} className="bg-green-600 text-white px-4 py-2 rounded">
                Record
              </button>
              <button onClick={() => setEditingId(null)} className="bg-gray-600 text-white px-4 py-2 rounded">
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex flex-row gap-6">
              <button onClick={() => handleEditClick(todo.id, todo.title)}>
                <FaPen size={30} className="hover:text-blue-950 hover:scale-120 duration-200"/>
              </button>
              <button onClick={() => handleDeleteTodo(todo.id)}>
                <FaTrash size={30} className="hover:text-red-500 hover:scale-120 duration-200"/>
              </button>
            </div>
          )}
        </div>
      ))}

    </main>
  );
}
