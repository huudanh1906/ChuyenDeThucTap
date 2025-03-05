<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreContactRequest extends FormRequest
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
            'name' =>'required|string|min:3|max:255',
            'email' =>'required|email|max:255',
            'phone' => ['required', 'regex:/^([0-9\s\-\+\(\)]*)$/', 'min:10'],
            'title'=>'required|min:10',
            'content' =>'required|min:10',
        ];
    }
    public function messages(): array{
        return [
            'name.required' => 'Vui lòng nhập tên người liên hệ',
            'name.string' => 'Tên người liên hệ phải là kiểu chuỗi',
            'name.min' => 'Tên người liên hệ phải có ít nhất 3 ký tự',
            'name.max' => 'Tên người liên hệ không được quá 255 ký tự',
            'email.required' => 'Vui lòng nhập email',
            'email.email' => 'Email không đúng định dạng',
            'email.max' => 'Email không được quá 255 ký tự',
            'phone.required' => 'Vui lòng nhập số điện thoại',
            'phone.regex' => 'Số điện thoại không hợp lệ',
            'phone.min' => 'Số điện thoại phải có ít nhất 10 kí tự',
            'title.string' => 'Tiêu đề phải là kiểu chuỗi',
            'title.min' => 'Tiêu đề phải có ít nhất 10 ký tự',
            'content.required' => 'Vui lòng nhập nội dung',
            'content.min' => 'Nội dung phải có ít nhất 10 ký tự',
        ];
    }
}
