<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class FormUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->id === $this->form->user_id;
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
            "fields.*.id" => "nullable|integer|exists:fields,id",
            "fields.*.name" => "required|string|max:255",
            "fields.*.category" => "required|string|in:general,identity,bank-related",
            "fields.*.order" => "required|integer",
            "fields.*.type" => "required|string|in:text,number,email,phone,password,currency,textarea,dropdown,checkbox,radio",
            "fields.*.required" => "required|boolean",
            "fields.*.options" => "nullable|array",
            "fields.*.options.*" => "required|string",
            "removed_fields" => "nullable|array",
            "removed_fields.*" => "required|integer|exists:fields,id",
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

                // Verify that new types are compatible with old values
                $fields = $this->form->fields;
                foreach ($fields as $field) {
                    $new_field = collect($validated_fields)->firstWhere('id', $field->id);
                    if (!$new_field) {
                        continue;
                    }

                    // Don't allow conversion to required if not all values are filled
                    if (!$field->required && $new_field['required']) {
                        foreach ($field->submissions as $submission) {
                            $value = json_decode($submission->pivot->value);
                            if (is_null($value) || (is_array($value) && count($value) === 0)) {
                                $validator->errors()->add(strval($field->id), 'Cannot change field to required.');
                                break;
                            }
                        }
                    }

                    $illegal_type_conversion = false;
                    // Don't allow conversion from option to non-option field or vice versa
                    $types_with_options = ["dropdown", "checkbox", "radio"];
                    if (in_array($field->type, $types_with_options) !== in_array($new_field['type'], $types_with_options)) {
                        $illegal_type_conversion = true;
                    }

                    // Don't allow conversion from text to number field if there are non-numeric values
                    if ($field->type === 'text' && in_array($new_field['type'], ['number', 'currency'])) {
                        foreach ($field->submissions as $submission) {
                            $value = json_decode($submission->pivot->value);
                            if (!is_numeric($value)) {
                                $illegal_type_conversion = true;
                                break;
                            }
                        }
                    }

                    // Don't allow conversion from multi-choice to single-choice field if there are multiple choices
                    if ($field->type == 'checkbox' && in_array($new_field['type'], ['dropdown', 'radio'])) {
                        foreach ($field->submissions as $submission) {
                            $value = json_decode($submission->pivot->value);
                            if (is_array($value) && count($value) > 1) {
                                $illegal_type_conversion = true;
                                break;
                            }
                        }
                    }

                    if ($illegal_type_conversion) {
                        $validator->errors()->add(strval($field->id), 'Cannot change field type.');
                    }
                }
            },
        ];
    }
}
