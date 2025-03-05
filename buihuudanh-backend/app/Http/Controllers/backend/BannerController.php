<?php

namespace App\Http\Controllers\backend;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBannerRequest;
use App\Http\Requests\UpdateBannerRequest;
use App\Models\Banner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BannerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $list = Banner::where('status', '!=', '0')
            ->orderBy('created_at', 'desc')
            ->select('id', 'name', 'image', 'position', 'status')
            ->get();
        $position = '';
        foreach ($list as $row) {
            $position .= '<option value="' . $row->position . '">' . $row->position . '</option>';
        }
        return response()->json($list);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBannerRequest $request)
    {
        $banner = new Banner();
        $banner->name = $request->name;
        $banner->position = $request->position;
        $banner->link = $request->link;
        $banner->status = $request->status;
        $banner->description = $request->description;
        if ($request->hasFile('image')) {
            $fileName = date('YmdHis') . '.' . $request->image->extension();
            $request->image->move(public_path('imgs/banners'), $fileName);
            $banner->image = $fileName;
        }
        $banner->created_at = date('Y-m-d H:i:s');
        $banner->created_by = Auth::id() ?? 1;

        $banner->save();
        return response()->json(['message' => 'Banner created successfully']);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $banner = Banner::find($id);
        if ($banner === null) {
            return response()->json(['error' => 'Banner not found']);
        }

        return response()->json($banner);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
{
    $banner = Banner::find($id);
    if ($banner === null) {
        return response()->json(['error' => 'Banner not found'], 404);
    }

    $list = Banner::where('status', '!=', '0')
        ->orderBy('created_at', 'desc')
        ->select('id', 'name', 'image', 'position', 'status')
        ->get();

    $position = '';
    foreach ($list as $row) {
        if ($banner->position == $row->position) {
            $position .= '<option selected value="' . $row->position . '">' . $row->position . '</option>';
        } else {
            $position .= '<option value="' . $row->position . '">' . $row->position . '</option>';
        }
    }

    return response()->json(['banner' => $banner, 'position' => $position], 200);
}


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBannerRequest $request, string $id)
{
    $banner = Banner::find($id);
    if ($banner === null) {
        return response()->json(['error' => 'Banner not found'], 404);
    }

    $banner->name = $request->name;
    $banner->position = $request->position;
    $banner->link = $request->link;
    $banner->status = $request->status;
    $banner->description = $request->description;

    // Handle base64-encoded image
    if ($request->imageBase64) {
        $imageData = $request->imageBase64;
        $image_parts = explode(";base64,", $imageData);
        $image_type_aux = explode("image/", $image_parts[0]);
        $image_type = $image_type_aux[1];
        $image_base64 = base64_decode($image_parts[1]);
        $fileName = date('YmdHis') . '.' . $image_type;
        file_put_contents(public_path('imgs/banners/') . $fileName, $image_base64);
        $banner->image = $fileName;
    }

    $banner->updated_at = now();
    $banner->updated_by = Auth::id() ?? 1;

    $banner->save();

    return response()->json(['message' => 'Banner updated successfully']);
}

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $banner = Banner::find($id);
        if ($banner === null) {
            return response()->json(['error' => 'Banner not found']);
        }


        $banner->delete();
        return response()->json(['message' => 'Banner detroyed successfully']);
    }

    public function stastus(string $id)
    {
        $banner = Banner::find($id);
        if ($banner === null) {
            return response()->json(['error' => 'Banner not found']);
        }
        $banner->status = ($banner->status == 1) ? 2 : 1;
        $banner->updated_at = date('Y-m-d H:i:s');
        $banner->updated_by = Auth::id() ?? 1;

        $banner->save();
        return response()->json(['message' => 'Banner status changed successfully']);
    }

    public function delete(string $id)
    {
        $banner = Banner::find($id);
        if ($banner === null) {
            return response()->json(['error' => 'Banner not found']);
        }


        $banner->status = 0;
        $banner->updated_at = date('Y-m-d H:i:s');
        $banner->updated_by = Auth::id() ?? 1;

        $banner->save();
        return response()->json(['message' => 'Banner delete successfully']);
    }

    public function trash()
    {
        $list = Banner::where('status', '=', '0')
            ->orderBy('created_at', 'desc')
            ->select('id', 'name', 'image', 'status')
            ->get();
            return response()->json($list);
    }

    public function restore(string $id)
    {
        $banner = Banner::find($id);
        if ($banner === null) {
            return response()->json(['error' => 'Banner not found']);        }
        $banner->status = 2;
        $banner->updated_at = date('Y-m-d H:i:s');
        $banner->updated_by = Auth::id() ?? 1;

        $banner->save();
        return response()->json(['message' => 'Banner restored successfully']);

    }
}
