import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
const resend_api_key = process.env.RESEND_API_KEY;

export async function POST(req) {
    try {
        const body = await req.json();

        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${resend_api_key}`,
            },
            body: JSON.stringify({
                from: 'Acme <onboarding@resend.dev>',
                to: [body.email],
                subject: "BitsBazaar One-Time Reset Token",
                html: `<strong>${body.randomCode}</strong>`
            })
        });

        if (res.ok) {
            const data = await res.json();
            return NextResponse.json(data);
        }

        return NextResponse.json({success: true});
    } catch (error) {
        console.log("Error when sending email: ", error);
        return NextResponse.error("Error when sending email", 500);
    }
}