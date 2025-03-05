<?php

namespace App\Http\Controllers\frontend;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    /**
     * Fetch all menu items with parent-child relationships.
     */
    public function index()
    {
        // Fetch all menu items, ordered by their parent_id and display order (optional)
        $menus = Menu::where('status','=',1)->orderBy('parent_id', 'asc')->orderBy('sort_order', 'asc')->get();

        return response()->json([
            'menus' => $menus,
        ]);
    }
}
