<?php

namespace App\Http\Controllers\frontend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;


class OrderController extends Controller
{
    // Add a new order to the database
    public function addToOrder(Request $request)
{
    \Log::info('Incoming Order Request:', $request->all());
    // Get the authenticated user
    $user = Auth::user();

    if (!$user) {
        return response()->json(['error' => 'Unauthorized'], 401);
    }


    // Validation rules
    $validator = Validator::make($request->all(), [
        'note' => 'nullable|string|max:500',
        'status' => 'integer|in:0,1'  // Assuming 0 = inactive, 1 = active
    ]);

    // Handle validation errors
    if ($validator->fails()) {
        return response()->json([
            'error' => $validator->errors()
        ], 422);
    }

    // Create a new order
    $order = new Order();
    $order->user_id = $user->id;  // Using the logged-in user's ID
    $order->name = $user->name;    // Fetching name from logged-in user
    $order->phone = $user->phone;  // Fetching phone from logged-in user
    $order->email = $user->email;  // Fetching email from logged-in user
    $order->address = $user->address; // Fetching address from logged-in user
    $order->note = $request->note;  // Optional note from the request
    $order->status = '1'; // Status from the request
    $order->created_at = now();

    // Save the order to the database
    if ($order->save()) {
        return response()->json([
            'message' => 'Order created successfully',
            'order' => $order
        ], 201);
    } else {
        return response()->json([
            'error' => 'Failed to create order'
        ], 500);
    }
}

public function index(string $id)
    {
        $list = Order::where('status', '=', '1')
            ->where('user_id', '=', $id)
            ->orderBy('created_at', 'desc')
            ->select('id', 'created_at')
            ->get();
        return response()->json($list);
    }

    public function show(string $id)
{
    $orders = DB::table('cdtt_order')
        ->where('cdtt_order.id', $id)
        ->where('cdtt_order.status', '!=', '0')
        ->join('cdtt_user', 'cdtt_user.id', '=', 'cdtt_order.user_id')
        ->join('cdtt_orderdetail', 'cdtt_orderdetail.order_id', '=', 'cdtt_order.id')
        ->join('cdtt_product', 'cdtt_product.id', '=', 'cdtt_orderdetail.product_id')
        ->select(
            'cdtt_orderdetail.price as price',
            'cdtt_orderdetail.qty as qty',
            'cdtt_product.name as product_name',
            'cdtt_product.image as product_image'
        )
        ->get();

    if ($orders === null) {
        return response()->json(['message' => 'Order not found'], 404);
    }

    // If images are stored as relative URLs, make sure to prepend the full path
$orders->transform(function ($order) {
        $order->product_image = url('http://localhost:8000/imgs/products/' . $order->product_image); // Adjust path as needed
        return $order;
    });

    return response()->json($orders);
}


}