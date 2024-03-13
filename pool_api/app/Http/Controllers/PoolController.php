<?php

namespace App\Http\Controllers;

use App\Models\Pool;
use Illuminate\Http\Request;

class PoolController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Pool::latest()->get());
    }
// `references_pool`, `offer`, `add_person`, `total`
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        Pool::create([
            'references_pool' => 'pool-' . date("Ymd") . '-'. date("his"),
            'offer' => $request->offer,
            'add_person' => $request->person,
            'total' => $request->person * $request->offer,
        ]);
        return response()->json(true);
    }

    /**
     * Display the specified resource.
     */
    public function show(Pool $pool)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Pool $pool)
    {
        $pool->offer = $request->offer;
        $pool->add_person = $request->person;
        $pool->total = $request->person * $request->offer;
        $pool->save();
        return response()->json(true);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Pool $pool)
    {
        $pool->delete();
        return response()->json(true);
    }
}
