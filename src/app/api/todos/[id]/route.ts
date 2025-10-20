import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET 
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params;
    const id = parseInt(idString);

    const todo = await prisma.todo.findUnique({
      where: { id }
    });

    if (!todo) {
      return NextResponse.json(
        { error: 'Todo not found!' },
        { status: 404 }
      );
    }

    return NextResponse.json(todo);
  } catch (error) {
    console.error('Failed to fetch todo:', error);
    return NextResponse.json(
      { error: 'Failed to fetch todo.' },
      { status: 500 }
    );
  }
}

// PUT 
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params;
    const id = parseInt(idString);
    const body = await request.json();
    const { title, completed } = body;

    const updateData: any = {};
    if (title !== undefined) updateData.title = title.trim();
    if (completed !== undefined) updateData.completed = completed;

    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json(updatedTodo);
  } catch (error: any) {
    console.error('Failed to update todo:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Todo not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update todo.' },
      { status: 500 }
    );
  }
}

// DELETE
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params;
    const id = parseInt(idString);

    await prisma.todo.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: 'Todo deleted.' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Failed to delete todo:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Todo not found!' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete todo!' },
      { status: 500 }
    );
  }
}