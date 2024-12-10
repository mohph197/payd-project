<?php

namespace App\Http\Requests;

use App\Models\Field;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class FormSubmissionRequest extends FormRequest
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
            "fields" => "required|array",
        ];
    }

    /**
     * Get the "after" validation callables for the request.
     */
    public function after(): array
    {
        return [
            function (Validator $validator) {
                $fields_ids = array_keys($validator->validated()['fields']);
                $form_fields_ids = $this->form->fields->pluck('id')->toArray();
                if (count($fields_ids) !== count($form_fields_ids) || count(array_diff($form_fields_ids, $fields_ids)) > 0) {
                    $validator->errors()->add('fields', 'Some fields are missing or invalid.');
                }

                $fields = $this->form->fields;
                foreach ($fields as $field) {
                    $value = $validator->validated()['fields'][$field->id] ?? null;
                    if ($field->required && is_null($value)) {
                        $validator->errors()->add(strval($field->id), 'This field is required.');
                    }
                }
            },
        ];
    }
}
