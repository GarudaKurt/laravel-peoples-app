<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Person;
use Illuminate\Http\Request;

class PersonController extends Controller
{
    public function index()
    {
        return response()->json(Person::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
        ]);

        $person = Person::create($validated);

        return response()->json($person, 201);
    }

    public function update(Request $request, Person $person)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
        ]);

        $person->update($validated);

        return response()->json($person);
    }

    public function destroy(Person $person)
    {
        $person->delete();

        return response()->json(null, 204);
    }
}