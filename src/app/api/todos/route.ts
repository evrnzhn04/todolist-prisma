import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';


export async function GET(){
    try{
        const todos= await prisma.todo.findMany({
            orderBy:{createdAt:'desc'}
        });

        return NextResponse.json(todos);
    }catch(error){
        console.error('Failed to fetch todos:',error);
        return NextResponse.json({message:'Failed to fetch todos'}, {status:500});
    }
}

export async function POST(request:Request){
    try{
        const body=await request.json();
        const {title}=body;

        if(!title||title.trim()===''){
            return NextResponse.json({message:'Title is required!'},{status:400});
        }

        const newTodo=await prisma.todo.create({
            data:{title: title.trim()}
        });

        return NextResponse.json(newTodo,{status:201});
    }catch(error){
        console.error('Failed to create todo:', error);
        return NextResponse.json({ error: 'Failed to create todo!' },{ status: 500 });
    }
}