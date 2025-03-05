<?php

namespace App\Http\Controllers\frontend;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductsController extends Controller
{
    public function products(Request $request)
{
    // Initialize the query builder
    $query = Product::where('status', '=', 1);

    // Check for category filter
    if ($request->has('category') && !empty($request->category)) {
        $category = Category::where('slug', $request->category)->first();
        if ($category) {
            $query->where('category_id', $category->id);
        }
    }

    // Check for brand filter
    if ($request->has('brand') && !empty($request->brand)) {
        $brand = Brand::where('slug', $request->brand)->first();
        if ($brand) {
            $query->where('brand_id', $brand->id);
        }
    }

    // Check for price range filter
    if ($request->has('price_range') && !empty($request->price_range)) {
        $priceRange = explode('-', $request->price_range);
        if (count($priceRange) === 2) {
            $min = (float) trim($priceRange[0]);
            $max = (float) trim($priceRange[1]);
            if ($min >= 0 && $max >= $min) {
                $query->where(function ($q) use ($min, $max) {
                    $q->where(function ($subQuery) use ($min, $max) {
                        $subQuery->whereNotNull('pricesale')
                            ->whereBetween('pricesale', [$min, $max]);
                    })->orWhere(function ($subQuery) use ($min, $max) {
                        $subQuery->whereNull('pricesale')
                            ->whereBetween('price', [$min, $max]);
                    });
                });
            }
        }
    }

    // Promotion filter
    if ($request->has('on_promotion') && $request->on_promotion) {
        $query->whereNotNull('pricesale');
    }

    // Sorting logic, including new case for best_seller
    switch ($request->input('sort_order')) {
        case 'high_to_low':
            $query->orderByRaw('COALESCE(pricesale, price) DESC');
            break;
        case 'low_to_high':
            $query->orderByRaw('COALESCE(pricesale, price) ASC');
            break;
        case 'best_seller':
                // Fetch products with the highest quantity sold
                $bestSellers = \DB::table('cdtt_orderdetail')
                    ->select('product_id', \DB::raw('SUM(qty) as total_qty'))
                    ->groupBy('product_id')
                    ->orderByDesc('total_qty')
                    ->pluck('product_id')
                    ->toArray(); // Convert to array

                if (!empty($bestSellers)) {
                    $idsString = implode(',', $bestSellers);
                    $query->whereIn('id', $bestSellers)
                          ->orderByRaw("FIELD(id, $idsString)");
                } else {
                    // In case there are no best sellers, fallback to default order
                    $query->orderBy('created_at', 'desc');
                }
                break;
        default:
            $query->orderBy('created_at', 'desc'); // Newest products first
            break;
    }

    // Paginate the results
    $products = $query->paginate(20);

    return response()->json($products);
}


    //////////////////////////////////////////////////////////////////////////////////////
    //SALE-PRODUCT


    // New method to fetch sale products
    public function sale_products()
    {
        $products = Product::where('status', '=', 1)
            ->whereNotNull('pricesale') // Assuming pricesale indicates a sale product
            ->orderBy('created_at', 'desc')
            ->paginate(20);
return response()->json($products);
    }

    //////////////////////////////////////////////////////////////////////////////////////
    //BEST-SELLER

    public function best_seller(Request $request)
{
    // Fetch the products with the highest quantity sold
    $bestSellers = \DB::table('cdtt_orderdetail')
        ->select('product_id', \DB::raw('SUM(qty) as total_qty'))
        ->groupBy('product_id')
        ->orderByDesc('total_qty')
        ->limit(8)  // Limit to top 8 best sellers
        ->get();

    // Get product details for the best-selling products
    $bestSellingProducts = Product::whereIn('id', $bestSellers->pluck('product_id'))
        ->get();

    // Prepare the response
    $bestSellingProducts = $bestSellingProducts->map(function ($product) use ($bestSellers) {
        // Find the corresponding total quantity for the product
        $totalQty = $bestSellers->firstWhere('product_id', $product->id)->total_qty;
        return [
            'product' => $product,
            'total_qty_sold' => $totalQty
        ];
    });

    return response()->json($bestSellingProducts);
}


