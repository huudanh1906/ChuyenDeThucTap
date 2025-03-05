<?php

namespace App\Http\Controllers\backend;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;



class CategoryController extends Controller
{
    public function index()
{
    $list = Category::where('status', '!=', '0')
        ->orderBy('created_at', 'desc')
        ->select('id', 'name', 'slug', 'image', 'status', 'sort_order')
        ->get();

    return response()->json($list);
}



    public function store(StoreCategoryRequest $request)
    {
        $category = new Category();
        $category->name = $request->name;
        $category->description = $request->description;
        $category->slug = Str::of($request->name)->slug('-');
        $category->parent_id = $request->parent_id;
        $category->sort_order = $request->sort_order;
        if ($request->hasFile('image')) {
            $exten = $request->image->extension();
            if (in_array($exten, array('jpg', 'jpeg', 'gif', 'png', 'webp'))) {
                $fileName = date('YmdHis') . '.' . $exten;
                $request->image->move(public_path('imgs/categorys'), $fileName);
                $category->image = $fileName;
            }
        }
        $category->status = $request->status;
        $category->created_at = date('Y-m-d H:i:s');
        $category->created_by = Auth::id() ?? 1;

        $category->save();
        return response()->json(['message' => 'Category created successfully.', 'category' => $category], 201);
    }

    public function trash()
    {
        $list = Category::where('status', '=', '0')
            ->orderBy('created_at', 'desc')
            ->select('id', 'name', 'image', 'status', 'sort_order')
            ->get();
            return response()->json($list);
    }


    public function show(string $id)
    {
        $category = Category::find($id);
        if ($category === null) {
            return response()->json(['message' => 'Category not found'], 404);;
        }

        return response()->json($category);
    }


    public function edit(string $id)
{
    $category = Category::find($id);
    if ($category === null) {
        return response()->json(['message' => 'Category not found'], 404);
    }

    $list = Category::where('status', '!=', '0')
        ->orderBy('created_at', 'desc')
        ->select('id', 'name', 'image', 'status', 'sort_order')
        ->get();

    // Return the category data and the list as JSON
    return response()->json([
        'category' => $category,
        'parentCategories' => $list,  // Return the category list
    ]);
}



public function update(UpdateCategoryRequest $request, string $id)
{
    $category = Category::find($id);
    if ($category === null) {
        return response()->json(['message' => 'Category not found'], 404);
    }

    $category->name = $request->name;
$category->description = $request->description;
    $category->slug = Str::of($request->name)->slug('-');
    $category->parent_id = $request->parent_id;
    $category->sort_order = $request->sort_order;

    // Handle base64 image
    if ($request->image) {
        // Remove the data URL part if present
        $imageData = preg_replace('/^data:image\/\w+;base64,/', '', $request->image);
        $imageData = base64_decode($imageData);
        $fileName = date('YmdHis') . '.png'; // or any extension you want to use
        $filePath = public_path('imgs/categorys/' . $fileName);

        // Save the image
        file_put_contents($filePath, $imageData);
        $category->image = $fileName; // Store the filename
    }

    $category->status = $request->status;
    $category->updated_at = now(); // Use Laravel's now() helper
    $category->updated_by = Auth::id() ?? 1;

    $category->save();
    return response()->json(['message' => 'Category updated successfully.', 'category' => $category], 200);
}


    public function destroy(string $id)
    {
        $category = Category::find($id);
        if ($category === null) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        $category->delete();
        return response()->json($category);
    }

    public function stastus(string $id)
    {
        $category = Category::find($id);
        if ($category === null) {
            return response()->json(['message' => 'Category not found'], 404);
        }
        $category->status = ($category->status == 1) ? 2 : 1;
        $category->updated_at = date('Y-m-d H:i:s');
        $category->updated_by = Auth::id() ?? 1;

        $category->save();
        return response()->json(['message' => 'Category status updated successfully.', 'category' => $category]);
    }

    public function delete(string $id)
    {
        $category = Category::find($id);
        if ($category === null) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        $productsCount = Product::where('category_id', '=', $id)->count();

        if ($productsCount > 0) {
            return response()->json(['message' => 'Cannot delete this category as it has associated products'], 400);
        }

        $category->status = 0;
        $category->updated_at = date('Y-m-d H:i:s');
        $category->updated_by = Auth::id() ?? 1;

        $category->save();
        return response()->json(['message' => 'Category moved to trash successfully.', 'category' => $category]);
    }

    public function restore(string $id)
    {
        $category = Category::find($id);
        if ($category === null) {
            return response()->json(['message' => 'Category not found'], 404);
        }
        $category->status = 2;
        $category->updated_at = date('Y-m-d H:i:s');
        $category->updated_by = Auth::id() ?? 1;

        $category->save();
return response()->json(['message' => 'Category restored successfully.', 'category' => $category]);
    }
}