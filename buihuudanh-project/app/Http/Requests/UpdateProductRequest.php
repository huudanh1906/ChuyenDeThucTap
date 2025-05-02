<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
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
            'name' => 'required|min:3|max:255',
            'detail' => 'required',
            'price' => [
                'required',
                'min:0',
                function ($attribute, $value, $fail) {
                    if ($value <= 0) {
                        $fail($attribute . ' phải lớn hơn 0.');
                    }
                }
            ],
            'pricesale' => [
                'nullable',
                'numeric',
                function ($attribute, $value, $fail) {
                    if ($value !== null) {
                        if ($value <= 0) {
                            $fail('Giá khuyến mại phải lớn hơn 0.');
                        }
                        if ($value > $this->price) {
                            $fail('Giá khuyến mại không được lớn hơn gốc.');
                        }
                    }
                },
            ],
        ];
    }
    public function messages(): array
    {
        return [
            'name.required' => 'Tên sản phẩm không được để trống',
            'name.min' => 'Tên sản phẩm phải có ít nhất 3 ký tự',
            'name.max' => 'Tên sản phẩm không được quá 255 ký tự',
            'price.required' => 'Vui lòng nhập giá sản phẩm',
            'price.min' => 'Giá sản phẩm phải lớn hơn 0',
            'detail.required' => 'Vui lòng nhập chi tiết sản phẩm',
            'pricesale.min' => 'Giá khuyến mãi phải lớn hơn 0',
        ];
    }
}
