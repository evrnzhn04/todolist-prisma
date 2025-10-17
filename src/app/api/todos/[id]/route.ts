import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Tek bir todo getir (id'ye göre)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params; // ← async await ekledik
    const id = parseInt(idString);

    const todo = await prisma.todo.findUnique({
      where: { id }
    });

    if (!todo) {
      return NextResponse.json(
        { error: 'Todo bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json(todo);
  } catch (error) {
    console.error('Todo getirme hatası:', error);
    return NextResponse.json(
      { error: 'Todo getirilemedi' },
      { status: 500 }
    );
  }
}

// PUT - Todo güncelle
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params; // ← async await ekledik
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
    console.error('Todo güncelleme hatası:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Todo bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Todo güncellenemedi' },
      { status: 500 }
    );
  }
}

// DELETE - Todo sil
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params; // ← async await ekledik
    const id = parseInt(idString);

    await prisma.todo.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: 'Todo silindi' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Todo silme hatası:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Todo bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Todo silinemedi' },
      { status: 500 }
    );
  }
}