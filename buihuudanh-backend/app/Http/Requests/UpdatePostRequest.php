<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePostRequest extends FormRequest
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
            'title' =>'required|min:3|max:255',
        ];
    }
    public function messages(): array{
        return [
            'title.required' => 'Tiêu đề không được để trống',
            'title.min' => 'Tiêu đề phải có ít nhất 3 ký tự',
            'title.max' => 'Tiêu đề không được vượt quá 255 ký tự',
        ];
    }
}

