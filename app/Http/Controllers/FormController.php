<?php

namespace App\Http\Controllers;

use App\Http\Requests\FormCreationRequest;
use App\Http\Requests\FormSubmissionRequest;
use App\Models\Country;
use App\Models\Field;
use App\Models\Form;
use App\Models\Submission;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

use function PHPSTORM_META\map;

class FormController extends Controller
{
    /**
     * Show the forms view.
     *
     * @param Request $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        /**
         * @var User $user
         */
        $user = $request->user();

        // Get all forms and their edit URLs for the current user
        $forms = $user->forms()->select('id', 'name')->get();

        // Get all submissions made by the current user
        $submissions = $user->submissions()->get()->map(function ($submission) {
            $submission->load('form');
            return [
                'id' => $submission->id,
                'form_name' => $submission->form->name,
            ];
        });

        // Render the Forms view with the forms data
        return Inertia::render('Forms', [
            'forms' => $forms,
            'submissions' => $submissions,
        ]);
    }

    /**
     * Show the form create view.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        $countries = Country::select('code', 'name')->get()->toArray();

        return Inertia::render('Form/Create', [
            'countries' => $countries,
        ]);
    }

    /**
     * Store a new form.
     *
     * @param FormCreationRequest $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(FormCreationRequest $request)
    {
        $form = new Form();
        $form->name = $request->input('name');
        $form->country_code = $request->input('country_code');
        $form->user_id = $request->user()->id;
        $form->save();

        $fields = $request->input('fields');
        $fields = $fields->map(function ($field) {
            if (isset($field['options'])) {
                $field['options'] = json_encode($field['options']);
            }
            return $field;
        });

        $form->fields()->createMany($fields);

        return redirect()->route('dashboard');
    }

    /**
     * Show the form view.
     *
     * @param Form $form
     * @param Form $form
     * @return \Inertia\Response
     */
    public function show(Request $request, Form $form)
    {
        // Get the form along with its fields
        $form_data = $form->load('fields')->only('id', 'name', 'fields');

        // Convert the fields options to an array
        $form_data['fields'] = $form_data['fields']->map(function (Field $field) {
            if (isset($field['options'])) {
                $field['options'] = json_decode($field['options']);
            }
            return Arr::except($field->toArray(), ['form_id', 'created_at', 'updated_at']);
        })->toArray();

        $country_data = $form->country()->select('currency_code', 'phone_code')->first();
        $owner_id = $form->user_id;
        $edit_permitted = $owner_id === $request->user()->id;

        return Inertia::render('Form/Show', [
            'form' => $form_data,
            'country' => $country_data,
            'edit_permitted' => $edit_permitted,
        ]);
    }

    /**
     * Submit a form.
     *
     * @param FormSubmissionRequest $request
     * @param Form $form
     * @return \Illuminate\Http\RedirectResponse
     */
    public function submit(FormSubmissionRequest $request, Form $form)
    {
        $submission = $form->submissions()->create([
            'user_id' => $request->user()->id,
        ]);

        $fields = $request->input('fields');
        foreach (array_keys($fields) as $field_id) {
            $submission->fields()->attach($field_id, ['value' => json_encode($fields[$field_id])]);
        }

        return redirect()->route('dashboard');
    }
}
