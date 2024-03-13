<?php

namespace App\Http\Controllers;

use App\Models\Salle;
use Illuminate\Http\Request;
use Carbon\Carbon;

class SalleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Salle::where("is_salle", 0)->latest()->get());
    }

    public function index_salle()
    {
        return response()->json(Salle::where("is_salle", 1)->latest()->get());
    }

    /*
    formData.append('name', name)
    formData.append('number', number)
    formData.append('price', price)
    formData.append('dateStart', dateStart)
    formData.append('dateEnd', dateEnd)
    formData.append('is_salle', 0)
    */

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $dateStart = Carbon::parse($request->dateStart);
        $dateEnd = Carbon::parse($request->dateEnd);
        $differenceInDays = $dateEnd->diffInDays($dateStart);
        // $differenceInHours = $dateEnd->diffInHours($dateStart);

        Salle::create([
            'name_client' => $request->name,
            'telephone' => $request->number,
            'price' => $request->price,
            'date_start' => $request->dateStart,
            'date_end' => $request->dateEnd,
            'total_date' => $differenceInDays,
            'is_salle' => $request->is_salle,
        ]);
        return response()->json(true);
    }

    /**
     * Display the specified resource.
     */
    public function show(Salle $salle)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Salle $salle)
    {

        $dateStart = Carbon::parse($request->dateStart);
        $dateEnd = Carbon::parse($request->dateEnd);
        $differenceInDays = $dateEnd->diffInDays($dateStart);

        $salle->name_client = $request->name;
        $salle->telephone = $request->number;
        $salle->price = $request->price;
        $salle->date_start = $request->dateStart;
        $salle->date_end = $request->dateEnd;
        $salle->total_date = $differenceInDays;
        $salle->is_salle = $request->is_salle;
        $salle->save();
        return response()->json(true);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Salle $salle)
    {
        $salle->delete();
        return response()->json(true);
    }
}
