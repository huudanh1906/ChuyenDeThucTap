<?php

use App\Http\Controllers\backend\BannerController;
use App\Http\Controllers\backend\BrandController;
use App\Http\Controllers\backend\CategoryController;
use App\Http\Controllers\backend\ContactController;
use App\Http\Controllers\backend\MenuController;
use App\Http\Controllers\backend\OrderController;
use App\Http\Controllers\backend\PostController;
use App\Http\Controllers\backend\ProductsController;
use App\Http\Controllers\backend\TopicController;
use App\Http\Controllers\backend\UserController;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\frontend\ContactController as FrontendContactController;
use App\Http\Controllers\frontend\PostController as FrontendPostController;
use App\Http\Controllers\frontend\ProductsController as FrontendProductsController;
use App\Http\Controllers\frontend\MenuController as FrontendMenuController;
use App\Http\Controllers\frontend\BrandController as FrontendBrandController;
use App\Http\Controllers\frontend\CategoryController as FrontendCategoryController;
use App\Http\Controllers\frontend\UserController as FrontendUserController;
use App\Http\Controllers\frontend\OrderController as FrontendOrderController;
use App\Http\Controllers\frontend\OrderDetailController as FrontendOrderDetailController;

//home
Route::get('menu', [FrontendMenuController::class, 'index']);


//Products
route::get('san-pham', [FrontendProductsController::class, 'products']);
//Products Flash-sale
Route::get('flash-sale', [FrontendProductsController::class, 'sale_products']);
//Products Best-seller
Route::get('best-seller', [FrontendProductsController::class, 'best_seller']);
//Product detail
route::get('chi-tiet-san-pham/{slug}', [FrontendProductsController::class, 'product_detail']);
//Product Category
route::get('danh-muc/{slug}', [FrontendProductsController::class, 'product_category']);
//Product Brand
route::get('thuong-hieu/{slug}', [FrontendProductsController::class, 'product_brand']);

//Product search
route::get('tim-kiem', [FrontendProductsController::class, 'product_search']);

//Contact
route::post('lien-he', [FrontendContactController::class, 'contact']);

//Brand
Route::get('brand', [FrontendBrandController::class, 'index']);
//Category
Route::get('category', [FrontendCategoryController::class, 'index']);
//order
Route::middleware('auth:sanctum')->post('/order-add', [FrontendOrderController::class, 'addToOrder']);
Route::post('order-detail', [FrontendOrderDetailController::class, 'store']);
Route::get('order/{id}', [FrontendOrderController::class, 'index']);
Route::get('order-detail/{orderId}', [FrontendOrderController::class, 'show']);
//post
route::get('bai-viet', [FrontendPostController::class, 'index']);
route::get('chi-tiet-bai-viet/{slug}', [FrontendPostController::class, 'post_detail']);
route::get('chu-de/{slug}', [FrontendPostController::class, 'post_topic']);
route::get('trang-don/{slug}', [FrontendPostController::class, 'page_topic']);

//user
route::post('login', [FrontendUserController::class, 'login']);
route::post('register', [FrontendUserController::class,'register']);
Route::middleware('auth:sanctum')->post('/logout', [FrontendUserController::class, 'logout']);
route::get('user/edit/{id}', [FrontendUserController::class, 'edit']);
route::put('user/update/{id}', [FrontendUserController::class, 'update']);



