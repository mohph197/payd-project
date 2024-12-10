<?php

namespace App\Http\Controllers;

use App\Http\Requests\EditSubmissionRequest;
use App\Http\Requests\FormSubmissionRequest;
use App\Models\Form;
use App\Models\Submission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubmissionController extends Controller
{
    /**
     * Show submission details.
     *
     * @param Request $request
     * @param Form $form
     * @param Submission $submission
     * @return \Inertia\Response
     */
    function show(Request $request, Submission $submission)
    {
        $submission->load('form.country', 'fields');
        $form_data = [
            'id' => $submission->form->id,
            'name' => $submission->form->name,
            'fields' => $submission->fields->map(function ($field) {
                return [
                    "id" => $field->id,
                    "name" => $field->name,
                    "category" => $field->category,
                    "order" => $field->order,
                    "type" => $field->type,
                    "required" => $field->required,
                    "options" => json_decode($field->options),
                    "value" => json_decode($field->pivot->value)
                ];
            })->toArray(),
        ];
        $country_data = $submission->form->country->only('currency_code', 'phone_code');
        $owner_id = $submission->user_id;
        $edit_permitted = $owner_id === $request->user()->id;

        return Inertia::render('Form/Show', [
            'form' => $form_data,
            'country' => $country_data,
            'edit_permitted' => $edit_permitted,
            'submission_id' => $submission->id,
        ]);
    }

    /**
     * Edit Submission.
     *
     * @param EditSubmissionRequest $request
     * @param Submission $submission
     * @return \Inertia\Response
     */
    function update(EditSubmissionRequest $request, Submission $submission)
    {
        $fields = $request->input('fields');
        foreach (array_keys($fields) as $field_id) {
            $submission->fields()->updateExistingPivot($field_id, ['value' => json_encode($fields[$field_id])]);
        }

        return redirect()->route('submission.show', ['submission' => $submission->id]);
    }
}
