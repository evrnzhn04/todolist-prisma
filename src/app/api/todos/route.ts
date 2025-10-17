import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';


export async function GET(){
    try{
        const todos= await prisma.todo.findMany({
            orderBy:{createdAt:'desc'}
        });

        return NextResponse.json(todos);
    }catch(error){
        console.error('todo getirme hatası:',error);
        return NextResponse.json({message:'todo/todolar getirilemedi'}, {status:500});
    }
}

export async function POST(request:Request){
    try{
        const body=await request.json();
        const {title}=body;

        if(!title||title.trim()===''){
            return NextResponse.json({message:'başlık gerekli'},{status:400});
        }

        const newTodo=await prisma.todo.create({
            data:{title: title.trim()}
        });

        return NextResponse.json(newTodo,{status:201});
    }catch(error){
        console.error('Todo oluşturma hatası:', error);
        return NextResponse.json({ error: 'Todo oluşturulamadı' },{ status: 500 });
    }
}