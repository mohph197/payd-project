<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FormController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('Forms', [
            'forms' => $request->user()->forms()->select('name', 'id')->get(),
        ]);

        return Inertia::render('Forms');
    }
}
