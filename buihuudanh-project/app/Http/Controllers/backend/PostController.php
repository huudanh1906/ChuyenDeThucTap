<?php

namespace App\Http\Controllers\backend;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Models\Post;
use App\Models\Topic;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        $list = Post::where('cdtt_post.status', '!=', '0')
            ->leftJoin('cdtt_topic', 'cdtt_topic.id', '=', 'cdtt_post.topic_id')
            ->orderBy('cdtt_post.created_at', 'desc')
            ->select(
                'cdtt_post.id',
                'cdtt_post.image',
                'cdtt_post.title',
                'cdtt_post.slug',
                'cdtt_topic.name as topicname',
                'cdtt_post.status',
                'cdtt_post.type'
            )
            ->get();
        return response()->json($list);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $list=Topic::where('status','!=','0')
        ->select('id','name')
        ->get();
        $topic='';
        foreach($list as $row)
        {
            $topic.='<option value="'.$row->id.'">'.$row->name.'</option>';
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePostRequest $request)
    {
        $post=new Post();
        $post->title=$request->title;
        $post->detail=$request->detail;
        $post->status=$request->status;
        $post->type=$request->type;
        if($post->type=='page')
        {
            $post->topic_id = null;
        }
        else{
            $post->topic_id = $request->topic_id;
        }
        $post->description=$request->description;
        if ($request->hasFile('image')) {
            $fileName = date('YmdHis') . '.' . $request->image->extension();
            $request->image->move(public_path('imgs/posts'), $fileName);
            $post->image = $fileName;
        }
        $post->slug=Str::of($request->title)->slug('-');
        $post->created_at=date('Y-m-d H:i:s');
        $post->created_by = Auth::id()?? 1;

        $post->save();
        return response()->json(['message' => 'Post created successfully', 'post' => $post]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $post = post::find($id);
        if ($post === null) {
            return response()->json(['message' => 'Post not found'], 404);
        }

        return response()->json($post);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $post = Post::find($id);
        if ($post == null) {
            return response()->json(['message' => 'Post not found'], 404);
        }

        $topics = Topic::where('status', '!=', '0')
->select('id', 'name')
            ->get();

        return response()->json([
            'post' => $post,
            'topics' => $topics
        ]);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePostRequest $request, string $id)
{
    $post = Post::find($id);
    if ($post == null) {
        return response()->json(['message' => 'Post not found'], 404);
    }

    // Update post fields
    $post->title = $request->title;
    $post->detail = $request->detail;
    $post->status = $request->status;
    $post->type = $request->type;

    if ($post->type == 'page') {
        $post->topic_id = null;
    } else {
        $post->topic_id = $request->topic_id;
    }

    $post->description = $request->description;

    // Check if 'image' is a Base64 encoded string
    if ($request->image && !preg_match('/^data:image\/(\w+);base64,/', $request->image)) {
        // Regular image upload (via form)
        if ($request->hasFile('image')) {
            $exten = $request->image->extension();
            if (in_array($exten, ['jpg', 'jpeg', 'gif', 'png', 'webp'])) {
                $fileName = date('YmdHis') . '.' . $exten;
                $request->image->move(public_path('imgs/posts'), $fileName);
                $post->image = $fileName;
            }
        }
    } else {
        // Handle Base64 encoded image
        if ($request->image) {
            // Extract Base64 data from the image string
            $imageData = explode(',', $request->image)[1];
            $decodedImage = base64_decode($imageData);

            // Generate file name and extension (assumes PNG as default)
            $imageExtension = explode('/', explode(':', substr($request->image, 0, strpos($request->image, ';')))[1])[1];
            $fileName = date('YmdHis') . '.' . $imageExtension;

            // Save image file to the public path
            file_put_contents(public_path('imgs/posts/' . $fileName), $decodedImage);
            $post->image = $fileName;
        }
    }

    // Set slug, updated_at, and updated_by fields
    $post->slug = Str::of($request->title)->slug('-');
    $post->updated_at = now();
    $post->updated_by = Auth::id() ?? 1;

    // Save updated post
    $post->save();

    // Redirect back to post index
    return response()->json(['message' => 'Post updated successfully', 'post' => $post]);
}


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $post = Post::find($id);
        if ($post === null) {
            return response()->json(['message' => 'Post not found'], 404);
        }


        $post->delete();
        return response()->json(['message' => 'Post deleted successfully']);
    }

    public function stastus(string $id)
    {
        $post = Post::find($id);
        if ($post === null) {
            return response()->json(['message' => 'Post not found'], 404);
        }
$post->status = ($post->status == 1) ? 2 : 1;
        $post->updated_at = date('Y-m-d H:i:s');
        $post->updated_by = Auth::id() ?? 1;

        $post->save();
        return response()->json(['message' => 'Post status updated successfully', 'status' => $post->status]);
    }

    public function delete(string $id)
    {
        $post = Post::find($id);
        if ($post === null) {
            return response()->json(['message' => 'Post updated successfully', 'post' => $post]);
        }


        $post->status = 0;
        $post->updated_at = date('Y-m-d H:i:s');
        $post->updated_by = Auth::id() ?? 1;

        $post->save();
        return response()->json(['message' => 'Post moved to trash successfully']);
    }

    public function trash()
    {
        $list = Post::where('status', '=', '0')
            ->orderBy('created_at', 'desc')
            ->select('id', 'title', 'image', 'status')
            ->get();
        return response()->json($list);
    }

    public function restore(string $id)
    {
        $post = Post::find($id);
        if ($post === null) {
            return response()->json(['message' => 'Post not found'], 404);
        }
        $post->status = 2;
        $post->updated_at = date('Y-m-d H:i:s');
        $post->updated_by = Auth::id() ?? 1;

        $post->save();
        return response()->json(['message' => 'Post restored successfully']);
    }
}