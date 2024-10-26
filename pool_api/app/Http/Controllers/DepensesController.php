<?php

namespace App\Http\Controllers;

use App\Models\Depenses;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class DepensesController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $data =  Depenses::latest()->get();
            return response()->json(["response" => $data]);
        } catch (\Exception $e) {
            Log::error("The error from DepensesController in index(): " . $e->getMessage());
            return response()->json(["err" => "An error in the server. try later"]);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            // $result = Depenses::create([
            //     'price' => $request->price,
            //     'persone_id' => $request->client_id,
            //     'PaymentMethod' => $request->PaymentMethod,
            //     'name' => $request->name,
            //     'expenseDate' => $request->expenseDate
            // ]);

            $calc = new Depenses();
            $calc -> persone_id = ($request -> persone_id == 'اختر العميل' ? null : $request -> persone_id);
            $calc -> PaymentMethod = $request -> PaymentMethod;
            $calc -> price = $request -> price;
            $calc -> name = $request -> name;
            $calc -> expenseDate = $request -> expenseDate;

            $calc -> save();

            return response()->json(["response" => $calc->id]);
        } catch (\Exception $e) {
            Log::error("The error from DepensesController in store(): " . $e->getMessage());
            return response()->json(["err" => "An error in the server. try later"]);
        }
    }

    public function update(Request $request, Depenses $depense): JsonResponse
    {
        try {
            $depense->persone_id = ($request -> persone_id == 'اختر العميل' ? null : $request -> persone_id);
            $depense->PaymentMethod = $request -> PaymentMethod;
            $depense->price = $request->price;
            $depense->name = $request->name;
            $depense->expenseDate = $request->expenseDate;
            $depense->save();
            return response()->json(["response" => true]);
        } catch (\Exception $e) {
            Log::error("The error from DepensesController in update(): " . $e->getMessage());
            return response()->json(["err" => "An error in the server. try later"]);
        }
    }

    public function destroy(Depenses $depense)
    {
        try {
            $depense->delete();
            return response()->json(["response" => true]);
        } catch (\Exception $e) {
            Log::error("The error from DepensesController in destroy(): " . $e->getMessage());
            return response()->json(["err" => "An error in the server. try later"]);
        }
    }
}
