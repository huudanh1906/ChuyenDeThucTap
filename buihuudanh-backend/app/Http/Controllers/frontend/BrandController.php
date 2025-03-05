<?php

namespace App\Http\Controllers\frontend;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use Illuminate\Http\Request;

class BrandController extends Controller
{
    public function index()
    {
        $list = Brand::where('status', '=', '1')
            ->orderBy('created_at', 'asc')
            ->select('id', 'name', 'image', 'status')
            ->get();
        $htmlsortorder = '';
        foreach ($list as $row) {
            $htmlsortorder .= '<option value="' . ($row->id + 1) . '">Sau: ' . $row->name . '</option>';
        }
        return response()->json($list);
    }
}