    //////////////////////////////////////////////////////////////////////////////////////
    //PRODUCT_CATEGORY
    public function product_category(Request $request , $slug){
        $category = Category::where('slug', '=', $slug)->first();
        // Initialize the query builder
        $query = Product::where([['status','=',1],['category_id','=', $category->id]]);
        // Check for price range filter
if ($request->has('price_range') && !empty($request->price_range)) {
    $priceRange = explode('-', $request->price_range);

    if (count($priceRange) === 2) {
        $min = (float) trim($priceRange[0]);
        $max = (float) trim($priceRange[1]);

        if ($min >= 0 && $max >= $min) {
            // Use pricesale if it's not null, otherwise fallback to price
            $query->where(function ($q) use ($min, $max) {
                $q->where(function ($subQuery) use ($min, $max) {
                    $subQuery->whereNotNull('pricesale')
                        ->whereBetween('pricesale', [$min, $max]);
                })->orWhere(function ($subQuery) use ($min, $max) {
                    $subQuery->whereNull('pricesale')
                        ->whereBetween('price', [$min, $max]);
                });
            });
        }
    }
}
        // Promotion filter
        if ($request->has('on_promotion') && $request->on_promotion) {
            $query->whereNotNull('pricesale');
        }

        // Sorting logic
    switch ($request->input('sort_order')) {
        case 'high_to_low':
            $query->orderByRaw('COALESCE(pricesale, price) DESC');
            break;
        case 'low_to_high':
            $query->orderByRaw('COALESCE(pricesale, price) ASC');
            break;
        case 'best_seller':
                // Fetch products with the highest quantity sold
                $bestSellers = \DB::table('cdtt_orderdetail')
                    ->select('product_id', \DB::raw('SUM(qty) as total_qty'))
                    ->groupBy('product_id')
                    ->orderByDesc('total_qty')
                    ->pluck('product_id')
                    ->toArray(); // Convert to array

                if (!empty($bestSellers)) {
                    $idsString = implode(',', $bestSellers);
                    $query->whereIn('id', $bestSellers)
                          ->orderByRaw("FIELD(id, $idsString)");
                } else {
                    // In case there are no best sellers, fallback to default order
                    $query->orderBy('created_at', 'desc');
                }
                break;
        default:
            $query->orderBy('created_at', 'desc'); // Newest products first
            break;
    }

        // Order by created_at and paginate
        $products = $query->orderBy('created_at', 'desc')->paginate(20);
        return response()->json($products);
    }

    //////////////////////////////////////////////////////////////////////////////////////
    //PRODUCT_BRAND
    public function product_brand(Request $request , $slug){
        $brand = Brand::where('slug', '=', $slug)->first();

        // Initialize the query builder
        $query = Product::where([['status','=',1],['brand_id','=', $brand->id]]);

        // Check for price range filter
if ($request->has('price_range') && !empty($request->price_range)) {
    $priceRange = explode('-', $request->price_range);

    if (count($priceRange) === 2) {
        $min = (float) trim($priceRange[0]);
        $max = (float) trim($priceRange[1]);

        if ($min >= 0 && $max >= $min) {
            // Use pricesale if it's not null, otherwise fallback to price
            $query->where(function ($q) use ($min, $max) {
                $q->where(function ($subQuery) use ($min, $max) {
                    $subQuery->whereNotNull('pricesale')
->whereBetween('pricesale', [$min, $max]);
                })->orWhere(function ($subQuery) use ($min, $max) {
                    $subQuery->whereNull('pricesale')
                        ->whereBetween('price', [$min, $max]);
                });
            });
        }
    }
}
        // Promotion filter
        if ($request->has('on_promotion') && $request->on_promotion) {
            $query->whereNotNull('pricesale');
        }

        // Sorting logic
    switch ($request->input('sort_order')) {
        case 'high_to_low':
            $query->orderByRaw('COALESCE(pricesale, price) DESC');
            break;
        case 'low_to_high':
            $query->orderByRaw('COALESCE(pricesale, price) ASC');
            break;
        case 'best_seller':
                // Fetch products with the highest quantity sold
                $bestSellers = \DB::table('cdtt_orderdetail')
                    ->select('product_id', \DB::raw('SUM(qty) as total_qty'))
                    ->groupBy('product_id')
                    ->orderByDesc('total_qty')
                    ->pluck('product_id')
                    ->toArray(); // Convert to array

                if (!empty($bestSellers)) {
                    $idsString = implode(',', $bestSellers);
                    $query->whereIn('id', $bestSellers)
                          ->orderByRaw("FIELD(id, $idsString)");
                } else {
                    // In case there are no best sellers, fallback to default order
                    $query->orderBy('created_at', 'desc');
                }
                break;
        default:
            $query->orderBy('created_at', 'desc'); // Newest products first
            break;
    }

        // Order by created_at and paginate
        $products = $query->orderBy('created_at', 'desc')->paginate(20);
        return response()->json($products);
    }

    public function product_detail($slug)
{
    $product = Product::where([['slug', '=', $slug], ['status', '=', 1]])->first();

    if (!$product) {
        return response()->json(['message' => 'Product not found'], 404);
    }

    $listproduct = Product::where([['status', '=', 1], ['category_id', '=', $product->category_id], ['slug', '!=', $slug]])
        ->orderBy('created_at', 'desc')
        ->paginate(12);

    return response()->json([
        'product' => $product,
        'listproduct' => $listproduct,
    ]);
}

    public function product_search(Request $request)
    {

        $query = $request->input('search');
        $products = Product::where('name', 'LIKE', "%$query%")
        ->paginate(20);
        return response()->json($products);
    }
}
