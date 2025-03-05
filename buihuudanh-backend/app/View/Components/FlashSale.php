<?php

namespace App\View\Components;

use App\Models\Product;
use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class FlashSale extends Component
{
    /**
     * Create a new component instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Get the view / contents that represent the component.
     */
    public function render(): View|Closure|string
    {
        $args_product = [
            ['status', '=', 1],
            ['pricesale','!=','null']
        ];
        $poduct_sale = Product::where($args_product)
        ->orderBy('created_at', 'desc')
        ->limit(10)
        ->get();
        return view('components.flash-sale',compact('poduct_sale'));
    }
}
