import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

// nous allons devons enregistrer un nouvel utilisateur
async function POST (request) {

    const body = await request.json();
     const nomComplet= body.nomComplet;
     const motDePasse = body.motDePasse??body.password;
     const email= body.email ;
     


}