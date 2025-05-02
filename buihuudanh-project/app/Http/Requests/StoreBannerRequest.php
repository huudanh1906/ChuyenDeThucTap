<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBannerRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' =>'required|min:3|max:255',
            'image' =>'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'link' =>'required',
        ];
    }
    public function messages(): array{
        return [
            'name.required' => 'Vui lòng nhập tên banner',
            'name.min' => 'Tên banner phải có ít nhất 3 ký tự',
            'name.max' => 'Tên banner không được quá 255 ký tự',
            'image.required' => 'Vui lòng chọn ảnh banner',
            'image.image' => 'Vui lòng chọn ảnh banner',
            'image.mimes' => 'Vui lòng chọn ảnh banner',
            'image.max' => 'Vui lòng chọn ảnh banner có dung lượng nhỏ hơn 2MB',
            'link.required' => 'Vui thêm link của banner',
        ];
    }
}
