<?php

namespace App\Http\Controllers;

use App\Models\Cafe;
use Illuminate\Http\Request;

class CafeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Cafe::latest()->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        Cafe::create([
            'price' => $request->price
        ]);
        return response()->json(true);
    }

    /**
     * Display the specified resource.
     */
    public function show(Cafe $cafe)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Cafe $cafe)
    {
        $cafe->price = $request->price;
        $cafe->save();
        return response()->json(true);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Cafe $cafe)
    {
        $cafe->delete();
        return response()->json(true);
    }
}
