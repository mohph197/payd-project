<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class FormCreationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "name" => "required|string|max:255",
            "country_code" => "required|string|exists:countries,code",
            "fields" => "required|array",
            "fields.*.name" => "required|string|max:255",
            "fields.*.category" => "required|string|in:general,identity,bank-related",
            "fields.*.order" => "required|integer",
            "fields.*.type" => "required|string|in:text,number,email,phone,password,currency,textarea,dropdown,checkbox,radio",
            "fields.*.required" => "required|boolean",
            "fields.*.options" => "nullable|array",
            "fields.*.options.*" => "required|string",
        ];
    }

    /**
     * Get the "after" validation callables for the request.
     */
    public function after(): array
    {
        return [
            function (Validator $validator) {
                $validated_fields = $validator->validated()["fields"];
                // Verify that options are provided for dropdown, checkbox, and radio fields
                foreach ($validated_fields as $index => $field) {
                    if (
                        in_array($field["type"], ["dropdown", "checkbox", "radio"])
                        && (!isset($field["options"]) || !is_array($field["options"]) || count($field["options"]) < 2)
                    ) {
                        $validator->errors()->add("fields.$index.options", "The options field is required for {$field['type']} fields and must contain at least 2 options.");
                    }
                }

                // Verify that the order and name fields are unique
                $orders = array_map(fn($field) => $field["order"], $validated_fields);
                if (count($orders) !== count(array_unique($orders))) {
                    $validator->errors()->add("fields", "The order field must be unique.");
                }
                $names = array_map(fn($field) => $field["name"], $validated_fields);
                if (count($names) !== count(array_unique($names))) {
                    $validator->errors()->add("fields", "The name field must be unique.");
                }
            },
        ];
    }
}
