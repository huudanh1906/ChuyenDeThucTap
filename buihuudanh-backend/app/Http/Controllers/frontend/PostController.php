<?php

namespace App\Http\Controllers\frontend;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\Topic;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index(){
        $list_post=Post::where('status','=',1)
        ->orderBy('created_at','desc')
        ->paginate(6);
        return response()->json($list_post);
    }
    public function post_detail($slug){
        $post=Post::where([['slug', '=', $slug],['status', '=', 1]])
        ->first();
        $list_post=Post::where([['status','=',1],['topic_id','=', $post->topic_id],['slug','!=',$slug]])
        ->orderBy('created_at', 'desc')
        ->paginate(9);
        return response()->json([
                'post'=>$post,
                'list_post'=>$list_post,
        ]);

    }
    public function post_topic($slug){
        $topic_id=Topic::where('slug','=',$slug)
        ->select('id','name')
        ->first();
        $list_post=Post::where([['status','=',1],['topic_id','=',$topic_id->id]])
        ->orderBy('created_at','desc')
        ->paginate(6);
        return response()->json($list_post);
    }
    public function page_topic($slug){
        $topic_page=Post::where([['status','=',1],['slug', '=', $slug]])
        ->first();
        return response()->json($topic_page);
    }
}