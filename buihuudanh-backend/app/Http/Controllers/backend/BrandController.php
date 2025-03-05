<?php

namespace App\Http\Controllers\backend;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBrandRequest;
use App\Http\Requests\UpdateBrandRequest;
use App\Models\Brand;
use App\Models\Product;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class BrandController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $list = Brand::where('status', '!=', '0')
            ->orderBy('created_at', 'asc')
            ->select('id', 'name', 'image', 'status')
            ->get();
        $htmlsortorder = '';
        foreach ($list as $row) {
            $htmlsortorder .= '<option value="' . ($row->id + 1) . '">Sau: ' . $row->name . '</option>';
        }
        return response()->json($list);
    }



    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBrandRequest $request)
    {
        $brand = new Brand();
        $brand->name = $request->name;
        $brand->description = $request->description;
        $brand->status = $request->status;
        $brand->sort_order = $request->sort_order;
        if ($request->hasFile('image')) {
            $fileName = date('YmdHis') . '.' . $request->image->extension();
            $request->image->move(public_path('imgs/brands'), $fileName);
            $brand->image = $fileName;
        }
        $brand->slug = Str::of($request->name)->slug('-');
        $brand->created_at = date('Y-m-d H:i:s');
        $brand->created_by = Auth::id() ?? 1;

        $brand->save();
        return response()->json(['message' => 'Brand created successfully', 'data' => $brand], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $brand = brand::find($id);
        if ($brand === null) {
            return response()->json(['message' => 'Brand not found'], 404);
        }

        return response()->json($brand);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $brand = brand::find($id);
        if ($brand === null) {
            return response()->json(['message' => 'Brand not found'], 404);
        }
        $list = brand::where('status', '!=', '0')
        ->orderBy('created_at', 'desc')
            ->select('id', 'name', 'image', 'status', 'sort_order')
            ->get();
        $htmlsortorder = '';
        foreach ($list as $row) {
            if ($brand->sort_order - 1 == $row->sort_order) {
                $htmlsortorder .= '<option selected value="' . ($row->sort_order + 1) . '">Sau: ' . $row->name . '</option>';
            } else {
                $htmlsortorder .= '<option value="' . ($row->sort_order + 1) . '">Sau: ' . $row->name . '</option>';
            }
        }
        return response()->json(['brand' => $brand, 'htmlsortorder' => $htmlsortorder, 'list' => $list], 200);
    }

    /**
* Update the specified resource in storage.
     */
    public function update(UpdateBrandRequest $request, string $id)
{
    $brand = Brand::find($id);
    if ($brand === null) {
        return response()->json(['message' => 'Brand not found'], 404);
    }

    $brand->name = $request->name;
    $brand->description = $request->description;
    $brand->slug = Str::slug($request->name); // Use Str::slug directly
    $brand->sort_order = $request->sort_order;

    // Handle image upload
if (isset($request->image) && preg_match('/^data:image\/(\w+);base64,/', $request->image, $type)) {
    $image = str_replace(['data:image/png;base64,', 'data:image/jpeg;base64,'], '', $request->image);
    $image = str_replace(' ', '+', $image);

    // Determine the extension based on the image type
    $extension = $type[1] === 'jpeg' ? 'jpg' : $type[1];
    $fileName = date('YmdHis') . '.' . $extension;

    // Save the image
    \File::put(public_path('imgs/brands/' . $fileName), base64_decode($image));
    $brand->image = $fileName;
}

    $brand->status = $request->status;
    $brand->updated_at = now(); // Use Laravel's now() helper
    $brand->updated_by = Auth::id() ?? 1;

    $brand->save();

    return response()->json(['message' => 'Brand updated successfully'], 200);
}



    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $brand = brand::find($id);
        if ($brand === null) {
            return response()->json(['message' => 'Brand not found'], 404);
        }


        $brand->delete();
        return response()->json(['message' => 'Brand deleted successfully'], 200);
    }

    public function stastus(string $id)
    {
        $brand = Brand::find($id);
        if ($brand === null) {
            return response()->json(['message' => 'Brand not found'], 404);
        }
        $brand->status = ($brand->status == 1) ? 2 : 1;
        $brand->updated_at = date('Y-m-d H:i:s');
        $brand->updated_by = Auth::id() ?? 1;

        $brand->save();
        return response()->json(['message' => 'Brand status updated successfully', 'status' => $brand->status], 200);
    }


    public function delete(string $id)
    {
        $brand = brand::find($id);
        if ($brand === null) {
            return redirect()->route('admin.brand.index');
        }

        $productsCount = Product::where('brand_id', '=', $id)->count();

        if ($productsCount > 0) {
            return response()->json(['message' => 'Cannot delete this brand as it has associated products'], 400);
        }

        $brand->status = 0;
        $brand->updated_at = date('Y-m-d H:i:s');
        $brand->updated_by = Auth::id() ?? 1;

        $brand->save();
        return response()->json(['message' => 'Brand moved to trash'], 200);
    }

    public function trash()
    {
        $list = brand::where('status', '=', '0')
            ->orderBy('created_at', 'desc')
->select('id', 'name', 'image', 'status', 'sort_order')
            ->get();
            return response()->json($list);
    }

    public function restore(string $id)
    {
        $brand = brand::find($id);
        if ($brand === null) {
            return redirect()->route('admin.brand.index');
        }
        $brand->status = 2;
        $brand->updated_at = date('Y-m-d H:i:s');
        $brand->updated_by = Auth::id() ?? 1;

        $brand->save();
        return response()->json(['message' => 'Brand restored successfully'], 200);
    }
}