<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBrandRequest extends FormRequest
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
        ];
    }
    public function messages(): array{
        return [
            'name.required' => 'Tên thương hiệu không được để trống',
            'name.min' => 'Tên thương hiệu phải có ít nhất 3 ký tự',
            'name.max' => 'Tên thương hiệu không được quá 255 ký tự',
        ];
    }
}
