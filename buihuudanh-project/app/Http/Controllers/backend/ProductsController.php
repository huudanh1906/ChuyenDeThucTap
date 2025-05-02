<?php

namespace App\Http\Controllers\backend;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class ProductsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $list = Product::where('cdtt_product.status', '!=', '0')
            ->join('cdtt_category', 'cdtt_product.category_id', '=', 'cdtt_category.id')
            ->join('cdtt_brand', 'cdtt_product.brand_id', '=', 'cdtt_brand.id')
            ->orderBy('cdtt_product.created_at', 'desc')
            ->select('price', 'pricesale','cdtt_product.slug', 'cdtt_product.status', 'cdtt_product.id', 'cdtt_product.name', 'cdtt_product.image', 'cdtt_category.name as categoryname', 'cdtt_brand.name as brandname')
            ->get();

        // Return JSON response for API consumption
        return response()->json($list);
    }



    public function create()
    {
        $brand = Brand::where('status', '!=', '0')
            ->select('id', 'name')
            ->get();
        $category = Category::where('status', '!=', '0')
            ->select('id', 'name')
            ->get();
        $htmlbrand = '';
        $htmlcategory = '';
        foreach ($brand as $row) {
            $htmlbrand .= '<option value="' . $row->id . '">' . $row->name . '</option>';
        }
        foreach ($category as $row) {
            $htmlcategory .= '<option value="' . $row->id . '">' . $row->name . '</option>';
        }
        return response()->json([
            'htmlbrand' => $htmlbrand,
            'htmlcategory' => $htmlcategory
        ], 200);
    }


    public function store(StoreProductRequest $request)
    {
        $product = new Product();
        $product->name = $request->name;
        $product->detail = $request->detail;
        $product->description = $request->description;
        $product->category_id = $request->category_id;
        $product->brand_id = $request->brand_id;
        $product->price = $request->price;
        $product->pricesale = $request->pricesale;
        $product->status = $request->status;
        if ($request->hasFile('image')) {
            $fileName = date('YmdHis') . '.' . $request->image->extension();
            $request->image->move(public_path('imgs/products'), $fileName);
            $product->image = $fileName;
        }
        $product->slug = Str::of($request->name)->slug('-');
        $product->created_at = date('Y-m-d H:i:s');
        $product->created_by = Auth::id() ?? 1;

        $product->save();
        return response()->json(['message' => 'Product created successfully', 'product' => $product], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
$product = Product::find($id); // Ensure the model name is capitalized (Product instead of product)

        if ($product === null) {
            return response()->json(['message' => 'Product not found'], 404); // Return a JSON response with a 404 status
        }

        return response()->json($product); // Return the product as JSON
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $product = product::find($id);
        if ($product == null) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $brand = Brand::where('status', '!=', '0')
            ->select('id', 'name')
            ->get();
        $category = Category::where('status', '!=', '0')
            ->select('id', 'name')
            ->get();
        $htmlbrand = '';
        $htmlcategory = '';
        foreach ($brand as $row) {
            if ($product->brand_id== $row->id) {
                $htmlbrand .= '<option selected value="' . $row->id . '">' . $row->name . '</option>';
            } else {
                $htmlbrand .= '<option value="' . $row->id . '">' . $row->name . '</option>';
            }
        }
        foreach ($category as $row) {
            if ($product->category_id == $row->id) {
                $htmlcategory.= '<option selected value="'. $row->id. '">'. $row->name. '</option>';
            } else {
                $htmlcategory.= '<option value="'. $row->id. '">'. $row->name. '</option>';
            }
        }
        return response()->json([
            'htmlbrand' => $htmlbrand,
            'htmlcategory' => $htmlcategory,
            'product' => $product
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, string $id)
{
    $product = product::find($id);
    if ($product == null) {
        return redirect()->route('admin.product.index');
    }

    $product->name = $request->name;
    $product->detail = $request->detail;
    $product->description = $request->description;
    $product->category_id = $request->category_id;
    $product->brand_id = $request->brand_id;
    $product->price = $request->price;
    $product->pricesale = $request->pricesale;
    $product->status = $request->status;

    // Check if the image is a Base64 string
    if (strpos($request->image, 'data:image/') === 0) {
        // Extract the image type (jpeg, png, etc.) from the Base64 string
        list($type, $data) = explode(';', $request->image);
        list(, $data) = explode(',', $data);
        $data = base64_decode($data);

        // Generate a unique filename and save the image
        $extension = explode('/', $type)[1]; // e.g., 'image/png' => 'png'
        $fileName = date('YmdHis') . '.' . $extension;
        $filePath = public_path('imgs/products/' . $fileName);

        file_put_contents($filePath, $data);
$product->image = $fileName; // Save the filename to the database
    }

    $product->slug = Str::of($request->name)->slug('-');
    $product->updated_at = date('Y-m-d H:i:s');
    $product->updated_by = Auth::id() ?? 1;

    $product->save();
    return response()->json(['message' => 'Product updated successfully.', 'product' => $product], 200);
}


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product = Product::find($id);
        if ($product === null) {
            return response()->json(['message' => 'Product not found'], 404);
        }


        $product->delete();
        return response()->json(['message' => 'Product deleted successfully', 'product' => $product], 200);
    }
    public function stastus(string $id)
    {
        $product = product::find($id);
        if ($product === null) {
            return response()->json(['message' => 'Product not found'], 404);
        }
        $product->status = ($product->status == 1) ? 2 : 1;
        $product->updated_at = date('Y-m-d H:i:s');
        $product->updated_by = Auth::id() ?? 1;

        $product->save();
        return response()->json(['message' => 'Product status updated successfully', 'status' => $product->status], 200);
    }

    public function delete(string $id)
    {
        $product = Product::find($id);
        if ($product === null) {
            return response()->json(['message' => 'Product not found'], 404);
        }


        $product->status = 0;
        $product->updated_at = date('Y-m-d H:i:s');
        $product->updated_by = Auth::id() ?? 1;

        $product->save();
        return response()->json(['message' => 'Product moved to trash', 'product' => $product], 200);
    }

    public function trash()
{
    $list = Product::where('status', '=', '0')
        ->orderBy('created_at', 'desc')
        ->select('id', 'name', 'image', 'status')
        ->get();
    return response()->json($list);
}

    public function restore(string $id)
    {
        $product = Product::find($id);
        if ($product === null) {
            return response()->json(['message' => 'Product not found'], 404);
        }
        $product->status = 2;
        $product->updated_at = date('Y-m-d H:i:s');
        $product->updated_by = Auth::id() ?? 1;

        $product->save();
        return response()->json(['message' => 'Product restored successfully', 'product' => $product], 200);
    }
}