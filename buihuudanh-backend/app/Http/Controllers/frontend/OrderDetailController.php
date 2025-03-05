<?php

namespace App\Http\Controllers\frontend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\OrderDetail; // Make sure to create this model
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class OrderDetailController extends Controller
{
    // Add a new order detail to the database
    public function store(Request $request)
{
    try {
        $validatedData = $request->validate([
            'order_id' => 'required|exists:cdtt_order,id',
            'product_id' => 'required|exists:cdtt_product,id',
            'price' => 'required|numeric',
            'qty' => 'required|integer',
            'discount' => 'nullable|numeric',
            'amount' => 'required|numeric',
        ]);

        $orderDetail = OrderDetail::create($validatedData);

        return response()->json($orderDetail, 201);
    } catch (\Exception $e) {
        return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
    }
}



}