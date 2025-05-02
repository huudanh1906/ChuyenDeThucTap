<?php

namespace App\View\Components;

use App\Models\Post as ModelsPost;
use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class PostNew extends Component
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
        $args_post = [
            ['status', '=', 1],
            ['type', '=', 'post']
        ];
        $list_post = ModelsPost::where($args_post)
        ->orderBy('created_at','desc')
        ->limit(3)
        ->get();
        return view('components.post-new',compact('list_post'));
    }
}
