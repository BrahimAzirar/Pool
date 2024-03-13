<?php

namespace App\Http\Controllers;

use App\Models\Depenses;
use Illuminate\Http\Request;

class DepensesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Depenses::latest()->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        Depenses::create([
            'price' => $request->price,
            'name' => $request->name
        ]);
        return response()->json(true);
    }

    /**
     * Display the specified resource.
     */
    public function show(Depenses $depenses)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Depenses $depense)
    {
        $depense->price = $request->price;
        $depense->name = $request->name;
        $depense->save();
        return response()->json(true);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Depenses $depense)
    {
        $depense->delete();
        return response()->json(true);
    }
}
