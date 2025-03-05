<?php

namespace App\Http\Controllers\backend;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $list = Order::where('cdtt_order.status', '!=', '0')
            ->join('cdtt_user', 'cdtt_user.id', '=', 'cdtt_order.user_id')
            ->orderBy('cdtt_order.created_at', 'desc')
            ->select('cdtt_order.id', 'cdtt_user.name as username', 'cdtt_order.created_at', 'cdtt_order.status')
            ->get();
        return response()->json($list);
    }

    public function show(string $id)
    {
        $orders =
            DB::table('cdtt_order')
            ->where('cdtt_order.id', $id)
            ->where('cdtt_order.status', '!=', '0')
            ->join('cdtt_user', 'cdtt_user.id', '=', 'cdtt_order.user_id')
            ->join('cdtt_orderdetail', 'cdtt_orderdetail.order_id', '=', 'cdtt_order.id')
            ->join('cdtt_product', 'cdtt_product.id', '=', 'cdtt_orderdetail.product_id')
            ->select(
                'cdtt_order.id',
                'cdtt_user.name as username',
                'cdtt_order.created_at',
                'cdtt_order.status',
                'cdtt_orderdetail.price as price',
                'cdtt_orderdetail.qty as qty',
                'cdtt_product.name as product_name'
            )
            ->get();


        if ($orders === null) {
            return response()->json(['message' => 'Order not found'], 404);
        }
        return response()->json($orders);
    }

    public function stastus(string $id)
    {
        $order = Order::find($id);
        if ($order === null) {
            return response()->json(['message' => 'Order not found'], 404);
        }
        $order->status = ($order->status == 1) ? 2 : 1;
        $order->updated_at = date('Y-m-d H:i:s');
        $order->updated_by = Auth::id() ?? 1;

        $order->save();
        return response()->json(['message' => 'Order status updated successfully']);
    }


    public function delete(string $id)
    {
        $order = Order::find($id);
        if ($order === null) {
            return response()->json(['message' => 'Order not found'], 404);
        }


        $order->status = 0;
        $order->updated_at = date('Y-m-d H:i:s');
        $order->updated_by = Auth::id() ?? 1;

        $order->save();
        return response()->json(['message' => 'Order moved to trash']);
    }

    public function trash()
    {
        $list = Order::where('cdtt_order.status', '=', '0')
            ->join('cdtt_user', 'cdtt_user.id', '=', 'cdtt_order.user_id')
            ->orderBy('cdtt_order.created_at', 'desc')
            ->select('cdtt_order.id', 'cdtt_user.name as username', 'cdtt_order.created_at', 'cdtt_order.status')
            ->get();
        return response()->json($list);
    }
public function restore(string $id)
    {
        $order = Order::find($id);
        if ($order === null) {
            return response()->json(['message' => 'Order not found'], 404);
        }
        $order->status = 2;
        $order->updated_at = date('Y-m-d H:i:s');
        $order->updated_by = Auth::id() ?? 1;

        $order->save();
        return response()->json(['message' => 'Order restored successfully']);
    }

    public function destroy(string $id)
{
    // Check if the order exists
    $order = DB::table('cdtt_order')
        ->where('id', $id)
        ->where('status', '=', '0')
        ->first();

    if ($order === null) {
        return response()->json(['message' => 'Order not found'], 404);
    }

    // Delete associated order details
    DB::table('cdtt_orderdetail')->where('order_id', $id)->delete();

    // Delete the order itself
    DB::table('cdtt_order')->where('id', $id)->delete();

    return response()->json(['message' => 'Order and its details permanently deleted successfully']);
}


}