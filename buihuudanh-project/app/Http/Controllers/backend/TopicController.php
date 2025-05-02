<?php

namespace App\Http\Controllers\backend;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTopicRequest;
use App\Http\Requests\UpdateTopicRequest;
use App\Models\Topic;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class TopicController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $list = Topic::where('status', '!=', '0')
            ->orderBy('created_at', 'desc')
            ->select(
                'id',
                'name',
                'description',
                'status'
            )
            ->get();
        $sort_order = '';
        foreach ($list as $row) {
            $sort_order .= '<option value="' . ($row->id + 1) . '">Sau: ' . $row->name . '</option>';
        }
        return response()->json($list);
    }



    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTopicRequest $request)
    {
        $topic = new Topic();
        $topic->name = $request->name;
        $topic->description = $request->description;
        $topic->status = $request->status;
        $topic->sort_order = $request->sort_order;
        $topic->slug = Str::of($request->name)->slug('-');
        $topic->created_at = date('Y-m-d H:i:s');
        $topic->created_by = Auth::id() ?? 1;

        $topic->save();
        return response()->json(['message' => 'Topic created successfully', 'topic' => $topic], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $topic = Topic::find($id);
        if ($topic === null) {
            return response()->json(['message' => 'Topic not found'], 404);
        }

        return response()->json($topic);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $topic = Topic::find($id);
        if ($topic === null) {
            return response()->json(['message' => 'Topic not found'], 404);
        }
        $list = Topic::where('status', '!=', '0')
            ->orderBy('created_at', 'desc')
            ->select('id', 'name', 'status', 'sort_order')
            ->get();
        $htmlsortorder = '';
        foreach ($list as $row) {
            if ($topic->sort_order - 1 == $row->sort_order) {
                $htmlsortorder .= '<option selected value="' . ($row->sort_order + 1) . '">Sau: ' . $row->name . '</option>';
            } else {
                $htmlsortorder .= '<option value="' . ($row->sort_order + 1) . '">Sau: ' . $row->name . '</option>';
            }
        }
        return response()->json([
            'topic' => $topic,
            'list' => $list,
            'htmlsortorder' => $htmlsortorder,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTopicRequest $request, string $id)
    {
$topic = Topic::find($id);
        if ($topic === null) {
            return response()->json(['message' => 'Topic not found'], 404);
        }
        $topic->name = $request->name;
        $topic->description = $request->description;
        $topic->status = $request->status;
        $topic->sort_order = $request->sort_order;
        $topic->slug = Str::of($request->name)->slug('-');
        $topic->updated_at = date('Y-m-d H:i:s');
        $topic->updated_by = Auth::id() ?? 1;

        $topic->save();
        return response()->json(['message' => 'Topic updated successfully'], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $topic = Topic::find($id);
        if ($topic === null) {
            return response()->json(['message' => 'Topic not found'], 404);
        }


        $topic->delete();
        return response()->json(['message' => 'Topic deleted successfully'], 200);
    }

    public function stastus(string $id)
    {
        $topic = Topic::find($id);
        if ($topic === null) {
            return response()->json(['message' => 'Topic not found'], 404);
        }
        $topic->status = ($topic->status == 1) ? 2 : 1;
        $topic->updated_at = date('Y-m-d H:i:s');
        $topic->updated_by = Auth::id() ?? 1;

        $topic->save();
        return response()->json(['message' => 'Topic status updated successfully', 'status' => $topic->status], 200);
    }

    public function delete(string $id)
    {
        $topic = Topic::find($id);
        if ($topic === null) {
            return response()->json(['message' => 'Topic not found'], 404);
        }


        $topic->status = 0;
        $topic->updated_at = date('Y-m-d H:i:s');
        $topic->updated_by = Auth::id() ?? 1;

        $topic->save();
        return response()->json(['message' => 'Topic moved to trash'], 200);
    }

    public function trash()
    {
        $list = Topic::where('status', '=', '0')
            ->orderBy('created_at', 'desc')
            ->select('id', 'name', 'status')
            ->get();
        return response()->json($list);
    }

    public function restore(string $id)
    {
        $topic = Topic::find($id);
        if ($topic === null) {
            return response()->json(['message' => 'Topic not found'], 404);
        }
        $topic->status = 2;
        $topic->updated_at = date('Y-m-d H:i:s');
        $topic->updated_by = Auth::id() ?? 1;

        $topic->save();
        return response()->json(['message' => 'Topic restored successfully'], 200);
    }

}