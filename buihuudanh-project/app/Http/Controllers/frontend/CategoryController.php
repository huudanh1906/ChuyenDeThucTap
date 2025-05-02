<?php

namespace App\Http\Controllers\frontend;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        $list = Category::where('status', '=', '1')
            ->orderBy('created_at', 'desc')
            ->select('id', 'name', 'slug', 'image', 'status', 'sort_order')
            ->get();
    
        return response()->json($list);
    }
}