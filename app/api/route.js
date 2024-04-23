import { NextRequest, NextResponse } from "next/server";

export async function GET(req) {
    console.log("hi");
    return NextResponse.json({"HALLO": "HALLO"});
}