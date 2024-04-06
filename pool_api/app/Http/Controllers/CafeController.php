<?php

namespace App\Http\Controllers;

use App\Models\Cafe;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CafeController extends Controller
{

    public function index(): JsonResponse
    {
        try {
            return response()->json(["response" => Cafe::latest()->get()]);
        } catch (\Exception $e) {
            Log::error("The error from CafeController in index(): " . $e -> getMessage());
            return response() -> json(["err" => "An error in the server. try later"]);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $result = Cafe::create([
                "EmployeName" => $request ->  EmployeName,
                'price' => $request->price,
                "Date" => $request -> Date
            ]);

            return response()->json(["response" => $result -> id]);
        } catch (\Exception $e) {
            Log::error("The error from CafeController in store(): " . $e -> getMessage());
            return response() -> json(["err" => "An error in the server. try later"]);
        }
    }

    public function update(Request $request, Cafe $cafe)
    {
        try {
            $cafe->EmployeName = $request->EmployeName;
            $cafe->price = $request->price;
            $cafe->Date = $request->Date;
            $cafe->save();
            return response()->json(["response" => true]);
        } catch (\Exception $e) {
            Log::error("The error from CafeController in update(): " . $e -> getMessage());
            return response() -> json(["err" => "An error in the server. try later"]);
        }
    }

    public function destroy(Cafe $cafe)
    {
        try {
            $cafe -> delete();
            return response()->json(["response" => true]);
        } catch (\Exception $e) {
            Log::error("The error from CafeController in destroy(): " . $e -> getMessage());
            return response() -> json(["err" => "An error in the server. try later"]);
        }
    }
}
