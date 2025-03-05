<?php

namespace App\Http\Controllers\backend;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Menu;
use App\Models\Post;
use App\Models\Topic;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MenuController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $list = Menu::where('status', '!=', '0')
            ->orderBy('created_at', 'desc')
            ->select('id', 'name', 'type', 'position', 'status')
            ->get();

        $list_category = Category::where('status', '!=', '0')
            ->orderBy('created_at', 'desc')
            ->select('id', 'name')
            ->get();

        $list_brand = Brand::where('status', '!=', '0')
            ->orderBy('created_at', 'desc')
            ->select('id', 'name')
            ->get();

        $list_topic = Topic::where('status', '!=', '0')
            ->orderBy('created_at', 'desc')
            ->select('id', 'name')
            ->get();

        $list_page = Post::where([['status', '!=', '0'], ['type', '=', 'page']])
            ->orderBy('created_at', 'desc')
            ->select('id', 'title')
            ->get();

        // Return a JSON response instead of a view
        return response()->json([
            'menus' => $list,
            'categories' => $list_category,
            'brands' => $list_brand,
            'topics' => $list_topic,
            'pages' => $list_page,
        ]);
    }



    public function store(Request $request)
{
    // Handle category creation
    if (isset($request->createCategory) && $request->createCategory) {
        $categoryIdList = $request->categoryid;

        if ($categoryIdList && is_array($categoryIdList)) {
            foreach ($categoryIdList as $id) {
                $category = Category::find($id); // Assuming Category model exists
                if ($category) {
                    $menu = new Menu();
                    $menu->name = $category->name;
                    $menu->link = 'danh-muc/' . $category->slug; // Ensure slug is formatted correctly
                    $menu->sort_order = 0;
                    $menu->parent_id = 85;
                    $menu->type = 'category';
                    $menu->position = $request->position;
                    $menu->table_id = $id;
                    $menu->created_at = now();
                    $menu->created_by = Auth::id() ?? 1;
                    $menu->status = $request->status;
                    $menu->save();
                }
            }
            return response()->json(['success' => true, 'message' => 'Categories created successfully']);
        }
    }

    // Handle brand creation
    if (isset($request->createBrand) && $request->createBrand) {
        $listid = $request->brandid;

        if ($listid && is_array($listid)) {
            foreach ($listid as $id) {
                $brand = Brand::find($id);
if ($brand) {
                    $menu = new Menu();
                    $menu->name = $brand->name;
                    $menu->link = 'thuong-hieu/' . $brand->slug; // Ensure slug is formatted correctly
                    $menu->sort_order = 0;
                    $menu->parent_id = 100;
                    $menu->type = 'brand';
                    $menu->position = $request->position;
                    $menu->table_id = $id;
                    $menu->created_at = now();
                    $menu->created_by = Auth::id() ?? 1;
                    $menu->status = $request->status;
                    $menu->save();
                }
            }
            return response()->json(['success' => true, 'message' => 'Brands created successfully']);
        }
    }

    // Handle topic creation
    if (isset($request->createTopic) && $request->createTopic) {
        $topicIdList = $request->topicid;

        if ($topicIdList && is_array($topicIdList)) {
            foreach ($topicIdList as $id) {
                $topic = Topic::find($id); // Assuming Topic model exists
                if ($topic) {
                    $menu = new Menu();
                    $menu->name = $topic->name;
                    $menu->link = 'chu-de/' . $topic->slug; // Ensure slug is formatted correctly
                    $menu->sort_order = 0;
                    $menu->parent_id = 109;
                    $menu->type = 'topic';
                    $menu->position = $request->position;
                    $menu->table_id = $id;
                    $menu->created_at = now();
                    $menu->created_by = Auth::id() ?? 1;
                    $menu->status = $request->status;
                    $menu->save();
                }
            }
            return response()->json(['success' => true, 'message' => 'Topics created successfully']);
        }
    }

    // Handle page creation
    if (isset($request->createPage) && $request->createPage) {
        $pageIdList = $request->pageid;

        if ($pageIdList && is_array($pageIdList)) {
            foreach ($pageIdList as $id) {
                $page = Page::find($id); // Assuming Page model exists
                if ($page) {
                    $menu = new Menu();
                    $menu->name = $page->title; // Assuming the Page model has a title attribute
                    $menu->link = 'trang/' . $page->slug; // Ensure slug is formatted correctly
                    $menu->sort_order = 0;
                    $menu->parent_id = 0;
                    $menu->type = 'page';
                    $menu->position = $request->position;
                    $menu->table_id = $id;
                    $menu->created_at = now();
                    $menu->created_by = Auth::id() ?? 1;
                    $menu->status = $request->status;
                    $menu->save();
                }
            }
            return response()->json(['success' => true, 'message' => 'Pages created successfully']);
        }
}

    // Handle custom menu item creation
    if (isset($request->createCustom) && !empty($request->createCustom)) {
        $menu = new Menu();
        $menu->name = $request->name;
        $menu->link = $request->link;
        $menu->sort_order = 0;
        $menu->parent_id = 0;
        $menu->type = 'custom';
        $menu->position = $request->position;
        $menu->table_id = null; // Custom menus typically don't have a table ID
        $menu->created_at = now();
        $menu->created_by = Auth::id() ?? 1;
        $menu->status = $request->status;
        $menu->save();

        return response()->json(['success' => true, 'message' => 'Custom menu item created successfully']);
    }

    // If none of the conditions matched, return a default error message
    return response()->json(['success' => false, 'message' => 'No valid action provided'], 400);
}


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $menu = Menu::find($id);
        if ($menu === null) {
            return response()->json(['message' => 'Menu not found'], 404);
        }

        return response()->json($menu);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $menu = Menu::find($id);
        if ($menu === null) {
            return response()->json(['message' => 'Menu not found'], 404);
        }


        $menu->delete();
        return response()->json($menu);
    }

    public function stastus(string $id)
    {
        $menu = Menu::find($id);
        if ($menu === null) {
            return response()->json(['message' => 'Menu not found'], 404);
        }
        $menu->status = ($menu->status == 1) ? 2 : 1;
        $menu->updated_at = date('Y-m-d H:i:s');
        $menu->updated_by = Auth::id() ?? 1;

        $menu->save();
        return response()->json(['message' => 'Menu status updated successfully']);
    }

    public function delete(string $id)
    {
        $menu = Menu::find($id);
        if ($menu === null) {
            return response()->json(['message' => 'Menu not found'], 404);
        }


        $menu->status = 0;
        $menu->updated_at = date('Y-m-d H:i:s');
        $menu->updated_by = Auth::id() ?? 1;

        $menu->save();
        return response()->json(['message' => 'Menu moved to trash']);
    }

    public function trash()
    {
        $list = Menu::where('status', '=', '0')
            ->orderBy('created_at', 'desc')
            ->select('id', 'name', 'status')
            ->get();
        return response()->json($list);
    }

    public function restore(string $id)
    {
        $menu = Menu::find($id);
if ($menu === null) {
            return response()->json(['message' => 'Menu not found'], 404);
        }
        $menu->status = 2;
        $menu->updated_at = date('Y-m-d H:i:s');
        $menu->updated_by = Auth::id() ?? 1;

        $menu->save();
        return response()->json(['message' => 'Menu restored successfully']);
    }
}