route::prefix('admin')->group(function () {
    route::post('/', [UserController::class, 'login']);

    route::prefix('product')->group(function () {
        route::get('/', [ProductsController::class, 'index']);
        route::get('trash', [ProductsController::class, 'trash']);
        route::get('create', [ProductsController::class, 'create']);
        route::post('store', [ProductsController::class, 'store']);
        route::get('edit/{id}', [ProductsController::class, 'edit']);
        route::get('restore/{id}', [ProductsController::class, 'restore']);
        route::delete('destroy/{id}', [ProductsController::class, 'destroy']);
        route::get('status/{id}', [ProductsController::class, 'stastus']);
        route::put('update/{id}', [ProductsController::class, 'update']);
        route::get('delete/{id}', [ProductsController::class, 'delete']);
        route::get('show/{id}', [ProductsController::class, 'show']);
    });
    route::prefix('category')->group(function () {
        route::get('/', [CategoryController::class, 'index']);
        route::get('trash', [CategoryController::class, 'trash']);
        route::post('store', [CategoryController::class, 'store']);
        route::get('edit/{id}', [CategoryController::class, 'edit']);
        route::get('status/{id}', [CategoryController::class, 'stastus']);
        route::put('update/{id}', [CategoryController::class, 'update']);
        route::get('delete/{id}', [CategoryController::class, 'delete']);
        route::get('restore/{id}', [CategoryController::class, 'restore']);
        route::delete('destroy/{id}', [CategoryController::class, 'destroy']);
        route::get('show/{id}', [CategoryController::class, 'show']);
    });
    route::prefix('brand')->group(function () {
        route::get('/', [BrandController::class, 'index']);
        route::get('trash', [BrandController::class, 'trash']);
        route::post('store', [BrandController::class, 'store']);
        route::get('edit/{id}', [BrandController::class, 'edit']);
        route::get('delete/{id}', [BrandController::class, 'delete']);
        route::get('restore/{id}', [BrandController::class, 'restore']);
        route::get('destroy/{id}', [BrandController::class, 'destroy']);
        route::get('status/{id}', [BrandController::class, 'stastus']);
        route::put('update/{id}', [BrandController::class, 'update']);
        route::get('show/{id}', [BrandController::class, 'show']);

    });
    route::prefix('order')->group(function () {
        route::get('/', [OrderController::class, 'index']);
        route::get('trash', [OrderController::class, 'trash']);
        route::get('create', [OrderController::class, 'create']);
        route::post('store', [OrderController::class, 'store']);
        route::get('edit/{id}', [OrderController::class, 'edit']);
        route::get('restore/{id}', [OrderController::class, 'restore']);
        route::delete('destroy/{id}', [OrderController::class, 'destroy']);
        route::get('status/{id}', [OrderController::class, 'stastus']);
        route::get('delete/{id}', [OrderController::class, 'delete']);
        route::put('update/{id}', [OrderController::class, 'update']);
        route::get('show/{id}', [OrderController::class,'show']);

    });
    route::prefix('contact')->group(function () {
        route::get('/', [ContactController::class, 'index']);
        route::get('trash', [ContactController::class, 'trash']);
        route::post('store', [ContactController::class,'store']);
        route::get('restore/{id}', [ContactController::class, 'restore']);
        route::get('destroy/{id}', [ContactController::class, 'destroy']);
        route::get('delete/{id}', [ContactController::class, 'delete']);
        route::get('show/{id}', [ContactController::class,'show']);
        route::get('status/{id}', [ContactController::class, 'stastus']);

    });
    route::prefix('menu')->group(function () {
        route::get('/', [MenuController::class, 'index']);
        route::get('trash', [MenuController::class, 'trash']);
        route::post('store', [MenuController::class, 'store']);
        route::get('edit/{id}', [MenuController::class, 'edit']);
        route::get('restore/{id}', [MenuController::class, 'restore']);
        route::delete('destroy/{id}', [MenuController::class, 'destroy']);
        route::get('status/{id}', [MenuController::class, 'stastus']);
        route::put('update/{id}', [MenuController::class, 'update']);
        route::get('delete/{id}', [MenuController::class, 'delete']);
        route::get('show/{id}', [MenuController::class,'show']);
    });
    route::prefix('banner')->group(function () {
        route::get('/', [BannerController::class, 'index']);
        route::get('trash', [BannerController::class, 'trash']);
        route::post('store', [BannerController::class, 'store']);
        route::get('edit/{id}', [BannerController::class, 'edit']);
        route::get('restore/{id}', [BannerController::class, 'restore']);
        route::get('destroy/{id}', [BannerController::class, 'destroy']);
        route::get('status/{id}', [BannerController::class, 'stastus']);
        route::put('update/{id}', [BannerController::class, 'update']);
        route::get('delete/{id}', [BannerController::class, 'delete']);
        route::get('show/{id}', [BannerController::class,'show']);
    });
    route::prefix('user')->group(function () {
        route::get('/', [UserController::class, 'index']);
        route::get('trash', [UserController::class, 'trash']);
        route::get('create', [UserController::class, 'create']);
        route::post('store', [UserController::class, 'store']);
        route::get('edit/{id}', [UserController::class, 'edit']);
        route::get('restore/{id}', [UserController::class, 'restore']);
        route::delete('destroy/{id}', [UserController::class, 'destroy']);
        route::get('status/{id}', [UserController::class, 'stastus']);
        route::put('update/{id}', [UserController::class, 'update']);
        route::get('delete/{id}', [UserController::class, 'delete']);
        route::get('show/{id}', [UserController::class,'show']);
    });
    route::prefix('topic')->group(function () {
        route::get('/', [TopicController::class, 'index']);
        route::get('trash', [TopicController::class, 'trash']);
        route::post('store', [TopicController::class, 'store']);
        route::get('edit/{id}', [TopicController::class, 'edit']);
        route::get('restore/{id}', [TopicController::class, 'restore']);
        route::delete('destroy/{id}', [TopicController::class, 'destroy']);
        route::get('status/{id}', [TopicController::class, 'stastus']);
        route::put('update/{id}', [TopicController::class, 'update']);
        route::get('delete/{id}', [TopicController::class, 'delete']);
        route::get('show/{id}', [TopicController::class,'show']);
    });
    route::prefix('post')->group(function () {
        route::get('/', [PostController::class, 'index']);
        route::get('trash', [PostController::class, 'trash']);
        route::get('create', [PostController::class, 'create']);
        route::post('store', [PostController::class, 'store']);
        route::get('edit/{id}', [PostController::class, 'edit']);
        route::get('restore/{id}', [PostController::class, 'restore']);
        route::delete('destroy/{id}', [PostController::class, 'destroy']);
        route::get('status/{id}', [PostController::class, 'stastus']);
        route::post('update/{id}', [PostController::class, 'update']);
        route::get('delete/{id}', [PostController::class, 'delete']);
        route::get('show/{id}', [PostController::class,'show']);
    });
});
