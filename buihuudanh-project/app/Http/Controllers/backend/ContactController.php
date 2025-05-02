<?php

namespace App\Http\Controllers\backend;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreContactRequest;
use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class ContactController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $list = Contact::where('cdtt_contact.status', '!=', '0')
            ->leftJoin('cdtt_user', 'cdtt_user.id', '=', 'cdtt_contact.user_id')
            ->orderBy('cdtt_contact.created_at', 'desc')
            ->select(
                'cdtt_contact.id',
                'cdtt_contact.name',
                'cdtt_contact.email',
                'cdtt_contact.phone',
                'cdtt_user.name as username',
                'cdtt_contact.status'
            )
            ->get();
        return response()->json($list);
    }



    public function show(string $id)
    {
        $contact = Contact::where([['cdtt_contact.status', '!=', '0'], ['cdtt_contact.id', '=', $id]])
            ->leftJoin('cdtt_user', 'cdtt_user.id', '=', 'cdtt_contact.user_id')
            ->select(
                'cdtt_contact.id',
                'cdtt_contact.name',
                'cdtt_contact.email',
                'cdtt_contact.phone',
                'cdtt_user.name as username',
                'cdtt_contact.status',
                'cdtt_contact.created_at',
                'cdtt_contact.updated_at',
                'cdtt_contact.content'
            )
            ->first();
        if ($contact === null) {
            return response()->json(['message' => 'Contact not found'], 404);
        }
        return response()->json($contact);
    }


    public function trash()
    {
        $list = Contact::where('cdtt_contact.status', '=', '0')
            ->leftJoin('cdtt_user', 'cdtt_user.id', '=', 'cdtt_contact.user_id')
            ->orderBy('cdtt_contact.created_at', 'desc')
            ->select(
                'cdtt_contact.id',
                'cdtt_contact.name',
                'cdtt_contact.email',
                'cdtt_contact.phone',
                'cdtt_user.name as username',
                'cdtt_contact.status'
            )
            ->get();
        return response()->json($list);
    }

    public function restore(string $id)
    {
        $contact = Contact::find($id);
        if ($contact === null) {
            return response()->json(['message' => 'Contact not found'], 404);
        }
        $contact->status = 2;
        $contact->updated_at = date('Y-m-d H:i:s');
        $contact->updated_by = Auth::id() ?? 1;

        $contact->save();
        return response()->json(['message' => 'Contact restored successfully']);
    }
    public function delete(string $id)
    {
        $contact = Contact::find($id);
        if ($contact === null) {
            return response()->json(['message' => 'Contact not found'], 404);
        }


        $contact->status = 0;
$contact->updated_at = date('Y-m-d H:i:s');
        $contact->updated_by = Auth::id() ?? 1;

        $contact->save();
        return response()->json(['message' => 'Contact moved to trash']);
    }
    public function destroy(string $id)
    {
        $contact = Contact::find($id);
        if ($contact === null) {
            return response()->json(['message' => 'Contact not found'], 404);
        }


        $contact->delete();
        return response()->json(['message' => 'Contact deleted successfully'], 200);
    }
    public function store(StoreContactRequest $request)
    {

        $contact = new Contact();
        $contact->name = $request->name;
        $contact->email = $request->email;
        $contact->content = $request->content;
        $contact->phone = $request->phone;
        $contact->user_id = Auth::id() ?? 1;
        $contact->title = $request->title;
        $contact->created_at = date('Y-m-d H:i:s');
        $contact->status = 1;

        $contact->save();
        return response()->json(['message' => 'Contact submitted successfully'], 201);
    }

    public function stastus(string $id)
    {
        $contact = Contact::find($id);
        if ($contact === null) {
            return response()->json(['message' => 'Contact not found'], 404);
        }
        $contact->status = ($contact->status == 1) ? 2 : 1;
        $contact->updated_at = date('Y-m-d H:i:s');
        $contact->updated_by = Auth::id() ?? 1;

        $contact->save();
        return response()->json(['message' => 'Contact status updated successfully']);
    }
}