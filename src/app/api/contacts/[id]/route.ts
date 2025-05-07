import {NextRequest, NextResponse} from 'next/server';
import ContactsController from "@/controllers/contacts";


export async function GET(request: NextRequest,
                          { params }: { params: { id: number } } ) {
    try {
        const resolvedParams = await params;
        const id = resolvedParams.id;

        const contactData = await ContactsController.getContact(id);

        return NextResponse.json({ profileData: contactData }, { status: 200 })
    } catch {
        return NextResponse.json(
            { message: 'Failed to get contacts'},
            { status: 500 }
        )
    }
}
