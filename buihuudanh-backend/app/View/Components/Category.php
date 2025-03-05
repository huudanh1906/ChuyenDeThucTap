<?php

namespace App\View\Components;

use App\Models\Category as ModelsCategory;
use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class Category extends Component
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
        $list_category=ModelsCategory::where('status','=',1)
        ->orderBy('created_at','desc')
        ->limit(8)
        ->get();
        return view('components.category', compact('list_category'));
    }
}
